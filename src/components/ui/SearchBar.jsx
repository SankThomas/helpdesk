import { useState, useRef, useEffect } from "react";
import { Search, X, Clock, User, Tag } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { Badge } from "./Badge";

export const SearchBar = ({ currentUser }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const searchResults = useQuery(
    api.tickets.searchTickets,
    query.trim() && currentUser
      ? {
          searchTerm: query.trim(),
          userRole: currentUser.role,
          userId: currentUser._id,
        }
      : "skip"
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }

      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }

      if (isOpen && searchResults?.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
        }

        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        }

        if (e.key === "Enter" && selectedIndex >= 0) {
          e.preventDefault();
          navigate(`/tickets/${searchResults[selectedIndex]._id}`);
          setIsOpen(false);
          setQuery("");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, searchResults, selectedIndex, navigate]);

  const handleResultClick = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
    setIsOpen(false);
    setQuery("");
  };

  const statusColors = {
    open: "error",
    pending: "warning",
    resolved: "success",
    closed: "default",
  };

  const priorityColors = {
    low: "default",
    medium: "warning",
    high: "error",
    urgent: "error",
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 size-4" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search tickets... (Ctrl + /)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          className="
            w-full pl-10 pr-10 py-2 border border-surface-300 rounded-lg
            bg-white text-surface-900 placeholder:text-surface-400
            focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
            transition-all duration-200
          "
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-surface-200 z-50 max-h-96 overflow-y-auto">
          {!searchResults ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full size-6 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center text-surface-500">
              No tickets found for "{query}"
            </div>
          ) : (
            <div className="py-2">
              {searchResults.map((ticket, index) => (
                <div
                  key={ticket._id}
                  className={`
                    px-2 py-3 cursor-pointer transition-colors
                    ${
                      index === selectedIndex
                        ? "bg-primary-50"
                        : "hover:bg-surface-50"
                    }
                  `}
                  onClick={() => handleResultClick(ticket._id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-surface-900 truncate">
                        {ticket.title}
                      </h4>

                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={priorityColors[ticket.priority]}
                          size="sm"
                        >
                          {ticket.priority}
                        </Badge>
                        <Badge variant={statusColors[ticket.status]} size="sm">
                          {ticket.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-surface-600 truncate mt-1">
                        {ticket.description}
                      </p>
                      <div className="flex items-center space-x-3 mt-2 text-xs text-surface-500">
                        <div className="flex items-center space-x-1">
                          <User className="size-3" />
                          <span>{ticket.user?.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="size-3" />
                          <span>
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
