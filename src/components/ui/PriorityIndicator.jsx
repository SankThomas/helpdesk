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
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      label: "Low",
    },
    medium: {
      icon: Minus,
      color: "text-red-600",
      bgColor: "bg-red-100",
      label: "Medium",
    },
    high: {
      icon: ArrowUp,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
      label: "High",
    },
    urgent: {
      icon: AlertTriangle,
      color: "text-rose-700",
      bgColor: "bg-rose-200",
      label: "Urgent",
    },
  };

  const config = priorityConfig[priority] || priorityConfig.medium;
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
