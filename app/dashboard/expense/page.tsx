"use client";
import ExpenseForm from "@/components/custom/ExpenseForm";
import ExpenseList from "@/components/custom/ExpenseList";
import React, { useEffect, useState } from "react";

interface Budget {
  id: number;
  title: string;
  amount: number;
}

function ExpensePage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  // Fetch budgets function
  const fetchBudgets = async () => {
    try {
      const res = await fetch("/api/budget");
      const data = await res.json();
      if (data.success) setBudgets(data.data || []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Pass budgets to ExpenseForm */}
      <ExpenseForm budgets={budgets} onSuccess={fetchBudgets} />

      {/* You can pass budgets to ExpenseList if needed */}
      <ExpenseList />
    </div>
  );
}

export default ExpensePage;
