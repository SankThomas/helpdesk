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
      : "skip",
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
            prev < searchResults.length - 1 ? prev + 1 : prev,
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
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-gray-400" />
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
          className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-10 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:ring-1 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {isOpen && query.trim() && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
          {!searchResults ? (
            <div className="p-4 text-center">
              <div className="border-primary-600 mx-auto size-6 animate-spin rounded-full border-b-2"></div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No tickets found for "{query}"
            </div>
          ) : (
            <div className="py-2">
              {searchResults.map((ticket, index) => (
                <div
                  key={ticket._id}
                  className={`cursor-pointer px-2 py-3 transition-colors ${
                    index === selectedIndex
                      ? "bg-primary-50"
                      : "hover:bg-gray-50"
                  } `}
                  onClick={() => handleResultClick(ticket._id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-medium text-gray-900">
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

                      <p className="mt-1 truncate text-sm text-gray-600">
                        {ticket.description}
                      </p>
                      <div className="mt-2 flex items-center space-x-3 text-xs text-gray-500">
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
