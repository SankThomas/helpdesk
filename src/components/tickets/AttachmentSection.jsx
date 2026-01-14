import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { User } from "lucide-react";
import { FileText } from "lucide-react";
import { Image } from "lucide-react";
import { Download } from "lucide-react";
import { Paperclip } from "lucide-react";

export const AttachmentSection = ({ ticketId }) => {
  const attachments = useQuery(api.attachments.getAttachmentByTicket, {
    ticketId,
  });

  const getFileIcon = (attachment) => {
    const { fileName, fileUrl } = attachment;
    const extension = fileName.split(".").pop()?.toLowerCase();

    // For images, return an actual image preview
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
      return (
        <img
          src={fileUrl}
          alt={fileName}
          className="border-surface-200 size-12 rounded border object-cover"
        />
      );
    }

    // For documents
    if (["pdf", "doc", "docx", "txt"].includes(extension)) {
      return <FileText className="text-error-600 size-6" />;
    }

    // Fallback for unknown types
    return <File className="text-surface-600 size-6" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-surface-900 font-semibold">Attachments</h2>
            {attachments && (
              <Badge variant="secondary" size="sm">
                {attachments.length}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2!">
        <div className="space-y-4">
          {!attachments ? (
            <div className="flex justify-center py-4">
              <div className="border-primary-600 size-6 animate-spin rounded-full border-b-2"></div>
            </div>
          ) : attachments.length === 0 ? (
            <div className="py-8 text-center">
              <Paperclip className="text-surface-400 mx-auto mb-3 size-12" />
              <p className="text-surface-500">No attachments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attachments.map((attachment) => (
                <div
                  key={attachment._id}
                  className="border-surface-200 hover:bg-surface-50 flex items-center justify-between rounded-lg border p-2 transition-colors"
                >
                  <div className="flex min-w-0 flex-1 items-center space-x-3">
                    {getFileIcon(attachment)}
                    <div className="min-w-0 flex-1">
                      <p className="text-surface-900 truncate font-medium">
                        {attachment.fileName}
                      </p>
                      <div className="text-surface-500 flex flex-wrap items-center space-x-4 text-sm">
                        <span>{formatFileSize(attachment.fileSize)}</span>
                        <div className="flex items-center space-x-1">
                          <User className="size-4" />
                          <span>{attachment.user?.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(attachment.fileUrl, "_blank")}
                    >
                      <Download className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
