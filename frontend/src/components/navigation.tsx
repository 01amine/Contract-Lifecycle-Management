import { Link, useLocation } from "@tanstack/react-router";
import {
  ClipboardListIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PlusIcon,
  FileTextIcon,
  UploadIcon,
  SearchCheckIcon,
  PenToolIcon,
  BotIcon,
  SettingsIcon,
  User2,
} from "lucide-react";
import logo from "@/assets/logo-square.svg";
import { NavItem } from "@/components/nav-item";

const topNavItems = [
  {
    icon: LayoutDashboardIcon,
    label: "Dashboard",
    to: "/dashboard",
  },
  {
    icon: ClipboardListIcon,
    label: "Contracts",
    to: "/contracts",
  },
  {
    icon: FileTextIcon,
    label: "Templates",
    to: "/templates",
  },
  {
    icon: UploadIcon,
    label: "Upload",
    to: "/upload",
  },
  {
    icon: SearchCheckIcon,
    label: "Review",
    to: "/review",
  },
  {
    icon: PenToolIcon,
    label: "Draft",
    to: "/draft",
  },
  {
    icon: BotIcon,
    label: "AI Assistant",
    to: "/assistant",
  },
  {
    icon: SettingsIcon,
    label: "Settings",
    to: "/settings",
  },
];

const bottomNavItems = [
  {
    icon: User2,
    label: "Profile",
    to: "/profile",
  },
  {
    icon: LogOutIcon,
    label: "Logout",
    to: "/logout",
  },
];

export function Navigation() {
  const location = useLocation();

  return (
    <aside className="flex flex-col gap-4 justify-between h-full">
      <nav className="rounded-full bg-card p-4 shadow-island border">
        <ul className="flex flex-col gap-6 text-sm pb-6">
          <li>
            <Link to="/">
              <img src={logo} alt="Logo" className="size-6 scale-135" />
            </Link>
          </li>
          {topNavItems.map((item) => (
            <NavItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={location.pathname === item.to}
            />
          ))}
          <li>
            <Link to="/contracts/create">
              <button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 p-1 scale-115 cursor-pointer">
                <PlusIcon className="size-4" strokeWidth={2.5} />
              </button>
            </Link>
          </li>
        </ul>
      </nav>
      <nav className="rounded-full bg-card p-4 shadow-island border">
        <ul className="flex flex-col gap-4 text-sm">
          {bottomNavItems.map((item, index) => (
            <>
              <NavItem
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
                active={location.pathname === item.to}
              />
              {index < bottomNavItems.length - 1 && <hr />}
            </>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
