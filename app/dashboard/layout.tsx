"use client";

import DashboardHeader from "@/components/custom/DashboardHeader";
import DashboardSidebar from "@/components/custom/DashboardSidebar";
import { useCheckBudgets } from "@/components/hooks/useCheckBudgets";

import React, { ReactNode, useEffect } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  useCheckBudgets();
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full lg:w-64 lg:min-h-screen border-b lg:border-b-0 lg:border-r">
        <DashboardSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header */}
        <DashboardHeader />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
