"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl"; // ← যোগ করো

const CATEGORIES = [
  "Food",
  "Rent",
  "Travel",
  "Shopping",
  "Health",
  "Education",
  "Entertainment",
  "Other",
];

interface Budget {
  id: number;
  title: string;
  amount: number;
  month: number;
  year: number;
}

export default function ExpenseForm({
  budgets,
  onSuccess,
}: {
  budgets: Budget[];
  onSuccess?: () => void;
}) {
  const t = useTranslations("expense"); // ← যোগ করো
  const tb = useTranslations("budget"); // ← categories এর জন্য

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);
  const [category, setCategory] = useState("Other");
  const [customCategory, setCustomCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [amountError, setAmountError] = useState("");

  const selectedBudget =
    budgets?.find((b) => b.id === selectedBudgetId) ?? null;

  const handleBudgetChange = (budgetId: number) => {
    setSelectedBudgetId(budgetId);
    setAmount(0);
    setAmountError("");
    const budget = budgets?.find((b) => b.id === budgetId);
    if (budget) {
      setMonth(budget.month);
      setYear(budget.year);
    }
  };

  const handleAmountChange = (value: number) => {
    setAmount(value);
    if (selectedBudget && value > selectedBudget.amount) {
      setAmountError(
        `Amount cannot exceed budget limit of ৳${selectedBudget.amount}`,
      );
    } else if (value <= 0) {
      setAmountError("Amount must be greater than 0");
    } else {
      setAmountError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBudgetId || !selectedBudget) {
      alert(t("selectBudget"));
      return;
    }
    if (amount <= 0) {
      setAmountError("Amount must be greater than 0");
      return;
    }
    if (amount > selectedBudget.amount) {
      setAmountError(
        `Amount cannot exceed budget limit of ৳${selectedBudget.amount}`,
      );
      return;
    }
    setLoading(true);
    const finalCategory = category === "Custom" ? customCategory : category;
    const res = await fetch("/api/expense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        amount,
        month,
        year,
        budgetId: selectedBudgetId,
        category: finalCategory,
      }),
    });
    if (res.ok) {
      setTitle("");
      setAmount(0);
      setCategory("Other");
      setCustomCategory("");
      setAmountError("");
      onSuccess?.();
    } else {
      const data = await res.json();
      alert(data.message || "Failed to add expense");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (budgets && budgets.length > 0 && !selectedBudgetId) {
      const firstBudget = budgets[0];
      setSelectedBudgetId(firstBudget.id);
      setMonth(firstBudget.month);
      setYear(firstBudget.year);
    }
  }, [budgets]);

  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto space-y-4"
    >
      <h2 className="text-2xl font-semibold text-gray-800">{t("title")}</h2>

      {/* Budget Select */}
      <div className="flex flex-col">
        <label className="mb-1 text-gray-600 font-medium">
          {t("selectBudget")}
        </label>
        <select
          value={selectedBudgetId ?? ""}
          onChange={(e) => handleBudgetChange(Number(e.target.value))}
          required
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="" disabled>
            {t("selectBudget")}
          </option>
          {budgets?.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} — ৳{b.amount} ({MONTH_NAMES[b.month - 1]} {b.year})
            </option>
          ))}
        </select>
      </div>

      {/* Month & Year */}
      {selectedBudget && (
        <div className="flex space-x-4">
          <div className="flex-1 flex flex-col">
            <label className="mb-1 text-gray-600 font-medium">
              {t("month")}
            </label>
            <input
              type="text"
              value={MONTH_NAMES[month - 1]}
              readOnly
              className="border border-gray-200 bg-gray-50 p-3 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="mb-1 text-gray-600 font-medium">
              {t("year")}
            </label>
            <input
              type="text"
              value={year}
              readOnly
              className="border border-gray-200 bg-gray-50 p-3 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>
      )}

      {/* Category */}
      <div className="flex flex-col">
        <label className="mb-1 text-gray-600 font-medium">
          {t("category")}
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {tb(`categories.${c}`)}
            </option>
          ))}
          <option value="Custom">{tb("categories.Custom")}</option>
        </select>
      </div>

      {/* Custom Category */}
      {category === "Custom" && (
        <div className="flex flex-col">
          <label className="mb-1 text-gray-600 font-medium">
            {t("category")}
          </label>
          <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder={t("category")}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      )}

      {/* Expense Title */}
      <div className="flex flex-col">
        <label className="mb-1 text-gray-600 font-medium">
          {t("expenseTitle")}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("expenseTitle")}
          required
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Amount */}
      <div className="flex flex-col">
        <label className="mb-1 text-gray-600 font-medium">
          {t("amount")}
          {selectedBudget && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              (Budget limit: ৳{selectedBudget.amount})
            </span>
          )}
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => handleAmountChange(Number(e.target.value))}
          placeholder={t("amount")}
          required
          min={1}
          max={selectedBudget?.amount}
          className={`border p-3 rounded-lg focus:ring-2 focus:outline-none ${
            amountError
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-blue-400"
          }`}
        />
        {amountError && (
          <p className="mt-1 text-sm text-red-500">{amountError}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !!amountError || amount <= 0}
        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? t("saving") : t("addExpense")}
      </button>
    </form>
  );
}
