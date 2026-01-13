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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">User Management</h1>
        <p className="text-surface-600">Manage user accounts and permissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="size-8 text-primary-600" />
              <div className="ml-4">
                <p className="font-medium text-surface-600">Total Users</p>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="size-8 text-primary-600" />
              <div className="ml-4">
                <p className="font-medium text-surface-600">Admins</p>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.admins}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="size-8 text-secondary-600" />
              <div className="ml-4">
                <p className="font-medium text-surface-600">Agents</p>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.agents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserX className="size-8 text-surface-600" />
              <div className="ml-4">
                <p className="font-medium text-surface-600">Users</p>
                <p className="text-2xl font-bold text-surface-900">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 size-4" />
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
            <h2 className="text-lg font-semibold text-surface-900">
              Users ({filteredUsers.length})
            </h2>
            <Button variant="outline" size="md">
              <Plus className="size-4 mr-2" /> Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!users ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full size-8 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="size-12 text-surface-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-surface-900 mb-2">
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
                  <tr className="border-b border-surface-200">
                    <th className="text-left py-3 px-2 font-medium text-surface-900">
                      User
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-surface-900">
                      Email
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-surface-900">
                      Role
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-surface-900">
                      Joined
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-surface-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-surface-50 transition-colors"
                    >
                      <td className="py-4 px-2">
                        <div className="flex items-center space-x-3">
                          <div className="size-10 bg-linear-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-surface-900 truncate">
                              {user.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-surface-600">
                        {user.email}
                      </td>
                      <td className="py-4 px-2">
                        <Badge variant={roleColors[user.role]} size="sm">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-2 text-surface-600 truncate">
                        {format(new Date(user.createdAt), "MMM do, yyyy")}
                      </td>
                      <td className="py-4 px-2">
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
