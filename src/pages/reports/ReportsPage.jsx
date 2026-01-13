import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Download,
  Calendar,
  Target,
  Activity,
} from "lucide-react";

export const ReportsPage = () => {
  const [dateRange, setDateRange] = useState("7");
  const [reportType, setReportType] = useState("overview");

  // Get all data for reports
  const allTickets = useQuery(api.tickets.getTickets, { userRole: "admin" });
  const allUsers = useQuery(api.users.getAllUsers);

  // Calculate metrics
  const now = new Date().getTime();
  const daysAgo = parseInt(dateRange) * 24 * 60 * 60 * 1000;
  const startDate = now - daysAgo;

  const recentTickets =
    allTickets?.filter((ticket) => ticket.createdAt >= startDate) || [];
  const resolvedTickets = recentTickets.filter(
    (ticket) => ticket.status === "resolved",
  );

  const metrics = {
    totalTickets: recentTickets.length,
    resolvedTickets: resolvedTickets.length,
    resolutionRate:
      recentTickets.length > 0
        ? Math.round((resolvedTickets.length / recentTickets.length) * 100)
        : 0,
    avgResponseTime: "2.5 hours", // Mock data
    activeUsers: allUsers?.filter((u) => u.role !== "admin").length || 0,
  };

  // Status distribution
  const statusCounts = {
    open: recentTickets.filter((t) => t.status === "open").length,
    pending: recentTickets.filter((t) => t.status === "pending").length,
    resolved: recentTickets.filter((t) => t.status === "resolved").length,
    closed: recentTickets.filter((t) => t.status === "closed").length,
  };

  // Priority distribution
  const priorityCounts = {
    low: recentTickets.filter((t) => t.priority === "low").length,
    medium: recentTickets.filter((t) => t.priority === "medium").length,
    high: recentTickets.filter((t) => t.priority === "high").length,
    urgent: recentTickets.filter((t) => t.priority === "urgent").length,
  };

  // Generate daily ticket counts for the last 7 days
  const dailyTickets = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = now - i * 24 * 60 * 60 * 1000;
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const dayTickets = recentTickets.filter(
      (t) => t.createdAt >= dayStart && t.createdAt < dayEnd,
    );
    dailyTickets.push({
      date: new Date(dayStart).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      count: dayTickets.length,
    });
  }

  const maxDailyCount = Math.max(...dailyTickets.map((d) => d.count), 1);

  const handleExport = () => {
    if (!recentTickets || recentTickets.length === 0) {
      alert("No tickets to export for the selected date range.");
      return;
    }

    // CSV headers
    const headers = [
      "Date",
      "Ticket ID",
      "Title",
      "Status",
      "Priority",
      "Assigned To",
    ];
    const rows = recentTickets.map((ticket) => [
      new Date(ticket.createdAt).toLocaleDateString("en-US"),
      ticket._id.slice(-8),
      ticket.title || "",
      ticket.status,
      ticket.priority,
      (ticket.assignedUser && ticket.assignedUser.name) || "Unassigned",
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    // Create a downloadable blob
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    // Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `helpdesk-report-${dateRange}days.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Cleanup
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-surface-900 text-2xl font-bold">
            Reports & Analytics
          </h1>
          <p className="text-surface-600">
            Track performance and analyze trends
          </p>
        </div>
        <Button onClick={handleExport} className="flex items-center space-x-2">
          <Download className="size-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Select
              label="Date Range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </Select>

            <Select
              label="Report Type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="overview">Overview</option>
              <option value="performance">Performance</option>
              <option value="trends">Trends</option>
            </Select>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Calendar className="mr-2 size-4" />
                Custom Range
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="text-primary-600 size-8" />
              <div className="ml-4">
                <p className="text-surface-600 text-sm font-medium">
                  Total Tickets
                </p>
                <p className="text-surface-900 text-2xl font-bold">
                  {metrics.totalTickets}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="text-success-600 size-8" />
              <div className="ml-4">
                <p className="text-surface-600 text-sm font-medium">
                  Resolution Rate
                </p>
                <p className="text-surface-900 text-2xl font-bold">
                  {metrics.resolutionRate}%
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
                  Active Users
                </p>
                <p className="text-surface-900 text-2xl font-bold">
                  {metrics.activeUsers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <h2 className="text-surface-900 text-lg font-semibold">
              Ticket Status Distribution
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(statusCounts).map(([status, count]) => {
                const percentage =
                  metrics.totalTickets > 0
                    ? Math.round((count / metrics.totalTickets) * 100)
                    : 0;
                const colors = {
                  open: "bg-error-500",
                  pending: "bg-warning-500",
                  resolved: "bg-success-500",
                  closed: "bg-surface-400",
                };

                return (
                  <div
                    key={status}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`size-3 rounded-full ${colors[status]}`}
                      />
                      <span className="text-surface-900 font-medium capitalize">
                        {status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-surface-200 h-2 w-24 rounded-full">
                        <div
                          className={`h-2 rounded-full ${colors[status]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-surface-900 w-12 text-right text-sm font-medium">
                        {count} ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <h2 className="text-surface-900 text-lg font-semibold">
              Priority Distribution
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(priorityCounts).map(([priority, count]) => {
                const percentage =
                  metrics.totalTickets > 0
                    ? Math.round((count / metrics.totalTickets) * 100)
                    : 0;
                const colors = {
                  low: "bg-surface-400",
                  medium: "bg-warning-500",
                  high: "bg-error-500",
                  urgent: "bg-error-600",
                };

                return (
                  <div
                    key={priority}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`size-3 rounded-full ${colors[priority]}`}
                      />
                      <span className="text-surface-900 font-medium capitalize">
                        {priority}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-surface-200 h-2 w-24 rounded-full">
                        <div
                          className={`h-2 rounded-full ${colors[priority]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-surface-900 w-12 text-right text-sm font-medium">
                        {count} ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Trends */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-surface-900 text-lg font-semibold">
              Ticket Creation Trends
            </h2>
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-success-600 size-4" />
              <span className="text-success-600 text-sm font-medium">
                {dailyTickets.reduce((sum, day) => sum + day.count, 0)} tickets
                this week
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid h-32 grid-cols-7 gap-2">
              {dailyTickets.map((day, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-end space-y-2"
                >
                  <div
                    className="bg-primary-500 hover:bg-primary-600 w-full rounded-t-sm transition-all duration-300"
                    style={{
                      height: `${(day.count / maxDailyCount) * 100}%`,
                      minHeight: day.count > 0 ? "8px" : "2px",
                    }}
                  />
                  <span className="text-surface-600 text-xs font-medium">
                    {day.date}
                  </span>
                  <span className="text-surface-500 text-xs">{day.count}</span>
                </div>
              ))}
            </div>
            <div className="text-surface-500 text-center text-sm">
              Daily ticket creation over the last 7 days
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
