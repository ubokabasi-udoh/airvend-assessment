
import { useEffect, useRef } from "react";

type UseClickOutsideOptions = {
  enabled?: boolean;
  onClickOutside: (event: MouseEvent | TouchEvent) => void;
};

export function useClickOutside<T extends HTMLElement = HTMLDivElement>({
  enabled = true,
  onClickOutside,
}: UseClickOutsideOptions) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleOutside = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;

      if (element && !element.contains(event.target as Node)) {
        onClickOutside(event);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [enabled, onClickOutside]);

  return ref;
}
