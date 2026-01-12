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
      (t) => t.priority === "urgent" && t.status !== "resolved"
    ) || [];

  const stats = {
    total: allTickets?.length || 0,
    assigned: myTickets?.length || 0,
    unassigned: unassignedTickets.length,
    urgent: urgentTickets.length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Agent Dashboard</h1>
        <p className="text-surface-600">Manage customer support tickets</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Ticket className="w-8 h-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">
                  Total Tickets
                </p>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="w-8 h-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">
                  Assigned to Me
                </p>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.assigned}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-warning-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">
                  Unassigned
                </p>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.unassigned}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-error-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Urgent</p>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.urgent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unassigned Tickets */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-surface-900">
                Unassigned Tickets
              </h2>
              <Button
                as={Link}
                to="/tickets?filter=unassigned"
                variant="outline"
                size="sm"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {unassignedTickets.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="w-12 h-12 text-surface-400 mx-auto mb-3" />
                <p className="text-surface-500">No unassigned tickets</p>
              </div>
            ) : (
              <div className="space-y-4">
                {unassignedTickets.slice(0, 5).map((ticket) => (
                  <div
                    key={ticket._id}
                    className="flex items-start justify-between p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <Link to={`/tickets/${ticket._id}`} className="block">
                        <h3 className="font-medium text-surface-900 truncate mb-1">
                          {ticket.title}
                        </h3>
                        <p className="line-clamp-2 text-surface-500 mb-2">
                          {ticket.description}
                        </p>
                        <p className="text-sm text-surface-500">
                          By {ticket.user?.name}
                        </p>
                      </Link>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
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
              <h2 className="text-lg font-semibold text-surface-900">
                My Tickets
              </h2>
              <Button
                as={Link}
                to="/tickets?filter=assigned"
                variant="outline"
                size="sm"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {(myTickets?.length || 0) === 0 ? (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-surface-400 mx-auto mb-3" />
                <p className="text-surface-500">No assigned tickets</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myTickets?.slice(0, 5).map((ticket) => (
                  <div
                    key={ticket._id}
                    className="flex items-start justify-between p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <Link to={`/tickets/${ticket._id}`} className="block">
                        <h3 className="font-medium text-surface-900 truncate mb-1">
                          {ticket.title}
                        </h3>
                        <p className="line-clamp-2 text-surface-500 mb-2">
                          {ticket.description}
                        </p>
                        <p className="text-sm text-surface-500">
                          By {ticket.user?.name}
                        </p>
                      </Link>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
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
