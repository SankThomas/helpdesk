import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Select } from "../../components/ui/Select";
import { FileUpload } from "../../components/ui/FileUpload";
import {
  ArrowLeft,
  Paperclip,
  Download,
  Trash2,
  FileText,
  File,
} from "lucide-react";
import { Modal } from "../../components/ui/Modal";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { toast } from "sonner";

export const EditTicketPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [attachments, setAttachments] = useState([]); // for new uploads
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState(null);

  const { currentUser } = useCurrentUser();
  const ticket = useQuery(
    api.tickets.getTicketById,
    ticketId ? { ticketId } : "skip",
  );
  const existingAttachments = useQuery(api.attachments.getAttachmentByTicket, {
    ticketId,
  });

  const updateTicket = useMutation(api.tickets.updateTicket);
  const generateUploadUrl = useMutation(api.attachments.generateUploadUrl);
  const createAttachment = useMutation(api.attachments.createAttachment);
  const deleteAttachment = useMutation(api.attachments.deleteAttachment);

  const canEdit = ["agent", "admin"].includes(currentUser?.role);

  useEffect(() => {
    if (ticket) {
      setTitle(ticket.title);
      setDescription(ticket.description);
      setPriority(ticket.priority);
    }
  }, [ticket]);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !currentUser) return;

    setIsSubmitting(true);
    try {
      // Update ticket info
      await updateTicket({
        ticketId,
        title: title.trim(),
        description: description.trim(),
        priority,
        updatedBy: currentUser._id,
      });

      // Upload new attachments
      for (const file of attachments) {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await res.json();

        await createAttachment({
          ticketId,
          fileName: file.name,
          fileSize: file.size,
          storageId,
          uploadedBy: currentUser._id,
        });
      }

      navigate(`/tickets/${ticketId}`);
      toast.success("Ticket updated");
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error(
        "An error occurred while updating the ticket. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (attachment) => {
    const { fileName, fileUrl } = attachment;
    const extension = fileName.split(".").pop()?.toLowerCase();

    // For images, return an actual image preview
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
      return (
        <img
          src={fileUrl}
          alt={fileName}
          className="size-12 rounded border border-gray-200 object-cover"
        />
      );
    }

    // For documents
    if (["pdf", "doc", "docx", "txt"].includes(extension)) {
      return <FileText className="size-4 text-rose-600" />;
    }

    // Fallback for unknown types
    return <File className="size-4 text-gray-600" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!currentUser || !ticket) return <LoadingSpinner />;

  return (
    <div>
      <div className="animate-fade-in mx-auto max-w-4xl space-y-6">
        <div className="flex items-center space-x-4">
          <Link to={`/tickets/${ticketId}`}>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Ticket</span>
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Ticket</h1>
          <p className="text-gray-600">Update your support request</p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Ticket Details
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
                required
              />
              <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={errors.description}
                rows={6}
                required
              />
              <Select
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>

              {existingAttachments && existingAttachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="flex items-center space-x-2 font-semibold text-gray-900">
                    <Paperclip className="mr-2 size-4" /> Existing Attachments
                  </h3>
                  {existingAttachments.map((att) => (
                    <div
                      key={att._id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                    >
                      <div className="flex min-w-0 flex-1 items-center space-x-2">
                        {getFileIcon(att)}
                        <span className="truncate">{att.fileName}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          {formatFileSize(att.fileSize)}
                        </span>
                      </div>
                      {canEdit && (
                        <>
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(att.fileUrl, "_blank")}
                            >
                              <Download className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setAttachmentToDelete(att);
                                setIsDeleteModalOpen(true);
                              }}
                              className="text-rose-600 hover:text-rose-700"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Upload New Attachments */}
              <div className="mt-4">
                <label className="mb-2 block font-medium text-gray-700">
                  Add Attachments (Optional)
                </label>
                <FileUpload
                  onFileSelect={setAttachments}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  multiple
                  maxSize={10 * 1024 * 1024}
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/tickets/${ticketId}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        size="sm"
      >
        <p>
          Are you sure you want to delete{" "}
          <strong>{attachmentToDelete?.fileName}</strong>?
        </p>
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={async () => {
              try {
                await deleteAttachment({
                  attachmentId: attachmentToDelete._id,
                });
                toast.success("Attachment deleted");
              } catch (err) {
                console.error("Error deleting attachment:", err);
                toast.error(
                  "An error occurred while deleting the attachment. Please try again.",
                );
              } finally {
                setIsDeleteModalOpen(false);
                setAttachmentToDelete(null);
              }
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
