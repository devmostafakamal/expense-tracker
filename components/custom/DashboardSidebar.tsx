"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { FiCreditCard, FiTarget } from "react-icons/fi";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdDashboard } from "react-icons/md";
import { RiVipCrownFill } from "react-icons/ri";
import { useTranslations } from "next-intl"; // ← যোগ করো

type MenuItem = {
  id: number;
  name: string;
  path: string;
  icon: any;
};

type DashboardSidebarProps = {
  onLinkClick?: () => void;
};

function DashboardSidebar({ onLinkClick }: DashboardSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("nav"); // ← যোগ করো

  const menuList: MenuItem[] = [
    { id: 1, name: t("dashboard"), path: "/dashboard", icon: MdDashboard },
    {
      id: 2,
      name: t("budgets"),
      path: "/dashboard/budgets",
      icon: GiTakeMyMoney,
    },
    {
      id: 3,
      name: t("expense"),
      path: "/dashboard/expense",
      icon: FaMoneyBillWave,
    },
    {
      id: 4,
      name: t("upgrade"),
      path: "/dashboard/upgrade",
      icon: RiVipCrownFill,
    },
    { id: 5, name: t("savings"), path: "/dashboard/savings", icon: FiTarget },
    {
      id: 6,
      name: t("accounts"),
      path: "/dashboard/accounts",
      icon: FiCreditCard,
    },
  ];

  return (
    <div className="h-screen p-5 border shadow-sm bg-white flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image src={"/expense.png"} width={50} height={30} alt="logo" />
        <h2 className="font-semibold text-lg">Spendly</h2>
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
                  onClick={onLinkClick}
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
    </div>
  );
}

export default DashboardSidebar;
