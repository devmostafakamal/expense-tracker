"use client";

import React, { ReactNode, useState } from "react";
import DashboardHeader from "@/components/custom/DashboardHeader";
import DashboardSidebar from "@/components/custom/DashboardSidebar";
import { useCheckBudgets } from "@/components/hooks/useCheckBudgets";
import { CurrencyProvider } from "@/components/context/CurrencyContext";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  useCheckBudgets();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const openSidebar = () => setSidebarOpen(true);

  return (
    <CurrencyProvider>
      <div className="min-h-screen flex flex-col lg:flex-row overflow-x-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 border-r min-h-screen">
          <DashboardSidebar onLinkClick={closeSidebar} />
        </div>

        {/* Mobile Sidebar Overlay */}
        <div
          className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
            sidebarOpen ? "visible bg-black/50" : "invisible bg-black/0"
          }`}
          onClick={closeSidebar}
        >
          <div
            className={`w-64 bg-white h-full p-4 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <DashboardSidebar onLinkClick={closeSidebar} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
          {/* Header */}
          <DashboardHeader toggleSidebar={openSidebar} />

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </CurrencyProvider>
  );
}
