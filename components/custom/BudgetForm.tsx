"use client";

import { useState, useRef } from "react";

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

interface BudgetFormProps {
  onSuccess?: () => void;
}

export default function BudgetForm({ onSuccess }: BudgetFormProps) {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setLoading(true);

    const formData = new FormData(formRef.current);
    const finalCategory = category === "Custom" ? customCategory : category;

    const res = await fetch("/api/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // ← userId body থেকে সরিয়ে দাও, API তে Clerk থেকে নেওয়া হচ্ছে
        title: String(formData.get("title")),
        amount: Number(formData.get("amount")),
        month: Number(formData.get("month")),
        year: Number(formData.get("year")),
        category: finalCategory,
      }),
    });

    const data = await res.json();

    if (data.success && formRef.current) {
      formRef.current.reset();
      setCategory("");
      setCustomCategory("");
      if (onSuccess) onSuccess();
    }

    setLoading(false);
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 max-w-sm"
    >
      {/* Title */}
      <input
        name="title"
        placeholder="Budget Title"
        className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
        onChange={handleTitleChange}
      />

      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="" disabled>
          Select Category
        </option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
        <option value="Custom">+ Custom</option>
      </select>

      {/* Custom Category */}
      {category === "Custom" && (
        <input
          type="text"
          placeholder="Enter custom category"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          required
          className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      )}

      {/* Amount */}
      <input
        name="amount"
        placeholder="Amount"
        type="number"
        className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
      />

      {/* Month & Year */}
      <div className="flex gap-3">
        <input
          name="month"
          placeholder="Month"
          type="number"
          min={1}
          max={12}
          className="flex-1 border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <input
          name="year"
          placeholder="Year"
          type="number"
          className="flex-1 border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white p-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-gray-400"
      >
        {loading ? "Adding..." : "Add Budget"}
      </button>
    </form>
  );
}

// import React, { useState } from "react";

// interface BudgetFormProps {
//   onSuccess?: () => void;
// }

// function BudgetForm({ onSuccess }: BudgetFormProps) {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     amount: "",
//     month: "",
//     year: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };
//   console.log(formData);
//   const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
//     e.preventDefault;
//     setLoading(true);
//     const res = await fetch("/api/budget", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: "1",
//         title: formData.title,
//         amount: Number(formData.amount),
//         month: Number(formData.month),
//         year: Number(formData.year),
//       }),
//     });
//     const data = await res.json();
//     if (data.success) {
//       setFormData({ title: "", amount: "", month: "", year: "" });
//       if (onSuccess) onSuccess();
//     }

//     setLoading(false);
//   };
//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           placeholder="budget title"
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="number"
//           name="amount"
//           value={formData.amount}
//           onChange={handleChange}
//           placeholder="amount"
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="number"
//           name="month"
//           value={formData.month}
//           onChange={handleChange}
//           placeholder="month"
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="number"
//           name="year"
//           value={formData.year}
//           onChange={handleChange}
//           placeholder="year"
//           className="border p-2 rounded"
//           required
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-black text-white p-2 rounded"
//         >
//           {loading ? "Adding..." : "Add Budget"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default BudgetForm;
