import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;