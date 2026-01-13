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
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-surface-900/50 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 glass border-r border-surface-200 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-2 border-b border-surface-200">
            <Link to="/" className="flex items-center space-x-2">
              <div className="size-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                <HelpingHand className="size-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-surface-900">
                HelpDesk
              </span>
            </Link>

            <button
              onClick={onToggle}
              className="lg:hidden p-1 rounded-md hover:bg-surface-100 transition-colors"
            >
              <X className="size-5 text-surface-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-6 space-y-2">
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
                  className={`
                    group flex items-center px-3 py-2.5 rounded font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary-50 text-primary-700 shadow-sm border-r-4 border-primary-600"
                        : "text-surface-700 hover:bg-surface-50 hover:text-surface-900"
                    }
                  `}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                >
                  <item.icon
                    className={`size-5 mr-3 transition-colors ${
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
          <div className="p-4 border-t border-surface-200">
            <div className="text-xs text-surface-500 text-center">
              Role:{" "}
              <span className="capitalize font-medium text-surface-700">
                {userRole}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
