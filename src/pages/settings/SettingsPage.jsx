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
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your helpdesk configuration</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center rounded px-3 py-2 font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary-50 text-primary-700 border-primary-600 border-r-4"
                        : "text-gray-700 hover:bg-gray-50"
                    } `}
                  >
                    <tab.icon
                      className={`mr-3 size-4 ${
                        activeTab === tab.id
                          ? "text-primary-600"
                          : "text-gray-500"
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
                <h2 className="text-lg font-semibold text-gray-900">
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
                      <Save className="mr-2 size-4" />
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
                <h2 className="text-lg font-semibold text-gray-900">
                  User Management
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="bg-primary-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Users className="text-primary-600 size-8" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-600">
                            Total Users
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {systemStats.totalUsers}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-secondary-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Shield className="text-secondary-600 size-8" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-600">
                            Agents
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {allUsers?.filter((u) => u.role === "agent")
                              .length || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-accent-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Users className="text-accent-600 size-8" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-600">
                            Admins
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {allUsers?.filter((u) => u.role === "admin")
                              .length || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Auto-assign new tickets
                        </h4>
                        <p className="text-sm text-gray-600">
                          Automatically assign new tickets to available agents
                        </p>
                      </div>
                      <Badge variant="success">Enabled</Badge>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          User registration
                        </h4>
                        <p className="text-sm text-gray-600">
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
                <h2 className="text-lg font-semibold text-gray-900">
                  System Information
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">
                        Database Statistics
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Tickets</span>
                          <span className="font-medium text-gray-900">
                            {systemStats.totalTickets}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Open Tickets</span>
                          <span className="font-medium text-gray-900">
                            {systemStats.openTickets}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Resolved Tickets
                          </span>
                          <span className="font-medium text-gray-900">
                            {systemStats.resolvedTickets}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Users</span>
                          <span className="font-medium text-gray-900">
                            {systemStats.totalUsers}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">
                        System Status
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Database</span>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="size-4 text-green-600" />
                            <span className="font-medium text-green-600">
                              Online
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Authentication</span>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="size-4 text-green-600" />
                            <span className="font-medium text-green-600">
                              Active
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Notifications</span>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="size-4 text-green-600" />
                            <span className="font-medium text-green-600">
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
                <h2 className="text-lg font-semibold text-gray-900">
                  Notification Settings
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Email notifications
                        </h4>
                        <p className="text-sm text-gray-600">
                          Send email notifications for ticket updates
                        </p>
                      </div>
                      <Badge variant="success">Enabled</Badge>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Real-time notifications
                        </h4>
                        <p className="text-sm text-gray-600">
                          Show in-app notifications for updates
                        </p>
                      </div>
                      <Badge variant="success">Enabled</Badge>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Agent notifications
                        </h4>
                        <p className="text-sm text-gray-600">
                          Notify agents of new ticket assignments
                        </p>
                      </div>
                      <Badge variant="success">Enabled</Badge>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button loading={isSaving}>
                      <Save className="mr-2 size-4" />
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
                <h2 className="text-lg font-semibold text-gray-900">
                  Security Settings
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="mt-0.5 size-5 text-red-600" />
                      <div>
                        <h4 className="font-medium text-red-800">
                          Security Notice
                        </h4>
                        <p className="mt-1 text-sm text-red-700">
                          Security settings are managed through your Clerk
                          dashboard. Visit your Clerk console to configure
                          authentication settings.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Two-factor authentication
                        </h4>
                        <p className="text-sm text-gray-600">
                          Require 2FA for admin accounts
                        </p>
                      </div>
                      <Badge variant="warning">Recommended</Badge>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Session timeout
                        </h4>
                        <p className="text-sm text-gray-600">
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
