"use client";
import { useEffect, useState } from "react";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/expense")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setExpenses(data);
        else if (data?.data) setExpenses(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const getMonthName = (month: number) => {
    return new Date(0, month - 1).toLocaleString("en-US", {
      month: "short",
    });
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">
        Expense List
      </h2>

      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading expenses...
        </div>
      )}

      {!loading && expenses.length === 0 && (
        <div className="bg-white border border-dashed border-gray-300 p-10 rounded-2xl text-center shadow-sm">
          <p className="text-gray-500 text-lg">No expenses added yet.</p>
        </div>
      )}

      {!loading && expenses.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {expenses.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between"
            >
              {/* Top Section */}
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {exp.title}
                  </h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    {getMonthName(exp.month)} {exp.year}
                  </span>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-400">Amount</p>
                  <p className="text-2xl font-bold text-indigo-600 mt-1">
                    {exp.amount}
                  </p>
                </div>
              </div>

              {/* Bottom subtle divider */}
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400">
                Expense ID: {exp.id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
