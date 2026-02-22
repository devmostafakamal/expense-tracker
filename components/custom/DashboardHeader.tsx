"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";
import { FiSearch, FiBell, FiMenu } from "react-icons/fi";

type DashboardHeaderProps = {
  title?: string;
  toggleSidebar?: () => void; // ✅ optional prop for mobile sidebar
};

export default function DashboardHeader({
  title = "Dashboard",
  toggleSidebar,
}: DashboardHeaderProps) {
  return (
    <div className="w-full flex justify-between items-center px-6 py-4 bg-white border-b shadow-sm">
      {/* Left Side: Hamburger + Title */}
      <div className="flex items-center gap-4">
        {/* Hamburger button for mobile */}
        {toggleSidebar && (
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
            onClick={toggleSidebar}
          >
            <FiMenu className="text-gray-700 text-xl" />
          </button>
        )}

        {/* Title */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">Manage your expenses easily</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Search input (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-40"
          />
        </div>

        {/* Notification */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <FiBell className="text-xl text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Clerk User */}
        <UserButton />
      </div>
    </div>
  );
}
