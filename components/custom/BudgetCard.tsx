// components/BudgetCard.tsx

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
      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">
          Budget: ৳ {amount.toLocaleString()}
        </p>
      </div>

      {/* Numbers */}
      <div className="text-sm space-y-1">
        <p>Spent: ৳ {totalSpent.toLocaleString()}</p>
        <p>
          Remaining:{" "}
          <span className={remaining < 0 ? "text-red-600 font-medium" : ""}>
            ৳ {remaining.toLocaleString()}
          </span>
        </p>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`${statusColor} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <p className="text-xs text-right mt-1">{percentage.toFixed(0)}%</p>
      </div>

      {/* Status Label */}
      <div>
        {status === "safe" && <p className="text-green-600 text-sm">✔ Safe</p>}
        {status === "warning" && (
          <p className="text-yellow-600 text-sm">⚠ Almost Full</p>
        )}
        {status === "danger" && (
          <p className="text-red-600 text-sm">🔥 Budget Exceeded</p>
        )}
      </div>
    </div>
  );
}
