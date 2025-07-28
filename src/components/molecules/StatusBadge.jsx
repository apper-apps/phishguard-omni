import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status, showIcon = true }) => {
  const statusConfig = {
    draft: {
      variant: "default",
      icon: "FileText",
      label: "Draft"
    },
    scheduled: {
      variant: "info",
      icon: "Clock",
      label: "Scheduled"
    },
    active: {
      variant: "warning",
      icon: "Play",
      label: "Active"
    },
    completed: {
      variant: "success",
      icon: "CheckCircle",
      label: "Completed"
    },
    failed: {
      variant: "danger",
      icon: "XCircle",
      label: "Failed"
    }
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <Badge variant={config.variant}>
      {showIcon && (
        <ApperIcon name={config.icon} className="w-3 h-3 mr-1" />
      )}
      {config.label}
    </Badge>
  );
};

export default StatusBadge;