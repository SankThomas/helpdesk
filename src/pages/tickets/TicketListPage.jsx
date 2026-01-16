import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { StatusIndicator } from "../../components/ui/StatusIndicator";
import { PriorityIndicator } from "../../components/ui/PriorityIndicator";
import { Plus, Search, Ticket } from "lucide-react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { format } from "date-fns";

export const TicketListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "",
  );
  const [priorityFilter, setPriorityFilter] = useState(
    searchParams.get("priority") || "",
  );

  const { currentUser } = useCurrentUser();

  // Get all agents for assignment dropdown
  // const agents = useQuery(api.users.getAllAgents);

  // Get tickets with filters
  const tickets = useQuery(
    api.tickets.getTickets,
    currentUser
      ? {
          userId: currentUser._id,
          userRole: currentUser.role,
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
        }
      : "skip",
  );

  // Search tickets
  const searchResults = useQuery(
    api.tickets.searchTickets,
    currentUser && searchTerm.trim()
      ? {
          searchTerm: searchTerm.trim(),
          userRole: currentUser.role,
          userId: currentUser._id,
        }
      : "skip",
  );

  const displayTickets = searchTerm.trim() ? searchResults : tickets;

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    if (status) {
      searchParams.set("status", status);
    } else {
      searchParams.delete("status");
    }
    setSearchParams(searchParams);
  };

  const handlePriorityFilter = (priority) => {
    setPriorityFilter(priority);
    if (priority) {
      searchParams.set("priority", priority);
    } else {
      searchParams.delete("priority");
    }
    setSearchParams(searchParams);
  };

  if (!currentUser) {
    return <LoadingSpinner />;
  }

  const canCreateTickets = ["user", "agent", "admin"].includes(
    currentUser.role,
  );
  const isAgentOrAdmin = ["agent", "admin"].includes(currentUser.role);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentUser.role === "user" ? "My Tickets" : "All Tickets"}
          </h1>
          <p className="text-gray-600">
            {currentUser.role === "user"
              ? "Manage your support tickets"
              : "Manage customer support tickets"}
          </p>
        </div>
        {canCreateTickets && (
          <Link to="/tickets/new">
            <Button className="flex items-center space-x-2">
              <Plus className="size-4" />
              <span>New Ticket</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3!">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </Select>

            <Select
              value={priorityFilter}
              onChange={(e) => handlePriorityFilter(e.target.value)}
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setStatusFilter("");
                setPriorityFilter("");
                setSearchTerm("");
                setSearchParams({});
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {searchTerm ? "Search Results" : "Tickets"}
            </h2>
            <div className="text-sm text-gray-600">
              {displayTickets?.length || 0} tickets
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!displayTickets ? (
            <div className="flex flex-wrap items-center justify-center gap-2 py-8">
              <div className="border-primary-600 size-8 animate-spin rounded-full border-b-2"></div>
            </div>
          ) : displayTickets.length === 0 ? (
            <div className="py-12 text-center">
              <Ticket className="mx-auto mb-4 size-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {searchTerm ? "No tickets found" : "No tickets yet"}
              </h3>
              <p className="mb-6 text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms or filters"
                  : "Create your first ticket to get started"}
              </p>
              {canCreateTickets && !searchTerm && (
                <Link to="/tickets/new">
                  <Button>Create Ticket</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {displayTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className={`rounded-lg border p-2 transition-colors ${ticket.status === "resolved" ? "border-green-100 bg-green-50 hover:bg-green-100" : ticket.status === "pending" ? " border-red-100 bg-red-50 hover:bg-red-100" : ticket.status === "open" ? "border-rose-100 bg-rose-50 hover:bg-rose-100" : ticket.status === "closed" ? "border-gray-100 bg-gray-50 hover:bg-gray-100" : "border-gray-100 bg-gray-50 hover:bg-gray-100"}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/tickets/${ticket._id}`}
                        className="hover:text-primary-600 block transition-colors"
                      >
                        <h3 className="mb-2 font-semibold text-gray-900">
                          {ticket.title}
                        </h3>
                        <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                          {ticket.description}
                        </p>
                      </Link>

                      <div className="flex flex-wrap items-center gap-2 space-x-4 text-sm text-gray-500">
                        <span>By {ticket.user?.name}</span>
                        {isAgentOrAdmin && ticket.assignedUser && (
                          <span>Assigned to {ticket.assignedUser.name}</span>
                        )}
                        <span>
                          Assigned on:{" "}
                          {format(new Date(ticket.createdAt), "PP")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <PriorityIndicator priority={ticket.priority} size="sm" />
                      <StatusIndicator status={ticket.status} size="sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
