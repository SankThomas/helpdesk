import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { Bell, X, Check, Trash2, Clock, User, Ticket } from "lucide-react";
import { Button } from "./Button";
import { Badge } from "./Badge";

export const NotificationDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const notifications = useQuery(
    api.notifications.getNotifications,
    user ? { userId: user._id } : "skip"
  );

  const unreadCount = useQuery(
    api.notifications.getUnreadCount,
    user ? { userId: user._id } : "skip"
  );

  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead({ notificationId: notification._id });
    }

    if (notification.ticketId) {
      navigate(`/tickets/${notification.ticketId}`);
    }

    setIsOpen(false);
  };

  const handleMarkAllRead = async () => {
    if (user) {
      await markAllAsRead({ userId: user._id });
    }
  };

  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    await deleteNotification({ notificationId });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "ticket_created":
      case "ticket_assigned":
      case "ticket_status_changed":
        return <Ticket className="size-4" />;
      case "comment_added":
      case "internal_note_added":
        return <User className="size-4" />;
      default:
        return <Bell className="size-4" />;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date().getTime();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1">
            <span className="flex size-5">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-error-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-5 bg-error-500 text-white text-xs items-center justify-center font-medium">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </span>
          </div>
        )}
      </Button>

      {isOpen && (
        <div className="absolute -right-40! mt-2 w-96 glass bg-white! rounded-xl shadow-xl border border-surface-200! z-50 animate-bounce-in">
          <div className="p-4 border-b border-surface-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-surface-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllRead}
                    className="text-xs"
                  >
                    <Check className="size-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {!notifications || notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="size-12 text-surface-400 mx-auto mb-3" />
                <p className="text-surface-500">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-surface-200">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-surface-50 cursor-pointer transition-colors ${
                      !notification.read ? "bg-primary-50" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`shrink-0 size-8 rounded-full flex items-center justify-center ${
                          !notification.read
                            ? "bg-primary-100 text-primary-600"
                            : "bg-surface-100 text-surface-600"
                        }`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="group flex items-start justify-between">
                          <div className="flex-1">
                            <p
                              className={`font-medium ${
                                !notification.read
                                  ? "text-surface-900"
                                  : "text-surface-700"
                              }`}
                            >
                              {notification.title}
                            </p>
                            <p className="text-surface-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <div className="flex items-center space-x-1 text-xs text-surface-500">
                                <Clock className="size-3" />
                                <span>
                                  {formatTimeAgo(notification.createdAt)}
                                </span>
                              </div>
                              {!notification.read && (
                                <Badge variant="primary" size="sm">
                                  New
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) =>
                              handleDeleteNotification(notification._id, e)
                            }
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
