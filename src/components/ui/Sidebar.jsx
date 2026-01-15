import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Ticket,
  Plus,
  Users,
  Settings,
  X,
  HelpingHand,
  BarChart3,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["user", "agent", "admin"],
  },
  {
    name: "All Tickets",
    href: "/tickets",
    icon: Ticket,
    roles: ["agent", "admin"],
  },
  { name: "My Tickets", href: "/tickets", icon: Ticket, roles: ["user"] },
  {
    name: "Create Ticket",
    href: "/tickets/new",
    icon: Plus,
    roles: ["user", "agent", "admin"],
  },
  { name: "Users", href: "/users", icon: Users, roles: ["admin"] },
  { name: "Reports", href: "/reports", icon: BarChart3, roles: ["admin"] },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["admin"] },
];

export const Sidebar = ({ isOpen, onToggle, userRole = "user" }) => {
  const location = useLocation();

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="bg-surface-900/50 fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`glass border-surface-200 fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-white! transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-surface-200 flex h-16 items-center justify-between border-b px-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary-600 flex size-8 items-center justify-center rounded-lg shadow-lg">
                <HelpingHand className="size-5 text-white" />
              </div>
              <span className="text-surface-900 text-lg font-semibold">
                HelpDesk
              </span>
            </Link>

            <button
              onClick={onToggle}
              className="hover:bg-surface-100 rounded-md p-1 transition-colors lg:hidden"
            >
              <X className="text-surface-600 size-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-2 py-6">
            {filteredNavigation.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href === "/tickets" &&
                  /^\/tickets(\/\w+)?$/.test(location.pathname) &&
                  location.pathname !== "/tickets/new");

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded px-3 py-2.5 font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary-50 text-primary-700 border-primary-600 border-r-4 shadow-sm"
                      : "text-surface-700 hover:bg-surface-50 hover:text-surface-900"
                  } `}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                >
                  <item.icon
                    className={`mr-3 size-5 transition-colors ${
                      isActive
                        ? "text-primary-600"
                        : "text-surface-500 group-hover:text-surface-700"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-surface-200 border-t p-4">
            <div className="text-surface-500 text-center text-xs">
              Role:{" "}
              <span className="text-surface-700 font-medium capitalize">
                {userRole}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
