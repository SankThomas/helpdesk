import { Menu, ChevronDown, ChevronUp, Cog, LogOut } from "lucide-react";
import { Button } from "./Button";
import { NotificationDropdown } from "./NotificationDropdown";
import { SearchBar } from "./SearchBar";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import { useCurrentUser } from "../../hooks/useCurrentUser";

export const Navbar = ({ onMenuClick, user }) => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const dropdownRef = useRef(null);
  const { isAdmin } = useCurrentUser();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="glass border-surface-200 sticky top-0 z-40 border-b">
      <div className="flex h-16 items-center justify-between px-2">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="size-5" />
          </Button>
        </div>

        <div className="mx-8 hidden max-w-md flex-1 lg:block">
          <SearchBar currentUser={user} />
        </div>

        <div className="flex items-center space-x-3">
          <NotificationDropdown user={user} />

          <div className="relative" ref={dropdownRef}>
            <p
              className="flex cursor-pointer items-center gap-2"
              onClick={() => setDropdownMenu(!dropdownMenu)}
            >
              <small>{user?.name}</small>
              {dropdownMenu ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </p>

            {dropdownMenu && (
              <div className="glass animate-bounce-in absolute right-0 z-50 mt-2 w-72 rounded-xl bg-white! p-4 shadow-xl">
                <div className="pb-2">
                  <h4 className="text-base!">{user?.name}</h4>
                  <small className="text-surface-500 text-sm!">
                    Role: {user?.role}
                  </small>
                </div>

                {isAdmin && (
                  <div className="border-surface-300 border-y py-4">
                    {/* Add handleNavigate to close dropdown */}
                    <Link
                      to="/settings"
                      onClick={() => setDropdownMenu(false)}
                      className="flex items-center gap-2"
                    >
                      <Cog className="size-4" /> Settings
                    </Link>
                  </div>
                )}

                <div
                  className={`border-surface-300 py-4 ${!isAdmin && "border-t"}`}
                >
                  <SignOutButton>
                    <div className="flex cursor-pointer items-center gap-2">
                      <LogOut className="size-4" />
                      Log Out
                    </div>
                  </SignOutButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
