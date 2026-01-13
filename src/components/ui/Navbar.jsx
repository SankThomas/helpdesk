import { Menu, ChevronDown, ChevronUp, Cog, LogOut } from "lucide-react";
import { Button } from "./Button";
import { NotificationDropdown } from "./NotificationDropdown";
import { SearchBar } from "./SearchBar";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";

export const Navbar = ({ onMenuClick, user }) => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const dropdownRef = useRef(null);

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
    <header className="glass border-b border-surface-200 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-2">
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

        <div className="flex-1 max-w-md mx-8 hidden lg:block">
          <SearchBar currentUser={user} />
        </div>

        <div className="flex items-center space-x-3">
          <NotificationDropdown user={user} />

          <div className="relative" ref={dropdownRef}>
            <p
              className="flex items-center gap-2 cursor-pointer"
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
              <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-xl glass bg-white! z-50 animate-bounce-in p-4">
                <div className="pb-2">
                  <h4 className="text-base!">{user?.name}</h4>
                  <small className="text-surface-500 text-sm!">
                    Role: {user?.role}
                  </small>
                </div>

                <div className="border-y border-surface-300 py-4">
                  {/* Add handleNavigate to close dropdown */}
                  <Link to="/settings" className="flex items-center gap-2">
                    <Cog className="size-4" /> Settings
                  </Link>
                </div>

                <div className="border-surface-300 py-4">
                  <SignOutButton>
                    <div className="cursor-pointer flex items-center gap-2">
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
