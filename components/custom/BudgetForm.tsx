"use client";

import { useState, useRef } from "react";

interface BudgetFormProps {
  onSuccess?: () => void;
}

export default function BudgetForm({ onSuccess }: BudgetFormProps) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Title only text handler (no numbers allowed)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
  };

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

    if (data.success && formRef.current) {
      formRef.current.reset();
      if (onSuccess) onSuccess();
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
        onChange={handleTitleChange}
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
