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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="font-semibold text-surface-900">Attachments</h2>
            {attachments && (
              <Badge variant="secondary" size="sm">
                {attachments.length}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {!attachments ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            </div>
          ) : attachments.length === 0 ? (
            <div className="text-center py-8">
              <Paperclip className="w-12 h-12 text-surface-400 mx-auto mb-3" />
              <p className="text-surface-500">No attachments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attachments.map((attachment) => (
                <div
                  key={attachment._id}
                  className="flex items-center justify-between p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {getFileIcon(attachment)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-surface-900 truncate">
                        {attachment.fileName}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-surface-500">
                        <span>{formatFileSize(attachment.fileSize)}</span>
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
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
                      <Download className="w-4 h-4" />
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
