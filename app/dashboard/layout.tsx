"use client";

import React, { ReactNode, useState } from "react";
import DashboardHeader from "@/components/custom/DashboardHeader";
import DashboardSidebar from "@/components/custom/DashboardSidebar";
import { useCheckBudgets } from "@/components/hooks/useCheckBudgets";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  useCheckBudgets();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const openSidebar = () => setSidebarOpen(true);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 border-r min-h-screen">
        <DashboardSidebar onLinkClick={closeSidebar} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={closeSidebar} // click outside to close
        >
          <div
            className="w-64 bg-white h-full p-4"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <DashboardSidebar onLinkClick={closeSidebar} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header */}
        <DashboardHeader toggleSidebar={openSidebar} />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
