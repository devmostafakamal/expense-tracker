"use client";

import { useCurrency } from "@/components/context/CurrencyContext";
import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiTarget, FiDollarSign } from "react-icons/fi";
import { toast } from "sonner";

interface SavingsGoal {
  id: number;
  title: string;
  targetAmount: number;
  savedAmount: number;
  currency: string;
  deadline: string | null;
  category: string;
}

const GOAL_CATEGORIES = [
  "General",
  "Emergency Fund",
  "Vacation",
  "Education",
  "Home",
  "Car",
  "Wedding",
  "Retirement",
  "Other",
];

const CURRENCIES = [
  { code: "BDT", symbol: "৳" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
];

function getCurrencySymbol(code: string) {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}

export default function SavingsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [addingTo, setAddingTo] = useState<number | null>(null);
  const [addAmount, setAddAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { convert, symbol } = useCurrency();

  // Form state
  const [form, setForm] = useState({
    title: "",
    targetAmount: 0,
    savedAmount: 0,
    currency: "BDT",
    deadline: "",
    category: "General",
  });

  const fetchGoals = async () => {
    const res = await fetch("/api/savings");
    const data = await res.json();
    if (data.success) setGoals(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/savings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Goal created!");
      setGoals((prev) => [data.data, ...prev]);
      setShowForm(false);
      setForm({
        title: "",
        targetAmount: 0,
        savedAmount: 0,
        currency: "BDT",
        deadline: "",
        category: "General",
      });
    }
  };

  const handleAddSavings = async (goal: SavingsGoal) => {
    const newAmount = goal.savedAmount + addAmount;
    const res = await fetch("/api/savings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: goal.id, savedAmount: newAmount }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(`৳${addAmount} added!`);
      setGoals((prev) =>
        prev.map((g) =>
          g.id === goal.id ? { ...g, savedAmount: newAmount } : g,
        ),
      );
      setAddingTo(null);
      setAddAmount(0);
      if (newAmount >= goal.targetAmount) {
        toast.success(`🎉 "${goal.title}" goal completed!`, { duration: 6000 });
      }
    }
  };

  const handleDelete = async (id: number) => {
    await fetch("/api/savings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setGoals((prev) => prev.filter((g) => g.id !== id));
    toast.success("Goal deleted");
  };

  // Summary
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
  const completed = goals.filter((g) => g.savedAmount >= g.targetAmount).length;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 animate-pulse">Loading goals...</p>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your financial goals
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition"
        >
          <FiPlus /> New Goal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border shadow-sm text-center">
          <p className="text-xs text-gray-500 mb-1">Total Target</p>
          <p className="text-xl font-bold text-indigo-600">
            {symbol}
            {convert(totalTarget, "BDT").toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border shadow-sm text-center">
          <p className="text-xs text-gray-500 mb-1">Total Saved</p>
          <p className="text-xl font-bold text-green-600">
            {symbol}
            {convert(totalSaved, "BDT").toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border shadow-sm text-center">
          <p className="text-xs text-gray-500 mb-1">Completed</p>
          <p className="text-xl font-bold text-yellow-500">
            {completed}/{goals.length}
          </p>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {goals.length === 0 ? (
          <div className="col-span-2 text-center py-16 text-gray-400">
            <FiTarget size={40} className="mx-auto mb-3 opacity-30" />
            <p>No savings goals yet. Create your first one!</p>
          </div>
        ) : (
          goals.map((goal) => {
            const pct = Math.min(
              (goal.savedAmount / goal.targetAmount) * 100,
              100,
            );
            const isComplete = goal.savedAmount >= goal.targetAmount;
            const symbol = getCurrencySymbol(goal.currency);
            const daysLeft = goal.deadline
              ? Math.ceil(
                  (new Date(goal.deadline).getTime() - Date.now()) / 86400000,
                )
              : null;

            return (
              <div
                key={goal.id}
                className={`bg-white rounded-2xl p-5 border shadow-sm space-y-4 ${isComplete ? "border-green-200" : ""}`}
              >
                {/* Title row */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {goal.title}
                      </h3>
                      {isComplete && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                          ✔ Done
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {goal.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-gray-300 hover:text-red-500 transition"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>

                {/* Amount */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Saved</span>
                  <span className="font-medium">
                    {symbol}
                    {convert(goal.savedAmount, goal.currency).toLocaleString(
                      undefined,
                      { maximumFractionDigits: 2 },
                    )}{" "}
                    / {symbol}
                    {convert(goal.targetAmount, goal.currency).toLocaleString(
                      undefined,
                      { maximumFractionDigits: 2 },
                    )}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${isComplete ? "bg-green-500" : "bg-indigo-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{pct.toFixed(0)}%</span>
                  {daysLeft !== null && (
                    <span className={daysLeft < 0 ? "text-red-400" : ""}>
                      {daysLeft < 0 ? "Overdue" : `${daysLeft} days left`}
                    </span>
                  )}
                </div>

                {/* Add savings */}
                {!isComplete &&
                  (addingTo === goal.id ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={addAmount}
                        onChange={(e) => setAddAmount(Number(e.target.value))}
                        className="flex-1 border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Amount"
                      />
                      <button
                        onClick={() => handleAddSavings(goal)}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setAddingTo(null)}
                        className="text-gray-400 px-2 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingTo(goal.id)}
                      className="w-full flex items-center justify-center gap-2 text-sm text-indigo-600 border border-indigo-200 rounded-lg py-2 hover:bg-indigo-50 transition"
                    >
                      <FiDollarSign size={14} /> Add Savings
                    </button>
                  ))}
              </div>
            );
          })
        )}
      </div>

      {/* Create Goal Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900">
              Create Savings Goal
            </h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                type="text"
                placeholder="Goal title (e.g. Emergency Fund)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.currency}
                  onChange={(e) =>
                    setForm({ ...form, currency: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} {c.code}
                    </option>
                  ))}
                </select>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {GOAL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="number"
                placeholder="Target amount"
                value={form.targetAmount || ""}
                onChange={(e) =>
                  setForm({ ...form, targetAmount: Number(e.target.value) })
                }
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <input
                type="number"
                placeholder="Already saved (optional)"
                value={form.savedAmount || ""}
                onChange={(e) =>
                  setForm({ ...form, savedAmount: Number(e.target.value) })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Deadline (optional)
                </label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) =>
                    setForm({ ...form, deadline: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Create Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
