import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import {
  Settings,
  Users,
  Shield,
  Bell,
  Database,
  Save,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, _] = useState(false);
  const [settings, setSettings] = useState({
    orgName: "",
    supportEmail: "",
    defaultPriority: "medium",
    defaultUserRole: "user",
    autoAssignTickets: true,
    userRegistration: true,
    emailNotifications: true,
    realTimeNotifications: true,
    agentNotifications: true,
  });

  // Fetch data
  const allUsers = useQuery(api.users.getAllUsers) || [];
  const allTickets =
    useQuery(api.tickets.getTickets, { userRole: "admin" }) || [];
  // const currentSettings = useQuery(api.settings.getSettings);

  // const updateSettings = useMutation(api.settings.updateSettings);

  // Populate local state when current settings are fetched
  // useEffect(() => {
  //   if (currentSettings) setSettings(currentSettings);
  // }, [currentSettings]);

  const systemStats = {
    totalUsers: allUsers.length,
    totalTickets: allTickets.length,
    openTickets: allTickets.filter((t) => t.status === "open").length,
    resolvedTickets: allTickets.filter((t) => t.status === "resolved").length,
  };

  // const handleSave = async () => {
  //   setIsSaving(true);
  //   try {
  //     await updateSettings(settings);
  //   } catch (err) {
  //     console.error("Failed to save settings:", err);
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: "general", name: "General", icon: Settings },
    { id: "users", name: "User Management", icon: Users },
    { id: "system", name: "System", icon: Database },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Settings</h1>
        <p className="text-surface-600">Manage your helpdesk configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center px-3 py-2 rounded font-medium transition-colors
                      ${
                        activeTab === tab.id
                          ? "bg-primary-50 text-primary-700 border-r-4 border-primary-600"
                          : "text-surface-700 hover:bg-surface-50"
                      }
                    `}
                  >
                    <tab.icon
                      className={`size-4 mr-3 ${
                        activeTab === tab.id
                          ? "text-primary-600"
                          : "text-surface-500"
                      }`}
                    />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "general" && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-surface-900">
                  General Settings
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Input
                    label="Organization Name"
                    value={settings.orgName}
                    placeholder="Enter organization name"
                    onChange={(e) => handleChange("orgName", e.target.value)}
                  />

                  <Input
                    label="Support Email"
                    type="email"
                    value={settings.supportEmail}
                    placeholder="Enter support email"
                    onChange={(e) =>
                      handleChange("supportEmail", e.target.value)
                    }
                  />

                  <Select
                    label="Default Ticket Priority"
                    value={settings.defaultPriority}
                    onChange={(e) =>
                      handleChange("defaultPriority", e.target.value)
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </Select>

                  <Select
                    label="Default User Role"
                    value={settings.defaultUserRole}
                    onChange={(e) =>
                      handleChange("defaultUserRole", e.target.value)
                    }
                  >
                    <option value="user">User</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </Select>

                  <div className="flex justify-end">
                    <Button loading={isSaving}>
                      <Save className="size-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-surface-900">
                  User Management
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <div className="flex items-center">
                        <Users className="w-8 h-8 text-primary-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-surface-600">
                            Total Users
                          </p>
                          <p className="text-2xl font-bold text-surface-900">
                            {systemStats.totalUsers}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-secondary-50 rounded-lg">
                      <div className="flex items-center">
                        <Shield className="w-8 h-8 text-secondary-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-surface-600">
                            Agents
                          </p>
                          <p className="text-2xl font-bold text-surface-900">
                            {allUsers?.filter((u) => u.role === "agent")
                              .length || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-accent-50 rounded-lg">
                      <div className="flex items-center">
                        <Users className="w-8 h-8 text-accent-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-surface-600">
                            Admins
                          </p>
                          <p className="text-2xl font-bold text-surface-900">
                            {allUsers?.filter((u) => u.role === "admin")
                              .length || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-surface-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-surface-900">
                          Auto-assign new tickets
                        </h4>
                        <p className="text-sm text-surface-600">
                          Automatically assign new tickets to available agents
                        </p>
                      </div>
                      <Badge variant="success">Enabled</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-surface-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-surface-900">
                          User registration
                        </h4>
                        <p className="text-sm text-surface-600">
                          Allow new users to register accounts
                        </p>
                      </div>
                      <Badge variant="success">Enabled</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "system" && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-surface-900">
                  System Information
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-surface-900">
                        Database Statistics
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-surface-600">
                            Total Tickets
                          </span>
                          <span className="font-medium text-surface-900">
                            {systemStats.totalTickets}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-600">Open Tickets</span>
                          <span className="font-medium text-surface-900">
                            {systemStats.openTickets}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-600">
                            Resolved Tickets
                          </span>
                          <span className="font-medium text-surface-900">
                            {systemStats.resolvedTickets}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-600">Total Users</span>
                          <span className="font-medium text-surface-900">
                            {systemStats.totalUsers}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-surface-900">
                        System Status
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-surface-600">Database</span>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="size-4 text-success-600" />
                            <span className="text-success-600 font-medium">
                              Online
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-surface-600">
                            Authentication
                          </span>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="size-4 text-success-600" />
                            <span className="text-success-600 font-medium">
                              Active
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-surface-600">
                            Notifications
                          </span>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="size-4 text-success-600" />
                            <span className="text-success-600 font-medium">
                              Working
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-surface-900">
                  Notification Settings
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-surface-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-surface-900">
                          Email notifications
                        </h4>
                        <p className="text-sm text-surface-600">
                          Send email notifications for ticket updates
                        </p>
                      </div>
                      <Badge variant="success">Enabled</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-surface-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-surface-900">
                          Real-time notifications
                        </h4>
                        <p className="text-sm text-surface-600">
                          Show in-app notifications for updates
                        </p>
                      </div>
                      <Badge variant="success">Enabled</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-surface-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-surface-900">
                          Agent notifications
                        </h4>
                        <p className="text-sm text-surface-600">
                          Notify agents of new ticket assignments
                        </p>
                      </div>
                      <Badge variant="success">Enabled</Badge>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button loading={isSaving}>
                      <Save className="size-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-surface-900">
                  Security Settings
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-warning-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-warning-800">
                          Security Notice
                        </h4>
                        <p className="text-sm text-warning-700 mt-1">
                          Security settings are managed through your Clerk
                          dashboard. Visit your Clerk console to configure
                          authentication settings.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-surface-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-surface-900">
                          Two-factor authentication
                        </h4>
                        <p className="text-sm text-surface-600">
                          Require 2FA for admin accounts
                        </p>
                      </div>
                      <Badge variant="warning">Recommended</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-surface-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-surface-900">
                          Session timeout
                        </h4>
                        <p className="text-sm text-surface-600">
                          Automatically log out inactive users
                        </p>
                      </div>
                      <Badge variant="success">24 hours</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
