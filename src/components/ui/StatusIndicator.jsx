import { CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";

export const StatusIndicator = ({ status, size = "md" }) => {
  const sizeClasses = {
    sm: "size-3",
    md: "size-4",
    lg: "size-5",
  };

  const statusConfig = {
    open: {
      icon: AlertTriangle,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
      label: "Open",
    },
    pending: {
      icon: Clock,
      color: "text-red-600",
      bgColor: "bg-red-100",
      label: "Pending",
    },
    resolved: {
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      label: "Resolved",
    },
    closed: {
      icon: XCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      label: "Closed",
    },
  };

  const config = statusConfig[status] || statusConfig.open;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center space-x-2 rounded-full px-2 py-1 ${config.bgColor}`}
    >
      <Icon className={`${sizeClasses[size]} ${config.color}`} />
      <span className={`text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
};
