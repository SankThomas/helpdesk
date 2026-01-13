import { ArrowUp, ArrowDown, Minus, AlertTriangle } from "lucide-react";

export const PriorityIndicator = ({ priority, size = "md" }) => {
  const sizeClasses = {
    sm: "size-3",
    md: "size-4",
    lg: "size-5",
  };

  const priorityConfig = {
    low: {
      icon: ArrowDown,
      color: "text-surface-600",
      bgColor: "bg-surface-100",
      label: "Low",
    },
    medium: {
      icon: Minus,
      color: "text-warning-600",
      bgColor: "bg-warning-100",
      label: "Medium",
    },
    high: {
      icon: ArrowUp,
      color: "text-error-600",
      bgColor: "bg-error-100",
      label: "High",
    },
    urgent: {
      icon: AlertTriangle,
      color: "text-error-700",
      bgColor: "bg-error-200",
      label: "Urgent",
    },
  };

  const config = priorityConfig[priority] || priorityConfig.medium;
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
