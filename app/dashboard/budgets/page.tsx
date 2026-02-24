"use client";

import React, { useState, useEffect } from "react";
import BudgetForm from "@/components/custom/BudgetForm";
import { FiPlus } from "react-icons/fi";
import BudgetCard from "@/components/custom/BudgetCard";

interface Budget {
  id: number;
  title: string;
  amount: number;
  month: number;
  year: number;
  totalSpent: number;
  remaining: number;
  percentage: number;
  status: "safe" | "warning" | "danger";
}
const MONTHS = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];
function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | "all">(
    new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number | "all">(
    new Date().getFullYear(),
  );

  // filter budgets

  const filteredBudgets = budgets.filter((b) => {
    const monthMatch =
      selectedMonth === "all" ? true : b.month === selectedMonth;
    const yearMatch = selectedYear === "all" ? true : b.year === selectedYear;
    return monthMatch && yearMatch;
  });

  // console.log(budgets);
  // fetch budgets from API
  const fetchBudgets = async () => {
    try {
      const res = await fetch("/api/budget"); // GET route
      const data = await res.json();
      // console.log(data);

      if (data.success) {
        setBudgets(data.data || []);
      }
    } catch (error) {
      console.error("Fetch budgets error:", error);
    }
  };
  // const availableYears = [...new Set(budgets.map((b) => b.year))].sort(
  //   (a, b) => b - a,
  // );
  const availableYears = [...new Set(budgets.map((b) => b.year))].sort(
    (a, b) => b - a,
  );
  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div className="min-h-screen p-4 bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Header with title + + icon */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">My Budgets</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
          >
            <FiPlus size={20} />
          </button>
        </div>
        {/* Filter Bar */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {/* Month Filter */}
          {/* <select
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">All Months</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select> */}

          {/* Year Filter */}
          {/* <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">All Years</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select> */}

          {/* Reset Button */}
          {/* {(selectedMonth !== "all" || selectedYear !== "all") && (
            <button
              onClick={() => {
                setSelectedMonth("all");
                setSelectedYear("all");
              }}
              className="text-sm text-blue-500 hover:underline px-2"
            >
              Reset
            </button>
          )} */}

          {/* Result count */}
          {/* <span className="text-sm text-gray-400 self-center ml-auto">
            {filteredBudgets.length} budget{filteredBudgets.length !== 1 ? "s" : ""}
          </span> */}
        </div>
        {/* filtering */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {/* month filter */}
          <select
            value={selectedMonth}
            onChange={(e) => {
              // console.log("Raw value:", typeof e.target.value);
              setSelectedMonth(
                e.target.value === "all" ? "all" : Number(e.target.value),
              );
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">All Months</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          {/* year filter */}
          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(
                e.target.value === "all" ? "all" : Number(e.target.value),
              )
            }
            className="border border-gray-300 rounded-lg shadow-sm px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">All Years</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {filteredBudgets.length > 0 ? (
            filteredBudgets.map((b) => (
              <BudgetCard
                key={b.id}
                title={b.title}
                amount={b.amount}
                totalSpent={b.totalSpent}
                remaining={b.remaining}
                percentage={b.percentage}
              />
            ))
          ) : (
            <p className="text-gray-500">No budgets yet</p>
          )}
        </div>

        {/* Budget List */}
        {/* <div className="space-y-2">
          {budgets.length > 0 ? (
            budgets.map((b) => (
              <div
                key={b.id}
                className="p-4 bg-white rounded shadow flex justify-between"
              >
                <span>{b.title}</span>
                <span>${b.amount}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No budgets yet</p>
          )}
        </div> */}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg"
            >
              ✕
            </button>

            <h3 className="font-bold text-lg mb-4">Add Budget</h3>

            {/* Budget Form */}
            <BudgetForm
              onSuccess={() => {
                fetchBudgets();
                setShowModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgets;
