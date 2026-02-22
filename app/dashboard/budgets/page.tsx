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

function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showModal, setShowModal] = useState(false);
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
        <div className="grid md:grid-cols-2 gap-4">
          {budgets.length > 0 ? (
            budgets.map((b) => (
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
