"use client";
import { useEffect, useState } from "react";

interface Budget {
  id: number;
  title: string;
  amount: number;
}

export default function ExpenseForm({
  budgets,
  onSuccess,
}: {
  budgets: Budget[];
  onSuccess?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBudgetId) {
      alert("Please select a budget!");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/expense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        amount,
        month,
        year,
        budgetId: selectedBudgetId, // ✅ now it exists
      }),
    });

    if (res.ok) {
      setTitle("");
      setAmount(0);
      onSuccess?.();
    } else {
      const data = await res.json();
      alert(data.message || "Failed to add expense");
    }

    setLoading(false);
  };
  useEffect(() => {
    if (budgets && budgets.length > 0 && !selectedBudgetId) {
      setSelectedBudgetId(budgets[0].id);
    }
  }, [budgets]);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto space-y-4"
    >
      <h2 className="text-2xl font-semibold text-gray-800">Add Expense</h2>

      {/* Budget Select */}
      <div className="flex flex-col">
        <label htmlFor="budget" className="mb-1 text-gray-600 font-medium">
          Select Budget
        </label>
        <select
          id="budget"
          value={selectedBudgetId ?? ""}
          onChange={(e) => setSelectedBudgetId(Number(e.target.value))}
          required
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="" disabled>
            Select Budget
          </option>
          {budgets?.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} (${b.amount})
            </option>
          ))}
        </select>
      </div>

      {/* Expense Title */}
      <div className="flex flex-col">
        <label htmlFor="title" className="mb-1 text-gray-600 font-medium">
          Expense Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter expense name"
          required
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Amount */}
      <div className="flex flex-col">
        <label htmlFor="amount" className="mb-1 text-gray-600 font-medium">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter amount"
          required
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Month & Year Row */}
      <div className="flex space-x-4">
        <div className="flex-1 flex flex-col">
          <label htmlFor="month" className="mb-1 text-gray-600 font-medium">
            Month
          </label>
          <input
            id="month"
            type="number"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            min={1}
            max={12}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <label htmlFor="year" className="mb-1 text-gray-600 font-medium">
            Year
          </label>
          <input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        {loading ? "Saving..." : "Add Expense"}
      </button>
    </form>
  );
}
