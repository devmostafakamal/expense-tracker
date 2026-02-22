"use client";
import { useEffect, useState } from "react";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/expense")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setExpenses(data);
        else if (data?.data) setExpenses(data.data);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Expenses</h2>

      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center py-6 bg-white rounded shadow">
          No expenses added yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {expenses.map((exp) => (
            <li
              key={exp.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition flex justify-between items-center"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <span className="font-medium text-gray-800">{exp.title}</span>
                <span className="text-gray-500 text-sm">
                  {exp.month}/{exp.year}
                </span>
              </div>
              <span className="font-semibold text-blue-600">${exp.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
