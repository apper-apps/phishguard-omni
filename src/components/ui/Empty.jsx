import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  className,
  icon = "Inbox",
  title = "No data found",
  description = "Get started by creating your first item.",
  action,
  actionLabel = "Get Started"
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-6 text-center",
      className
    )}>
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      
      {action && (
        <button
          onClick={action}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;