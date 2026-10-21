
import { useClickOutside } from "@/hooks/useClickOutside";
import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type SideModalProps = {
  isOpen: boolean;
  onClose: () => void;
  side?: "left" | "right";
  width?: number | string;
  children: ReactNode;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  showBackdrop?: boolean;
  className?: string;
};

export function SideModal({
  isOpen,
  onClose,
  side = "right",
  width = 450,
  children,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  showBackdrop = true,
  className = "",
}: SideModalProps) {
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const panelRef = useClickOutside<HTMLDivElement>({
    enabled: mounted && visible && closeOnOutsideClick,
    onClickOutside: handleClose,
  });

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isOpen) {
      setMounted(true);

      // Allow the initial off-screen state to render.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);

      timeout = setTimeout(() => {
        setMounted(false);
      }, 300);
    }

    return () => clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!mounted || !closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mounted, closeOnEscape, handleClose]);

  if (!mounted) return null;

  const isRight = side === "right";

  return (
    <div
      className="fixed inset-0 z-50"
      aria-hidden={!visible}
    >
      {/* Backdrop */}
      {showBackdrop && (
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Sliding panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={`absolute inset-y-4 ${
          isRight ? "right-4" : "left-4"
        } w-[calc(100%-2rem)] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl bg-white shadow-xl transition-transform duration-300 ease-in-out dark:bg-gray-900 ${
          visible
            ? "translate-x-0"
            : isRight
              ? "translate-x-[calc(100%+1rem)]"
              : "-translate-x-[calc(100%+1rem)]"
        } ${className}`}
        style={{ width }}
      >
        {children}
      </div>
    </div>
  );
}
