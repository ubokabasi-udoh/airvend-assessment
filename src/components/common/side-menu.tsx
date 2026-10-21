import { sideMenuIcons } from "@/assets/icons/side-menu";
import { AirvendLogo } from "@/assets/logo";
import { cn } from "cn";
import { Link, useLocation } from "react-router";

export function DashboardSideMenu() {
  type TMenuItem = {
    label: string;
    href: string;
    icon: React.ReactElement;
    iconActive: React.ReactElement;
  };

  const menuList: TMenuItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: sideMenuIcons.dashboard(),
      iconActive: sideMenuIcons.dashboard("#FFFFFF"),
    },
    {
      label: "User Management",
      href: "/dashboard/users",
      icon: sideMenuIcons.users(),
      iconActive: sideMenuIcons.users("#FFFFFF"),
    },
    {
      label: "Funding History",
      href: "/dashboard/funding",
      icon: sideMenuIcons.funding(),
      iconActive: sideMenuIcons.funding("#FFFFFF"),
    },
    {
      label: "USSD Extension",
      href: "/dashboard/ussd",
      icon: sideMenuIcons.ussd(),
      iconActive: sideMenuIcons.ussd("#FFFFFF"),
    },
    {
      label: "API key Management",
      href: "/dashboard/api",
      icon: sideMenuIcons.verification(),
      iconActive: sideMenuIcons.verification("#FFFFFF"),
    },
  ];

  const {pathname} = useLocation()
  console.log(pathname)

  return (
    <div className="h-full min-w-fit w-1/5 max-w-[300px] bg-white border-r border-border">
      <div className="h-16 border-b border-border flex items-center px-4">
        <AirvendLogo />
      </div>

      <div className="px-4 py-6 flex flex-col gap-2 text-faded text-sm lg:text-base">
        {menuList.map((menu) => {

          const isActive = menu.href == "/dashboard" ? menu.href==pathname : pathname.includes(menu.href) 

          return (
            <Link key={menu.label} to={menu.href} className={cn("h-12 rounded-lg flex items-center gap-2 px-3 text-nowrap", isActive?'bg-primary-dark text-white ':'')}>
              <figure>{isActive?menu.iconActive: menu.icon}</figure>
              {menu.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
