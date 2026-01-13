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
    (ticket) => ticket.status === "resolved"
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
      (t) => t.createdAt >= dayStart && t.createdAt < dayEnd
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Calendar className="size-4 mr-2" />
                Custom Range
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="size-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">
                  Total Tickets
                </p>
                <p className="text-2xl font-bold text-surface-900">
                  {metrics.totalTickets}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="size-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">
                  Resolution Rate
                </p>
                <p className="text-2xl font-bold text-surface-900">
                  {metrics.resolutionRate}%
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
                  Active Users
                </p>
                <p className="text-2xl font-bold text-surface-900">
                  {metrics.activeUsers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-surface-900">
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
                      <span className="capitalize font-medium text-surface-900">
                        {status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-surface-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${colors[status]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-surface-900 w-12 text-right">
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
            <h2 className="text-lg font-semibold text-surface-900">
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
                      <span className="capitalize font-medium text-surface-900">
                        {priority}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-surface-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${colors[priority]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-surface-900 w-12 text-right">
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
            <h2 className="text-lg font-semibold text-surface-900">
              Ticket Creation Trends
            </h2>
            <div className="flex items-center space-x-2">
              <TrendingUp className="size-4 text-success-600" />
              <span className="text-sm text-success-600 font-medium">
                {dailyTickets.reduce((sum, day) => sum + day.count, 0)} tickets
                this week
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 h-32">
              {dailyTickets.map((day, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-end space-y-2"
                >
                  <div
                    className="w-full bg-primary-500 rounded-t-sm transition-all duration-300 hover:bg-primary-600"
                    style={{
                      height: `${(day.count / maxDailyCount) * 100}%`,
                      minHeight: day.count > 0 ? "8px" : "2px",
                    }}
                  />
                  <span className="text-xs font-medium text-surface-600">
                    {day.date}
                  </span>
                  <span className="text-xs text-surface-500">{day.count}</span>
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-surface-500">
              Daily ticket creation over the last 7 days
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
