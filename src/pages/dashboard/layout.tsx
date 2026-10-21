import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useNavigate } from "react-router";
import { GET_LOGGED_IN_USER } from "@/api/auth/api";
import { DashboardHeader } from "@/components/common/header";
import { DashboardSideMenu } from "@/components/common/side-menu";
import { useUserStore } from "@/store/user";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [menuOpen, setMenuOpen] = useState(false);

  const hasToken = !!localStorage.getItem("token");

  const { data } = useQuery({
    queryKey: ["logged-in-user"],
    queryFn: GET_LOGGED_IN_USER,
    enabled: !user && hasToken,
  });

  useEffect(() => {
    if (!user && data?.user) setUser(data.user);
  }, [user, data, setUser]);

  useEffect(() => {
    if (!user && !hasToken) navigate("/sign-in", { replace: true });
  }, [user, hasToken, navigate]);

  return (
    <div className="w-full h-dvh bg-dashboard-background flex">
      <DashboardSideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex-1 min-w-0 h-full flex flex-col">
        <DashboardHeader onMenuClick={() => setMenuOpen(true)} />
        <div className="padding-inline padding-block flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
