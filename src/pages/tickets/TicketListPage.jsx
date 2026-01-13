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
    searchParams.get("status") || ""
  );
  const [priorityFilter, setPriorityFilter] = useState(
    searchParams.get("priority") || ""
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
      : "skip"
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
      : "skip"
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
    currentUser.role
  );
  const isAgentOrAdmin = ["agent", "admin"].includes(currentUser.role);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            {currentUser.role === "user" ? "My Tickets" : "All Tickets"}
          </h1>
          <p className="text-surface-600">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 size-4" />
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
            <h2 className="text-lg font-semibold text-surface-900">
              {searchTerm ? "Search Results" : "Tickets"}
            </h2>
            <div className="text-sm text-surface-600">
              {displayTickets?.length || 0} tickets
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!displayTickets ? (
            <div className="flex flex-wrap gap-2 items-center justify-center py-8">
              <div className="animate-spin rounded-full size-8 border-b-2 border-primary-600"></div>
            </div>
          ) : displayTickets.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="size-12 text-surface-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-surface-900 mb-2">
                {searchTerm ? "No tickets found" : "No tickets yet"}
              </h3>
              <p className="text-surface-500 mb-6">
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
                  className="border border-surface-200 rounded-lg p-2 hover:bg-surface-50 transition-colors"
                >
                  <div className="flex flex-wrap gap-2 items-start justify-between">
                    <div>
                      <Link
                        to={`/tickets/${ticket._id}`}
                        className="block hover:text-primary-600 transition-colors"
                      >
                        <h3 className="font-semibold text-surface-900 mb-2">
                          {ticket.title}
                        </h3>
                        <p className="text-surface-600 text-sm line-clamp-2 mb-3">
                          {ticket.description}
                        </p>
                      </Link>

                      <div className="flex flex-wrap gap-2 items-center space-x-4 text-sm text-surface-500">
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
