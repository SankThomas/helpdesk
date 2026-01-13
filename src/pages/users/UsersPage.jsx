import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Users, Search, UserCheck, UserX, Shield, Plus } from "lucide-react";
import { format } from "date-fns";

const roleColors = {
  user: "default",
  agent: "secondary",
  admin: "primary",
};

export const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const users = useQuery(api.users.getAllUsers);
  const updateUserRole = useMutation(api.users.updateUserRole);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole({ userId, role: newRole });
    } catch (error) {
      console.error("Error updating user role:", error);
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

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-surface-900 text-2xl font-bold">User Management</h1>
        <p className="text-surface-600">Manage user accounts and permissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="text-primary-600 size-8" />
              <div className="ml-4">
                <p className="text-surface-600 font-medium">Total Users</p>
                <p className="text-surface-900 text-2xl font-bold">
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
                <p className="text-surface-600 font-medium">Admins</p>
                <p className="text-surface-900 text-2xl font-bold">
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
                <p className="text-surface-600 font-medium">Agents</p>
                <p className="text-surface-900 text-2xl font-bold">
                  {stats.agents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserX className="text-surface-600 size-8" />
              <div className="ml-4">
                <p className="text-surface-600 font-medium">Users</p>
                <p className="text-surface-900 text-2xl font-bold">
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
              <Search className="text-surface-400 absolute top-1/2 left-3 size-4 -translate-y-1/2 transform" />
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
            <h2 className="text-surface-900 text-lg font-semibold">
              Users ({filteredUsers.length})
            </h2>
            <Button variant="outline" size="md">
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
              <Users className="text-surface-400 mx-auto mb-4 size-12" />
              <h3 className="text-surface-900 mb-2 text-lg font-medium">
                No users found
              </h3>
              <p className="text-surface-500">
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-surface-200 border-b">
                    <th className="text-surface-900 px-2 py-3 text-left font-medium">
                      User
                    </th>
                    <th className="text-surface-900 px-2 py-3 text-left font-medium">
                      Email
                    </th>
                    <th className="text-surface-900 px-2 py-3 text-left font-medium">
                      Role
                    </th>
                    <th className="text-surface-900 px-2 py-3 text-left font-medium">
                      Joined
                    </th>
                    <th className="text-surface-900 px-2 py-3 text-left font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-surface-200 divide-y">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-surface-50 transition-colors"
                    >
                      <td className="px-2 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="from-primary-500 to-primary-600 flex size-10 items-center justify-center rounded-full bg-linear-to-br font-medium text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-surface-900 truncate font-medium">
                              {user.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-surface-600 px-2 py-4">
                        {user.email}
                      </td>
                      <td className="px-2 py-4">
                        <Badge variant={roleColors[user.role]} size="sm">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="text-surface-600 truncate px-2 py-4">
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

      <Modal>
        <h2>Open modal</h2>
      </Modal>
    </div>
  );
};
