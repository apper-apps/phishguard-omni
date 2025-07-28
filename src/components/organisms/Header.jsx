import React, { useState } from "react";
import LogoutButton from "@/components/organisms/LogoutButton";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Header = ({ title, subtitle, onMenuClick, actions, className }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      message: "Campaign 'Q4 Security Test' completed",
      time: "2 minutes ago",
      type: "success"
    },
    {
      id: 2,
      message: "3 employees failed latest simulation",
      time: "1 hour ago",
      type: "warning"
    },
    {
      id: 3,
      message: "New phishing template available",
      time: "3 hours ago",
      type: "info"
    }
  ];

  return (
    <header className={cn("bg-white border-b border-gray-200 px-4 lg:px-6 py-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden mr-2"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {actions}

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <ApperIcon name="Bell" className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.length}
              </span>
            </Button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-start">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-2 mr-3",
                          notification.type === "success" && "bg-green-400",
                          notification.type === "warning" && "bg-yellow-400",
                          notification.type === "info" && "bg-blue-400"
                        )} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <Button variant="ghost" size="sm" className="w-full">
                    View all notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

{/* User menu */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-4 h-4 text-white" />
            </div>
            <LogoutButton className="text-gray-600 hover:text-gray-900" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;