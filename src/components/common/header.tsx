import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router";
import { LOGOUT } from "@/api/auth/api";
import { Button } from "@/components/ui/button";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useUserStore } from "@/store/user";

export function DashboardHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  const [isOpen, setIsOpen] = useState(false);

  const ref = useClickOutside<HTMLDivElement>({
    enabled: isOpen,
    onClickOutside: () => setIsOpen(false),
  });

  const initials = user
    ? `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`
    : "";

  const logoutMutation = useMutation({
    mutationFn: LOGOUT,
    onSettled: () => {
      localStorage.removeItem("token");
      clearUser();
      queryClient.clear();
      navigate("/sign-in", { replace: true });
    },
  });

  return (
    <div className="h-14 lg:h-16 shrink-0 w-full bg-white flex items-center padding-inline border-b border-border">
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden cursor-pointer"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div ref={ref} className="relative ml-auto">
        <button
          type="button"
          onClick={() => setIsOpen((previous) => !previous)}
          className="size-8 rounded-full bg-primary-dark flex items-center justify-center text-sm font-medium text-white uppercase cursor-pointer"
        >
          {initials}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border bg-white p-3 shadow-lg z-50 flex flex-col gap-3">
            {user && (
              <div className="flex flex-col text-sm">
                <span className="font-medium">
                  {user.firstname} {user.lastname}
                </span>

                <span className="text-xs text-faded truncate">
                  {user.email}
                </span>
              </div>
            )}

            <Button
              variant="destructive"
              className="w-full rounded-[10px]"
              disabled={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
            >
              {logoutMutation.isPending ? "Logging out..." : "Log out"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
