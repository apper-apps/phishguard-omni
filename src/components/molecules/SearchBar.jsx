import { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className,
  debounceMs = 300 
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (onSearch) {
      // Simple debounce implementation
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => {
        onSearch(value);
      }, debounceMs);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="h-4 w-4 text-gray-500" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 pr-4"
      />
      {searchTerm && (
        <button
          onClick={() => handleSearch("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700"
        >
          <ApperIcon name="X" className="h-4 w-4 text-gray-400" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;