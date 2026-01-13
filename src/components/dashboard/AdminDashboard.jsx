import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Ticket, Users, TrendingUp, AlertTriangle } from "lucide-react";

const statusColors = {
  open: "error",
  pending: "warning",
  resolved: "success",
  closed: "default",
};

export const AdminDashboard = ({ user }) => {
  const allTickets = useQuery(api.tickets.getTickets, {
    userRole: user.role,
  });

  const agents = useQuery(api.users.getAllAgents);

  const stats = {
    totalTickets: allTickets?.length || 0,
    openTickets: allTickets?.filter((t) => t.status === "open").length || 0,
    pendingTickets:
      allTickets?.filter((t) => t.status === "pending").length || 0,
    resolvedTickets:
      allTickets?.filter((t) => t.status === "resolved").length || 0,
    totalAgents: agents?.length || 0,
    unassignedTickets: allTickets?.filter((t) => !t.assignedTo).length || 0,
  };

  const recentTickets = allTickets?.slice(0, 6) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Admin Dashboard</h1>
        <p className="text-surface-600">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Ticket className="size-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">
                  Total Tickets
                </p>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.totalTickets}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="size-8 text-error-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">
                  Open Tickets
                </p>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.openTickets}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="size-8 text-secondary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">
                  Total Agents
                </p>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.totalAgents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="size-8 text-warning-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">
                  Unassigned
                </p>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.unassignedTickets}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-surface-900">Recent Tickets</h3>
              <Link to="/tickets">
                <Button variant="outline" size="sm">
                  View All Tickets
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentTickets.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="size-12 text-surface-400 mx-auto mb-3" />
                <p className="text-surface-500">No tickets yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTickets.slice(0, 4).map((ticket) => (
                  <div
                    key={ticket._id}
                    className="flex items-start gap-2 justify-between p-3 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <Link to={`/tickets/${ticket._id}`} className="block">
                        <h4 className="font-medium text-surface-900 truncate text-sm">
                          {ticket.title}
                        </h4>
                        <p className="line-clamp-2 text-surface-500 mb-2">
                          {ticket.description}
                        </p>
                        <p className="text-xs text-surface-500">
                          By {ticket.user?.name} •{" "}
                          {ticket.assignedUser
                            ? `Assigned to ${ticket.assignedUser.name}`
                            : "Unassigned"}
                        </p>
                      </Link>
                    </div>
                    <Badge variant={statusColors[ticket.status]} size="sm">
                      {ticket.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-surface-900 mb-4">
              Ticket Status Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">Open</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-surface-200 rounded-full h-2">
                    <div
                      className="bg-error-500 h-2 rounded-full"
                      style={{
                        width: `${
                          stats.totalTickets > 0
                            ? (stats.openTickets / stats.totalTickets) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-surface-900">
                    {stats.openTickets}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">Pending</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-surface-200 rounded-full h-2">
                    <div
                      className="bg-warning-500 h-2 rounded-full"
                      style={{
                        width: `${
                          stats.totalTickets > 0
                            ? (stats.pendingTickets / stats.totalTickets) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-surface-900">
                    {stats.pendingTickets}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">Resolved</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-surface-200 rounded-full h-2">
                    <div
                      className="bg-success-500 h-2 rounded-full"
                      style={{
                        width: `${
                          stats.totalTickets > 0
                            ? (stats.resolvedTickets / stats.totalTickets) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-surface-900">
                    {stats.resolvedTickets}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-surface-900">Quick Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/tickets">
              <Button to="/tickets" className="justify-center">
                View All Tickets
              </Button>
            </Link>

            <Link to="/tickets?filter=unassigned">
              <Button variant="outline" className="justify-center">
                Unassigned Tickets
              </Button>
            </Link>

            <Link to="/users">
              <Button variant="outline" className="justify-center">
                Manage Users
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
