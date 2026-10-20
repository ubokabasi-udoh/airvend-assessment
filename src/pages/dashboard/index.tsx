import { DashboardHeader } from "@/components/common/header";
import { DashboardSideMenu } from "@/components/common/side-menu";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <div className="w-full h-dvh bg-dashboard-background flex">
      <DashboardSideMenu />
      <div className="flex-1 h-full flex flex-col">
        <DashboardHeader />
        <div className="padding-inline padding-block flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
