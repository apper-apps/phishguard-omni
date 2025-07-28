import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105 focus:ring-primary/50",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:shadow-md focus:ring-gray-400/50",
    outline: "border-2 border-primary text-primary bg-white hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white focus:ring-primary/50",
    ghost: "text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:text-gray-900 focus:ring-gray-400/50",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:scale-105 focus:ring-red-500/50",
    success: "bg-gradient-to-r from-accent to-green-600 text-white hover:shadow-lg hover:scale-105 focus:ring-accent/50"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <ApperIcon name="Loader2" className="w-4 h-4 animate-spin mr-2" />
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <ApperIcon name={icon} className="w-4 h-4 mr-2" />
          )}
          {children}
          {icon && iconPosition === "right" && (
            <ApperIcon name={icon} className="w-4 h-4 ml-2" />
          )}
        </>
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;