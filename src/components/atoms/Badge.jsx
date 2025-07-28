import { cn } from "@/utils/cn";

const Badge = ({ 
  className, 
  variant = "default",
  children,
  ...props 
}) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800",
    primary: "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20",
    success: "bg-gradient-to-r from-green-100 to-accent/20 text-green-800 border border-green-200",
    warning: "bg-gradient-to-r from-yellow-100 to-warning/20 text-yellow-800 border border-yellow-200",
    danger: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200",
    info: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;