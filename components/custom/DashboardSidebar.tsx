"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdDashboard } from "react-icons/md";
import { RiVipCrownFill } from "react-icons/ri";

type MenuItem = {
  id: number;
  name: string;
  path: string;
  icon: any;
};

type DashboardSidebarProps = {
  onLinkClick?: () => void; // ✅ optional callback for mobile
};

function DashboardSidebar({ onLinkClick }: DashboardSidebarProps) {
  const pathname = usePathname();
  const menuList: MenuItem[] = [
    { id: 1, name: "Dashboard", path: "/dashboard", icon: MdDashboard },
    { id: 2, name: "Budgets", path: "/dashboard/budgets", icon: GiTakeMyMoney },
    {
      id: 3,
      name: "Expense",
      path: "/dashboard/expense",
      icon: FaMoneyBillWave,
    },
    {
      id: 4,
      name: "Upgrade",
      path: "/dashboard/upgrade",
      icon: RiVipCrownFill,
    },
  ];

  return (
    <div className="h-screen p-5 border shadow-sm bg-white flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image src={"/expense.png"} width={50} height={30} alt="logo" />
        <h2 className="font-semibold text-lg">Expense</h2>
      </div>

      {/* Menu */}
      <div className="mt-10 flex-1">
        <ul className="space-y-3">
          {menuList.map((menu) => {
            const Icon = menu.icon;
            const isActive = pathname === menu.path;

            return (
              <li key={menu.id}>
                <Link
                  href={menu.path}
                  onClick={onLinkClick} // ✅ closes sidebar on mobile
                  className={`flex items-center gap-3 p-2 rounded-md font-medium hover:bg-gray-100 transition ${
                    isActive ? "bg-gray-200" : ""
                  }`}
                >
                  <Icon className="text-xl" />
                  <span>{menu.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Optional profile button at bottom */}
      <div className="mt-auto flex items-center gap-2">
        <UserButton />
        <span className="hidden sm:inline">Profile</span>
      </div>
    </div>
  );
}

export default DashboardSidebar;
