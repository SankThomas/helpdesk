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
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-surface-900 text-2xl font-bold">
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Ticket className="text-primary-600 size-8" />
              <div className="ml-4">
                <p className="text-surface-600 text-sm font-medium">
                  Total Tickets
                </p>
                <p className="text-surface-900 text-2xl font-bold">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="text-error-600 size-8" />
              <div className="ml-4">
                <p className="text-surface-600 text-sm font-medium">Open</p>
                <p className="text-surface-900 text-2xl font-bold">
                  {stats.open}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="text-warning-600 size-8" />
              <div className="ml-4">
                <p className="text-surface-600 text-sm font-medium">Pending</p>
                <p className="text-surface-900 text-2xl font-bold">
                  {stats.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="text-success-600 size-8" />
              <div className="ml-4">
                <p className="text-surface-600 text-sm font-medium">Resolved</p>
                <p className="text-surface-900 text-2xl font-bold">
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
            <h2 className="text-surface-900 text-lg font-semibold">
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
            <div className="py-8 text-center">
              <Ticket className="text-surface-400 mx-auto mb-3 size-12" />
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
                  className={`gap-2 rounded-lg border p-2 transition-colors ${ticket.status === "resolved" ? "border-success-100 bg-success-50 hover:bg-success-100" : ticket.status === "pending" ? " border-warning-100 bg-warning-50 hover:bg-warning-100" : ticket.status === "open" ? "border-error-100 bg-error-50 hover:bg-error-100" : ticket.status === "closed" ? "border-surface-100 bg-surface-50 hover:bg-surface-100" : "border-surface-100 bg-surface-50 hover:bg-surface-100"}`}
                >
                  <div>
                    <Link to={`/tickets/${ticket._id}`} className="block">
                      <h3 className="text-surface-900 mb-2 font-medium">
                        {ticket.title}
                      </h3>
                      <p className="text-surface-500 line-clamp-2 text-sm">
                        {ticket.description}
                      </p>
                    </Link>

                    <div className="text-surface-500 mt-4 flex flex-wrap items-center gap-1 space-x-4 text-sm">
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
