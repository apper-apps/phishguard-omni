import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral",
  icon,
  trend = "up",
  className 
}) => {
  const changeColors = {
    positive: "text-green-600 bg-green-50",
    negative: "text-red-600 bg-red-50",
    neutral: "text-gray-600 bg-gray-50"
  };

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {value}
            </p>
            {change && (
              <div className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2",
                changeColors[changeType]
              )}>
                <ApperIcon 
                  name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                  className="w-3 h-3 mr-1" 
                />
                {change}
              </div>
            )}
          </div>
          {icon && (
            <div className="ml-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name={icon} className="w-6 h-6 text-primary" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;