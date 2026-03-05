"use client"; // ← যোগ করো

import { useTranslations } from "next-intl"; // ← যোগ করো

interface BudgetCardProps {
  title: string;
  amount: number;
  totalSpent: number;
  remaining: number;
  percentage: number;
}

export default function BudgetCard({
  title,
  amount,
  totalSpent,
  remaining,
  percentage,
}: BudgetCardProps) {
  const t = useTranslations("budgetCard"); // ← যোগ করো

  const getStatus = () => {
    if (percentage >= 100) return "danger";
    if (percentage >= 80) return "warning";
    return "safe";
  };

  const status = getStatus();
  const statusColor =
    status === "danger"
      ? "bg-red-500"
      : status === "warning"
        ? "bg-yellow-500"
        : "bg-green-500";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">
          {t("budget")}: ৳ {amount.toLocaleString()}
        </p>
      </div>

      <div className="text-sm space-y-1">
        <p>
          {t("spent")}: ৳ {totalSpent.toLocaleString()}
        </p>
        <p>
          {t("remaining")}:{" "}
          <span className={remaining < 0 ? "text-red-600 font-medium" : ""}>
            ৳ {remaining.toLocaleString()}
          </span>
        </p>
      </div>

      <div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`${statusColor} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-right mt-1">{percentage.toFixed(0)}%</p>
      </div>

      <div>
        {status === "safe" && (
          <p className="text-green-600 text-sm">✔ {t("safe")}</p>
        )}
        {status === "warning" && (
          <p className="text-yellow-600 text-sm">⚠ {t("almostFull")}</p>
        )}
        {status === "danger" && (
          <p className="text-red-600 text-sm">🔥 {t("exceeded")}</p>
        )}
      </div>
    </div>
  );
}
