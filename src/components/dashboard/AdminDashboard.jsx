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
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-surface-900 text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-surface-600">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Ticket className="text-primary-600 size-8" />
              <div className="ml-4">
                <p className="text-surface-600 text-sm font-medium">
                  Total Tickets
                </p>
                <p className="text-surface-900 text-2xl font-bold">
                  {stats.totalTickets}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="text-error-600 size-8" />
              <div className="ml-4">
                <p className="text-surface-600 text-sm font-medium">
                  Open Tickets
                </p>
                <p className="text-surface-900 text-2xl font-bold">
                  {stats.openTickets}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="text-secondary-600 size-8" />
              <div className="ml-4">
                <p className="text-surface-600 text-sm font-medium">
                  Total Agents
                </p>
                <p className="text-surface-900 text-2xl font-bold">
                  {stats.totalAgents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="text-warning-600 size-8" />
              <div className="ml-4">
                <p className="text-surface-600 text-sm font-medium">
                  Unassigned
                </p>
                <p className="text-surface-900 text-2xl font-bold">
                  {stats.unassignedTickets}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-surface-900 font-semibold">Recent Tickets</h3>
              <Link to="/tickets">
                <Button variant="primary" size="sm">
                  View All Tickets
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentTickets.length === 0 ? (
              <div className="py-8 text-center">
                <Ticket className="text-surface-400 mx-auto mb-3 size-12" />
                <p className="text-surface-500">No tickets yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTickets.slice(0, 4).map((ticket) => (
                  <div
                    key={ticket._id}
                    className={`gap-2 rounded-lg border p-2 transition-colors ${ticket.status === "resolved" ? "border-success-100 bg-success-50 hover:bg-success-100" : ticket.status === "pending" ? " border-warning-100 bg-warning-50 hover:bg-warning-100" : ticket.status === "open" ? "border-error-100 bg-error-50 hover:bg-error-100" : ticket.status === "closed" ? "border-surface-100 bg-surface-50 hover:bg-surface-100" : "border-surface-100 bg-surface-50 hover:bg-surface-100"}`}
                  >
                    <div>
                      <Link to={`/tickets/${ticket._id}`} className="block">
                        <h4 className="text-surface-900 text-sm font-medium">
                          {ticket.title}
                        </h4>
                        <p className="text-surface-500 mb-2 line-clamp-2">
                          {ticket.description}
                        </p>
                        <p className="text-surface-500 text-xs">
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

        <div>
          <Card className="mb-4">
            <CardContent className="p-6">
              <h3 className="text-surface-900 mb-4 font-semibold">
                Ticket Status Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-surface-600 text-sm">Open</span>
                  <div className="flex items-center space-x-2">
                    <div className="bg-surface-200 h-2 w-24 rounded-full">
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
                    <span className="text-surface-900 text-sm font-medium">
                      {stats.openTickets}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-surface-600 text-sm">Pending</span>
                  <div className="flex items-center space-x-2">
                    <div className="bg-surface-200 h-2 w-24 rounded-full">
                      <div
                        className="bg-warning-500 h-2 rounded-full"
                        style={{
                          width: `${
                            stats.totalTickets > 0
                              ? (stats.pendingTickets / stats.totalTickets) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-surface-900 text-sm font-medium">
                      {stats.pendingTickets}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-surface-600 text-sm">Resolved</span>
                  <div className="flex items-center space-x-2">
                    <div className="bg-surface-200 h-2 w-24 rounded-full">
                      <div
                        className="bg-success-500 h-2 rounded-full"
                        style={{
                          width: `${
                            stats.totalTickets > 0
                              ? (stats.resolvedTickets / stats.totalTickets) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-surface-900 text-sm font-medium">
                      {stats.resolvedTickets}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-surface-900 font-semibold">Quick Actions</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Link to="/tickets">
                  <Button
                    variant="outline"
                    to="/tickets"
                    className="w-full justify-center"
                  >
                    View All Tickets
                  </Button>
                </Link>

                <Link to="/tickets?filter=unassigned">
                  <Button variant="outline" className="w-full justify-center">
                    Unassigned Tickets
                  </Button>
                </Link>

                <Link to="/users">
                  <Button variant="outline" className="w-full justify-center">
                    Manage Users
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
