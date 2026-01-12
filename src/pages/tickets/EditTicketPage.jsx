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
    ticketId ? { ticketId } : "skip"
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
    } catch (error) {
      console.error("Error updating ticket:", error);
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
          className="w-12 h-12 object-cover rounded border border-surface-200"
        />
      );
    }

    // For documents
    if (["pdf", "doc", "docx", "txt"].includes(extension)) {
      return <FileText className="w-4 h-4 text-error-600" />;
    }

    // Fallback for unknown types
    return <File className="w-4 h-4 text-surface-600" />;
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
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center space-x-4">
          <Button
            as={Link}
            to={`/tickets/${ticketId}`}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Ticket</span>
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-surface-900">Edit Ticket</h1>
          <p className="text-surface-600">Update your support request</p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-surface-900">
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
                <div className="space-y-2 mt-4">
                  <h3 className="font-semibold text-surface-900 flex items-center space-x-2">
                    <Paperclip className="w-4 h-4 mr-2" /> Existing Attachments
                  </h3>
                  {existingAttachments.map((att) => (
                    <div
                      key={att._id}
                      className="flex items-center justify-between p-3 border border-surface-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        {getFileIcon(att)}
                        <span className="truncate">{att.fileName}</span>
                        <span className="text-sm text-surface-500 ml-2">
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
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setAttachmentToDelete(att);
                                setIsDeleteModalOpen(true);
                              }}
                              className="text-error-600 hover:text-error-700"
                            >
                              <Trash2 className="w-4 h-4" />
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
                <label className="block font-medium text-surface-700 mb-2">
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
        <div className="flex justify-end space-x-2 mt-4">
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
              } catch (err) {
                console.error("Error deleting attachment:", err);
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
