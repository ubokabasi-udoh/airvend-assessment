import { sideMenuIcons } from "@/assets/icons/side-menu";
import { AirvendLogo } from "@/assets/logo";
import { cn } from "cn";
import { Link, useLocation } from "react-router";

type DashboardSideMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function DashboardSideMenu({ isOpen, onClose }: DashboardSideMenuProps) {
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

  const { pathname } = useLocation();

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 lg:h-full lg:min-w-fit lg:w-1/5 lg:max-w-[300px] bg-white border-r border-border",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-14 lg:h-16  border-b border-border flex items-center px-4">
          <AirvendLogo />
        </div>

        <div className="px-3 lg:px-4 py-4 lg:py-8 flex flex-col gap-2 text-faded text-xs lg:text-base">
          {menuList.map((menu) => {
            const isActive =
              menu.href == "/dashboard"
                ? menu.href == pathname
                : pathname.includes(menu.href);

            return (
              <Link
                key={menu.label}
                to={menu.href}
                onClick={onClose}
                className={cn(
                  "h-10 lg:h-12 rounded-lg flex items-center gap-2 px-3 text-nowrap",
                  isActive ? "bg-primary-dark text-white " : "",
                )}
              >
                <figure>{isActive ? menu.iconActive : menu.icon}</figure>
                {menu.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
