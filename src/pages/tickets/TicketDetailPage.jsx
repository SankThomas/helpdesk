import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams, Link, useNavigate, NavLink } from "react-router-dom";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Select } from "../../components/ui/Select";
import { ArrowLeft, User, Calendar, Pencil } from "lucide-react";
import { CommentSection } from "../../components/tickets/CommentSection";
import { AttachmentSection } from "../../components/tickets/AttachmentSection";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Trash } from "lucide-react";
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

export const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [isUpdating, setIsUpdating] = useState(false);

  const { currentUser } = useCurrentUser();
  const ticket = useQuery(
    api.tickets.getTicketById,
    ticketId ? { ticketId } : "skip",
  );

  // Get all agents for assignment
  const agents = useQuery(api.users.getAllAgents);
  const updateTicket = useMutation(api.tickets.updateTicket);
  const deleteTicket = useMutation(api.tickets.deleteTicket);

  const handleStatusChange = async (newStatus) => {
    if (!ticket || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateTicket({
        ticketId: ticket._id,
        status: newStatus,
        updatedBy: currentUser._id,
      });
    } catch (error) {
      console.error("Error updating ticket status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignmentChange = async (agentId) => {
    if (!ticket || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateTicket({
        ticketId: ticket._id,
        assignedTo: agentId || undefined,
        updatedBy: currentUser._id,
      });
    } catch (error) {
      console.error("Error updating ticket assignment:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    if (!ticket || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateTicket({
        ticketId: ticket._id,
        priority: newPriority,
        updatedBy: currentUser._id,
      });
    } catch (error) {
      console.error("Error updating ticket priority:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTicket = async () => {
    try {
      await deleteTicket({
        ticketId: ticket._id,
      });

      navigate("/tickets");
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  if (!currentUser || !ticket) return <LoadingSpinner />;

  const isOwner = currentUser._id === ticket.userId;
  const isAgentOrAdmin = ["agent", "admin"].includes(currentUser.role);
  const isAdmin = currentUser.role === "admin";
  const canEdit = isAgentOrAdmin;

  return (
    <div className="animate-fade-in mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <NavLink to="/tickets">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Tickets</span>
          </Button>
        </NavLink>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="">
                  <h1 className="mb-2 text-2xl font-bold text-gray-900">
                    {ticket.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="size-4" />
                      <span>Created by {ticket.user?.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="size-4" />
                      <span>{format(new Date(ticket.createdAt), "PP")}</span>
                    </div>

                    {isOwner && (
                      <div>
                        <Link to={`/tickets/${ticket._id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="mr-2 size-4" /> Edit
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={priorityColors[ticket.priority]}>
                    {ticket.priority}
                  </Badge>
                  <Badge variant={statusColors[ticket.status]}>
                    {ticket.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Attachments */}
              <AttachmentSection ticketId={ticket._id} />

              <div className="prose mt-4 max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">
                  {ticket.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <CommentSection ticketId={ticket._id} currentUser={currentUser} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Control */}
          {canEdit && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Status</h3>
              </CardHeader>
              <CardContent>
                <Select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isUpdating}
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Assignment */}
          {canEdit && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Assignment</h3>
              </CardHeader>
              <CardContent>
                <Select
                  value={ticket.assignedTo || ""}
                  onChange={(e) => handleAssignmentChange(e.target.value)}
                  disabled={isUpdating}
                >
                  <option value="">Unassigned</option>
                  {agents?.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                </Select>
                {ticket.assignedUser && (
                  <div className="mt-3 rounded-lg bg-gray-50 p-3!">
                    <div className="flex items-center space-x-2">
                      <User className="size-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {ticket.assignedUser.name}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Priority */}
          {canEdit && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Priority</h3>
              </CardHeader>
              <CardContent>
                <Select
                  value={ticket.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  disabled={isUpdating}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Ticket Info */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">
                Ticket Information
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Ticket ID:</span>
                  <span className="ml-2 font-mono font-bold text-gray-900 uppercase">
                    {ticket._id.slice(-8)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Created:</span>
                  <span className="ml-2 text-gray-900">
                    {format(new Date(ticket.createdAt), "PPPPpppp")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="ml-2 text-gray-900">
                    {format(new Date(ticket.updatedAt), "PPPPpppp")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Reported By:</span>
                  <span className="ml-2 text-gray-900">
                    {ticket.user?.name}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card>
              <CardHeader>
                <h3>Danger Zone</h3>
              </CardHeader>
              <CardContent>
                <Button variant="danger" onClick={handleDeleteTicket}>
                  <Trash className="mr-2 size-4" /> Delete this ticket
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
