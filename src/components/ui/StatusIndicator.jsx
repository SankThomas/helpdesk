import { CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";

export const StatusIndicator = ({ status, size = "md" }) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const statusConfig = {
    open: {
      icon: AlertTriangle,
      color: "text-error-600",
      bgColor: "bg-error-100",
      label: "Open",
    },
    pending: {
      icon: Clock,
      color: "text-warning-600",
      bgColor: "bg-warning-100",
      label: "Pending",
    },
    resolved: {
      icon: CheckCircle,
      color: "text-success-600",
      bgColor: "bg-success-100",
      label: "Resolved",
    },
    closed: {
      icon: XCircle,
      color: "text-surface-600",
      bgColor: "bg-surface-100",
      label: "Closed",
    },
  };

  const config = statusConfig[status] || statusConfig.open;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full ${config.bgColor}`}
    >
      <Icon className={`${sizeClasses[size]} ${config.color}`} />
      <span className={`text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
};
