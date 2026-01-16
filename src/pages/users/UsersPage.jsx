import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Users, Search, UserCheck, UserX, Shield, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const roleColors = {
  user: "default",
  agent: "secondary",
  admin: "primary",
};

export const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);

  const users = useQuery(api.users.getAllUsers);
  const updateUserRole = useMutation(api.users.updateUserRole);
  const inviteUser = useAction(api.users.inviteUser);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole({ userId, role: newRole });
      toast.success("User role updated");
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role. Please try again.");
    }
  };

  const filteredUsers =
    users?.filter((user) => {
      const matchesSearch =
        !searchTerm ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = !roleFilter || user.role === roleFilter;

      return matchesSearch && matchesRole;
    }) || [];

  const stats = {
    total: users?.length || 0,
    admins: users?.filter((u) => u.role === "admin").length || 0,
    agents: users?.filter((u) => u.role === "agent").length || 0,
    users: users?.filter((u) => u.role === "user").length || 0,
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await inviteUser({ email: formData.email, role: formData.role });

      setShowUsersModal(false);
      setFormData({
        email: "",
        role: "user",
      });
      toast.success("Invite email has been sent.");
    } catch (error) {
      console.error("Invite not sent: ", error);
      toast.error("Failed to send invite. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="text-primary-600 size-8" />
              <div className="ml-4">
                <p className="font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="text-primary-600 size-8" />
              <div className="ml-4">
                <p className="font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.admins}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="text-secondary-600 size-8" />
              <div className="ml-4">
                <p className="font-medium text-gray-600">Agents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.agents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserX className="size-8 text-gray-600" />
              <div className="ml-4">
                <p className="font-medium text-gray-600">Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.users}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
              <option value="user">User</option>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Users ({filteredUsers.length})
            </h2>
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowUsersModal(true)}
            >
              <Plus className="mr-2 size-4" /> Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!users ? (
            <div className="flex items-center justify-center py-8">
              <div className="border-primary-600 size-8 animate-spin rounded-full border-b-2"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-4 size-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No users found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-2 py-3 text-left font-medium text-gray-900">
                      User
                    </th>
                    <th className="px-2 py-3 text-left font-medium text-gray-900">
                      Email
                    </th>
                    <th className="px-2 py-3 text-left font-medium text-gray-900">
                      Role
                    </th>
                    <th className="px-2 py-3 text-left font-medium text-gray-900">
                      Joined
                    </th>
                    <th className="px-2 py-3 text-left font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-2 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="from-primary-500 to-primary-600 flex size-10 items-center justify-center rounded-full bg-linear-to-br font-medium text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="truncate font-medium text-gray-900">
                              {user.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-4 text-gray-600">{user.email}</td>
                      <td className="px-2 py-4">
                        <Badge variant={roleColors[user.role]} size="sm">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="truncate px-2 py-4 text-gray-600">
                        {format(new Date(user.createdAt), "MMM do, yyyy")}
                      </td>
                      <td className="px-2 py-4">
                        <Select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className="w-auto!"
                        >
                          <option value="user">User</option>
                          <option value="agent">Agent</option>
                          <option value="admin">Admin</option>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {showUsersModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowUsersModal(false)}
          title="Invite User"
          size="md"
        >
          <form onSubmit={handleInviteUser} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              required
            />

            <Select
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  role: e.target.value,
                }))
              }
            >
              <option value="user">User</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </Select>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUsersModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Invite
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
