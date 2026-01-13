import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Plus, Ticket, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";

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

export const UserDashboard = ({ user }) => {
  const tickets = useQuery(api.tickets.getTickets, {
    userId: user._id,
    userRole: user.role,
  });

  const stats = {
    total: tickets?.length || 0,
    open: tickets?.filter((t) => t.status === "open").length || 0,
    pending: tickets?.filter((t) => t.status === "pending").length || 0,
    resolved: tickets?.filter((t) => t.status === "resolved").length || 0,
  };

  const recentTickets = tickets?.slice(0, 5) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            Your Dashboard
          </h1>
          <p className="text-surface-600">Manage your support tickets</p>
        </div>

        <Link to="/tickets/new">
          <Button className="flex items-center space-x-2">
            <Plus className="size-4" />
            <span>New Ticket</span>
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Ticket className="size-8 text-primary-600" />
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
              <Clock className="size-8 text-error-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Open</p>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.open}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="size-8 text-warning-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Pending</p>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="size-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Resolved</p>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.resolved}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent tickets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-surface-900">
              Recent Tickets
            </h2>
            <Link to="/tickets">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          {recentTickets.length === 0 ? (
            <div className="text-center py-8">
              <Ticket className="size-12 text-surface-400 mx-auto mb-3" />
              <p className="text-surface-500 mb-4">No tickets yet</p>
              <Link to="/tickets/new">
                <Button>Create your first ticket</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTickets.slice(0, 4).map((ticket) => (
                <div
                  key={ticket._id}
                  className="flex flex-wrap gap-2 p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
                >
                  <div>
                    <Link to={`/tickets/${ticket._id}`} className="block">
                      <h3 className="font-medium text-surface-900 mb-2">
                        {ticket.title}
                      </h3>
                      <p className="text-sm text-surface-500 line-clamp-2">
                        {ticket.description}
                      </p>
                    </Link>

                    <div className="flex flex-wrap gap-1 items-center space-x-4 text-sm text-surface-500 mt-4">
                      <span>By {ticket.user?.name}</span>
                      {ticket.assignedUser && (
                        <span>Assigned to {ticket.assignedUser.name}</span>
                      )}
                      <span>{format(new Date(ticket.createdAt), "PPp")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={priorityColors[ticket.priority]} size="sm">
                      {ticket.priority}
                    </Badge>
                    <Badge variant={statusColors[ticket.status]} size="sm">
                      {ticket.status}
                    </Badge>
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
