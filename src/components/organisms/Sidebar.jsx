import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ className, isMobileOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "BarChart3" },
    { name: "Campaigns", href: "/campaigns", icon: "Mail" },
    { name: "Employees", href: "/employees", icon: "Users" },
    { name: "Templates", href: "/templates", icon: "FileText" },
    { name: "Reports", href: "/reports", icon: "PieChart" },
    { name: "Settings", href: "/settings", icon: "Settings" }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Shield" className="w-6 h-6 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              PhishGuard Pro
            </h1>
            <p className="text-xs text-gray-500">Security Training</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:text-gray-900"
              )}
            >
              <ApperIcon name={item.icon} className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Version 1.0.0
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200 lg:z-40", className)}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={onClose}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <ApperIcon name="X" className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;