"use client";

import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import { toast } from "sonner";
import Pusher from "pusher-js";
import { useUser } from "@clerk/nextjs";

type BudgetAlert = {
  type: "EXCEEDED" | "WARNING" | "ALERT_60"; // 👈 ALERT_60 যোগ করো
  budgetId: number;
  title: string;
  budgetAmount: number;
  totalSpent: number;
  percentage: number;
  message: string;
};

export default function NotificationBell() {
  const { user } = useUser();
  const [hasNotification, setHasNotification] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`user-${user.id}`);

    channel.bind("budget-alert", (data: BudgetAlert) => {
      setHasNotification(true);
      setCount((prev) => prev + 1);

      if (data.type === "EXCEEDED") {
        toast.error(data.message, {
          duration: 8000,
          description: `Overspent by ৳${data.totalSpent - data.budgetAmount}`,
        });
      } else if (data.type === "WARNING") {
        toast.warning(data.message, {
          duration: 6000,
          description: `৳${data.budgetAmount - data.totalSpent} remaining (80%)`,
        });
      } else if (data.type === "ALERT_60") {
        toast.info(data.message, {
          duration: 5000,
          description: `৳${data.budgetAmount - data.totalSpent} remaining (60%)`,
        });
      }
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`user-${user.id}`);
      pusher.disconnect();
    };
  }, [user?.id]);

  return (
    <button
      className="relative p-2 rounded-full hover:bg-gray-100 transition"
      onClick={() => {
        setHasNotification(false);
        setCount(0);
      }}
    >
      <FiBell className="text-xl text-gray-700" />
      {hasNotification && (
        <>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {count > 9 ? "9+" : count}
          </span>
        </>
      )}
    </button>
  );
}
