import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Select } from "../../components/ui/Select";
import { FileUpload } from "../../components/ui/FileUpload";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ArrowLeft } from "lucide-react";
import { useCurrentUser } from "../../hooks/useCurrentUser";

export const CreateTicketPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { currentUser } = useCurrentUser();

  const createTicket = useMutation(api.tickets.createTicket);
  const generateUploadUrl = useMutation(api.attachments.generateUploadUrl);
  const createAttachment = useMutation(api.attachments.createAttachment);

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !currentUser) return;

    setIsSubmitting(true);

    try {
      const ticketId = await createTicket({
        title: title.trim(),
        description: description.trim(),
        priority,
        userId: currentUser._id,
      });

      // Upload attachments to convex
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
      console.error("Error creating ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return <LoadingSpinner />;
  }

  return (
    <div className="animate-fade-in mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/tickets">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Tickets</span>
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-surface-900 text-2xl font-bold">
          Create New Ticket
        </h1>
        <p className="text-surface-600">Submit a new support request</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <h2 className="text-surface-900 text-lg font-semibold">
            Ticket Details
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Title"
              placeholder="Brief description of your issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              required
            />

            <Textarea
              label="Description"
              placeholder="Please provide detailed information about your issue..."
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
              <option value="low">
                Low - General questions or minor issues
              </option>
              <option value="medium">Medium - Standard support request</option>
              <option value="high">
                High - Important issue affecting work
              </option>
              <option value="urgent">
                Urgent - Critical issue requiring immediate attention
              </option>
            </Select>

            <div>
              <label className="text-surface-700 mb-2 block font-medium">
                Attachments (Optional)
              </label>
              <FileUpload
                onFileSelect={setAttachments}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                multiple={true}
                maxSize={10 * 1024 * 1024} // 10MB
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/tickets")}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Create Ticket
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
