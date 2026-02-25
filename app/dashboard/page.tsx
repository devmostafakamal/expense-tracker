"use client";

import { useCurrency } from "@/components/context/CurrencyContext";
import { exportToPDF } from "@/utlis/exportPDF";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Budget {
  id: number;
  title: string;
  amount: number;
  category: string;
  month: number;
  year: number;
  totalSpent: number;
  remaining: number;
  percentage: number;
  status: "safe" | "warning" | "danger";
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const renderLabel = (props: any) => {
  const { name, percent } = props;
  if (!percent || percent === 0) return "";
  return `${name} ${(percent * 100).toFixed(0)}%`;
};
export default function DashboardPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number | "all">(
    new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [expenses, setExpenses] = useState<any[]>([]);
  const { convert, symbol, loading: currencyLoading } = useCurrency();

  const fetchBudgets = async () => {
    try {
      const res = await fetch("/api/budget");
      const data = await res.json();
      if (data.success) setBudgets(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchExpenses = async () => {
    const res = await fetch("/api/expense");
    const data = await res.json();
    setExpenses(data);
  };

  useEffect(() => {
    fetchBudgets();
    fetchExpenses();
  }, []);

  // Filter
  const filtered = budgets.filter((b) => {
    const monthMatch = selectedMonth === "all" || b.month === selectedMonth;
    const yearMatch = b.year === selectedYear;
    return monthMatch && yearMatch;
  });
  // filtered expenses
  const filteredExpenses = expenses.filter((e) => {
    const monthMatch = selectedMonth === "all" || e.month === selectedMonth;
    return monthMatch && e.year === selectedYear;
  });

  // Summary cards data
  const totalBudget = filtered.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = filtered.reduce((sum, b) => sum + b.totalSpent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const safeCount = filtered.filter((b) => b.status === "safe").length;
  const warningCount = filtered.filter((b) => b.status === "warning").length;
  const dangerCount = filtered.filter((b) => b.status === "danger").length;

  // Bar chart data — budget vs spent per budget title
  const barData = filtered.map((b) => ({
    name: b.title.length > 10 ? b.title.slice(0, 10) + "..." : b.title,
    Budget: b.amount,
    Spent: b.totalSpent,
  }));

  // Pie chart data — category wise spending
  const categoryMap: Record<string, number> = {};
  filtered.forEach((b) => {
    categoryMap[b.category] = (categoryMap[b.category] || 0) + b.totalSpent;
  });
  const pieData = Object.entries(categoryMap)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  const availableYears = [...new Set(budgets.map((b) => b.year))].sort(
    (a, b) => b - a,
  );

  const handleExport = () => {
    exportToPDF({
      budgets: filtered,
      expenses: filteredExpenses,
      month: selectedMonth,
      year: selectedYear,
      userName: user?.fullName ?? user?.emailAddresses[0]?.emailAddress,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 animate-pulse">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>

      {/* Filter Bar */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={selectedMonth}
          onChange={(e) =>
            setSelectedMonth(
              e.target.value === "all" ? "all" : Number(e.target.value),
            )
          }
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">All Months</option>
          {MONTHS.map((m, i) => (
            <option key={i + 1} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {availableYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition ml-auto"
        >
          <FiDownload size={14} />
          Export PDF
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-xs text-gray-500 mb-1">Total Budget</p>
          <p className="text-xl font-bold text-blue-600">
            {symbol}
            {convert(totalBudget).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-xs text-gray-500 mb-1">Total Spent</p>
          <p className="text-xl font-bold text-red-500">
            {symbol}
            {convert(totalBudget).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-xs text-gray-500 mb-1">Remaining</p>
          <p
            className={`text-xl font-bold ${totalRemaining < 0 ? "text-red-600" : "text-green-600"}`}
          >
            {symbol}
            {convert(totalBudget).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-xs text-gray-500 mb-1">Budget Status</p>
          <div className="flex gap-2 mt-1">
            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
              ✔ {safeCount}
            </span>
            <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">
              ⚠ {warningCount}
            </span>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              🔥 {dangerCount}
            </span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Budget vs Spent
          </h2>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={barData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => `৳${Number(value).toLocaleString()}`}
                />
                <Legend />
                <Bar dataKey="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Spent" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No data for this period
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Category Wise Spending
          </h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={renderLabel}
                  labelLine={true}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `৳${Number(value).toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No spending data yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
