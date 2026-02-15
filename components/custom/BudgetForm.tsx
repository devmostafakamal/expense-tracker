"use client";

import { useState, useRef } from "react";

interface BudgetFormProps {
  onSuccess?: () => void;
}

export default function BudgetForm({ onSuccess }: BudgetFormProps) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    setLoading(true);

    const formData = new FormData(formRef.current);

    const res = await fetch("/api/budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "1",
        title: String(formData.get("title")),
        amount: Number(formData.get("amount")),
        month: Number(formData.get("month")),
        year: Number(formData.get("year")),
      }),
    });

    const data = await res.json();
    // console.log("Inserted Budget:", data);

    if (data.success && formRef.current) {
      formRef.current.reset();
      if (onSuccess) onSuccess(); // call callback after success
    }

    setLoading(false);
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 max-w-sm"
    >
      <input
        name="title"
        placeholder="Budget Title"
        className="border p-2 rounded"
        required
      />

      <input
        name="amount"
        placeholder="Amount"
        type="number"
        className="border p-2 rounded"
        required
      />

      <input
        name="month"
        placeholder="Month"
        type="number"
        className="border p-2 rounded"
        required
      />

      <input
        name="year"
        placeholder="Year"
        type="number"
        className="border p-2 rounded"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white p-2 rounded"
      >
        {loading ? "Adding..." : "Add Budget"}
      </button>
    </form>
  );
}
