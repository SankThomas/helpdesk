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
          className="fixed inset-0 z-40 bg-gray-900/70 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-600 bg-gray-900 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-800 px-2 py-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary-600 flex size-8 items-center justify-center rounded-lg shadow-lg">
                <HelpingHand className="size-5 text-white" />
              </div>
              <span className="text-lg! font-semibold text-gray-100">
                HelpDesk
              </span>
            </Link>

            <button
              onClick={onToggle}
              className="rounded-md p-1 transition-colors hover:bg-gray-100 lg:hidden"
            >
              <X className="size-5 text-gray-600" />
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
                  className={`flex items-center rounded px-3 py-2.5 font-medium transition-all duration-200 ${
                    isActive
                      ? "text-primary-500 border-primary-600 border-r-4 bg-gray-800"
                      : "text-gray-200 hover:bg-gray-800"
                  } `}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                >
                  <item.icon
                    className={`mr-3 size-5 transition-colors ${
                      isActive ? "text-primary-600" : "text-gray-100"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-800 p-4">
            <div className="text-center text-xs text-gray-500">
              Role:{" "}
              <span className="font-medium text-gray-100 capitalize">
                {userRole}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
