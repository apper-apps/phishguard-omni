import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isMobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="px-4 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;