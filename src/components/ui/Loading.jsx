import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default" }) => {
  if (variant === "skeleton") {
    return (
      <div className={cn("animate-pulse space-y-4", className)}>
        <div className="flex space-x-4">
          <div className="rounded-full bg-gradient-to-r from-gray-200 to-gray-300 h-12 w-12"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn("animate-pulse space-y-4", className)}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/6"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/5"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/8"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <span className="ml-3 text-gray-600 font-medium">Loading...</span>
    </div>
  );
};

export default Loading;