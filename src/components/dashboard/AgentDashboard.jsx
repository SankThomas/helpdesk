import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Ticket, Clock, User, AlertTriangle } from "lucide-react";

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

export const AgentDashboard = ({ user }) => {
  const allTickets = useQuery(api.tickets.getTickets, {
    userRole: user.role,
  });

  const myTickets = useQuery(api.tickets.getTickets, {
    userRole: user.role,
    assignedTo: user._id,
  });

  const unassignedTickets = allTickets?.filter((t) => !t.assignedTo) || [];
  const urgentTickets =
    allTickets?.filter(
      (t) => t.priority === "urgent" && t.status !== "resolved",
    ) || [];

  const stats = {
    total: allTickets?.length || 0,
    assigned: myTickets?.length || 0,
    unassigned: unassignedTickets.length,
    urgent: urgentTickets.length,
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
        <p className="text-gray-600">Manage customer support tickets</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Ticket className="text-primary-600 size-8" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Tickets
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="size-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Assigned to Me
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.assigned}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="size-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unassigned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.unassigned}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="size-8 text-rose-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.urgent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Unassigned Tickets */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Unassigned Tickets
              </h2>
              <Link to="/tickets?filter=unassigned">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {unassignedTickets.length === 0 ? (
              <div className="py-8 text-center">
                <Ticket className="mx-auto mb-3 size-12 text-gray-400" />
                <p className="text-gray-500">No unassigned tickets</p>
              </div>
            ) : (
              <div className="space-y-4">
                {unassignedTickets.slice(0, 5).map((ticket) => (
                  <div
                    key={ticket._id}
                    className={`gap-2 rounded-lg border p-2 transition-colors ${ticket.status === "resolved" ? "border-green-100 bg-green-50 hover:bg-green-100" : ticket.status === "pending" ? " border-red-100 bg-red-50 hover:bg-red-100" : ticket.status === "open" ? "border-rose-100 bg-rose-50 hover:bg-rose-100" : ticket.status === "closed" ? "border-gray-100 bg-gray-50 hover:bg-gray-100" : "border-gray-100 bg-gray-50 hover:bg-gray-100"}`}
                  >
                    <div>
                      <Link to={`/tickets/${ticket._id}`} className="block">
                        <h3 className="mb-1 line-clamp-2 font-medium text-gray-900">
                          {ticket.title}
                        </h3>
                        <p className="mb-2 line-clamp-2 text-gray-500">
                          {ticket.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          By {ticket.user?.name}
                        </p>
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={priorityColors[ticket.priority]}
                        size="sm"
                      >
                        {ticket.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Tickets */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                My Tickets
              </h2>

              <Link to="/tickets?filter=assigned">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {(myTickets?.length || 0) === 0 ? (
              <div className="py-8 text-center">
                <User className="mx-auto mb-3 size-12 text-gray-400" />
                <p className="text-gray-500">No assigned tickets</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myTickets?.slice(0, 5).map((ticket) => (
                  <div
                    key={ticket._id}
                    className={`gap-2 rounded-lg border p-2 transition-colors ${ticket.status === "resolved" ? "border-green-100 bg-green-50 hover:bg-green-100" : ticket.status === "pending" ? " border-red-100 bg-red-50 hover:bg-red-100" : ticket.status === "open" ? "border-rose-100 bg-rose-50 hover:bg-rose-100" : ticket.status === "closed" ? "border-gray-100 bg-gray-50 hover:bg-gray-100" : "border-gray-100 bg-gray-50 hover:bg-gray-100"}`}
                  >
                    <div>
                      <Link to={`/tickets/${ticket._id}`} className="block">
                        <h3 className="mb-1 line-clamp-2 font-medium text-gray-900">
                          {ticket.title}
                        </h3>
                        <p className="mb-2 line-clamp-2 text-gray-500">
                          {ticket.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          By {ticket.user?.name}
                        </p>
                      </Link>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={statusColors[ticket.status]} size="sm">
                        {ticket.status}
                      </Badge>
                      <Badge
                        variant={priorityColors[ticket.priority]}
                        size="sm"
                      >
                        {ticket.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
