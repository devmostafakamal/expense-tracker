"use client";

import TransactionHistory from "@/components/custom/TransactionHistroy";
import { useEffect, useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiArrowRight,
  FiDollarSign,
  FiCreditCard,
  FiSmartphone,
} from "react-icons/fi";
import { toast } from "sonner";

interface Account {
  id: number;
  name: string;
  type: string;
  balance: number;
  currency: string;
}

interface Income {
  id: number;
  title: string;
  amount: number;
  category: string;
  month: number;
  year: number;
  accountId: number;
}

const ACCOUNT_TYPES = [
  { value: "cash", label: "Cash", icon: <FiDollarSign /> },
  { value: "bank", label: "Bank Account", icon: <FiCreditCard /> },
  { value: "mobile_banking", label: "Mobile Banking", icon: <FiSmartphone /> },
];

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Other",
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getAccountIcon(type: string) {
  if (type === "bank") return <FiCreditCard className="text-blue-500" />;
  if (type === "mobile_banking")
    return <FiSmartphone className="text-green-500" />;
  return <FiDollarSign className="text-yellow-500" />;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transfers, setTransfers] = useState<any[]>([]);

  // Account form
  const [accountForm, setAccountForm] = useState({
    name: "",
    type: "cash",
    balance: 0,
    currency: "BDT",
  });

  // Income form
  const [incomeForm, setIncomeForm] = useState({
    title: "",
    amount: 0,
    category: "Salary",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    accountId: 0,
  });

  // Transfer form
  const [transferForm, setTransferForm] = useState({
    fromAccountId: 0,
    toAccountId: 0,
    amount: 0,
    note: "",
  });

  const fetchAll = async () => {
    const [accRes, incRes, tranRes] = await Promise.all([
      fetch("/api/accounts"),
      fetch("/api/income"),
      fetch("/api/transfers"),
    ]);
    const accData = await accRes.json();
    const incData = await incRes.json();
    const tranData = await tranRes.json();
    if (accData.success) setAccounts(accData.data);
    if (incData.success) setIncomes(incData.data);
    if (tranData.success) setTransfers(tranData.data);
    setLoading(false);
  };
  //   const fetchAll = async () => {
  //     const [accRes, incRes, ] = await Promise.all([
  //       fetch("/api/accounts"),
  //       fetch("/api/income"),
  //        // ← যোগ করো
  //     ]);
  //     const accData = await accRes.json();
  //     const incData = await incRes.json();

  //     if (accData.success) setAccounts(accData.data);
  //     if (incData.success) setIncomes(incData.data);
  //     // ← যোগ করো
  //     setLoading(false);
  //   };

  useEffect(() => {
    fetchAll();
  }, []);
  useEffect(() => {
    if (accounts.length > 0 && incomeForm.accountId === 0) {
      setIncomeForm((prev) => ({ ...prev, accountId: accounts[0].id }));
    }
  }, [accounts]);

  // Summary
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accountForm),
    });
    const data = await res.json();
    if (data.success) {
      setAccounts((prev) => [...prev, data.data]);
      setShowAccountForm(false);
      setAccountForm({ name: "", type: "cash", balance: 0, currency: "BDT" });
      toast.success("Account created!");
    }
  };

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("incomeForm:", incomeForm);
    const res = await fetch("/api/income", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(incomeForm),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Income added!");
      setShowIncomeForm(false);
      fetchAll();
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("transferForm:", transferForm);
    const res = await fetch("/api/transfers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transferForm),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Transfer successful!");
      setShowTransferForm(false);
      fetchAll();
    } else {
      toast.error(data.message || "Transfer failed");
    }
  };

  const handleDeleteAccount = async (id: number) => {
    await fetch("/api/accounts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    toast.success("Account deleted");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 animate-pulse">Loading accounts...</p>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your money across all accounts
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowTransferForm(true)}
            className="flex items-center gap-2 border border-indigo-200 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-50 transition"
          >
            <FiArrowRight size={14} /> Transfer
          </button>
          <button
            onClick={() => setShowIncomeForm(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition"
          >
            <FiPlus size={14} /> Add Income
          </button>
          <button
            onClick={() => setShowAccountForm(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition"
          >
            <FiPlus size={14} /> New Account
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Total Balance</p>
          <p className="text-2xl font-bold text-indigo-600">
            ৳{totalBalance.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Total Income</p>
          <p className="text-2xl font-bold text-green-600">
            ৳{totalIncome.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Accounts Grid */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          My Accounts
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-gray-400">
              <FiCreditCard size={36} className="mx-auto mb-3 opacity-30" />
              <p>No accounts yet. Add your first account!</p>
            </div>
          ) : (
            accounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-white rounded-2xl p-5 border shadow-sm space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getAccountIcon(acc.type)}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {acc.name}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {acc.type.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAccount(acc.id)}
                    className="text-gray-300 hover:text-red-500 transition"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ৳{acc.balance.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">{acc.currency}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Income */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Recent Income
        </h2>
        <div className="bg-white rounded-xl border shadow-sm divide-y">
          {incomes.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No income recorded yet
            </div>
          ) : (
            incomes.slice(0, 5).map((inc) => (
              <div
                key={inc.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {inc.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {inc.category} • {MONTHS[inc.month - 1]} {inc.year}
                  </p>
                </div>
                <p className="text-sm font-bold text-green-600">
                  +৳{inc.amount.toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
        <div className="mt-4">
          <TransactionHistory
            incomes={incomes}
            transfers={transfers}
            accounts={accounts}
          />
        </div>
      </div>

      {/* Account Form Modal */}
      {showAccountForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-4">Add Account</h2>
            <form onSubmit={handleCreateAccount} className="space-y-3">
              <input
                type="text"
                placeholder="Account name (e.g. bKash, Dutch Bangla)"
                value={accountForm.name}
                onChange={(e) =>
                  setAccountForm({ ...accountForm, name: e.target.value })
                }
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <select
                value={accountForm.type}
                onChange={(e) =>
                  setAccountForm({ ...accountForm, type: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Current balance"
                value={accountForm.balance || ""}
                onChange={(e) =>
                  setAccountForm({
                    ...accountForm,
                    balance: Number(e.target.value),
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowAccountForm(false)}
                  className="flex-1 border text-gray-600 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Income Form Modal */}
      {showIncomeForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-4">Add Income</h2>
            <form onSubmit={handleAddIncome} className="space-y-3">
              <input
                type="text"
                placeholder="Income title (e.g. Monthly Salary)"
                value={incomeForm.title}
                onChange={(e) =>
                  setIncomeForm({ ...incomeForm, title: e.target.value })
                }
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="number"
                placeholder="Amount"
                value={incomeForm.amount || ""}
                onChange={(e) =>
                  setIncomeForm({
                    ...incomeForm,
                    amount: Number(e.target.value),
                  })
                }
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <select
                value={incomeForm.category}
                onChange={(e) =>
                  setIncomeForm({ ...incomeForm, category: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {INCOME_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={incomeForm.accountId}
                onChange={(e) =>
                  setIncomeForm({
                    ...incomeForm,
                    accountId: Number(e.target.value),
                  })
                }
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value={0} disabled>
                  Select account
                </option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Month"
                  min={1}
                  max={12}
                  value={incomeForm.month}
                  onChange={(e) =>
                    setIncomeForm({
                      ...incomeForm,
                      month: Number(e.target.value),
                    })
                  }
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={incomeForm.year}
                  onChange={(e) =>
                    setIncomeForm({
                      ...incomeForm,
                      year: Number(e.target.value),
                    })
                  }
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  Add Income
                </button>
                <button
                  type="button"
                  onClick={() => setShowIncomeForm(false)}
                  className="flex-1 border text-gray-600 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Form Modal */}
      {showTransferForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-4">Transfer Money</h2>
            <form onSubmit={handleTransfer} className="space-y-3">
              <select
                value={transferForm.fromAccountId}
                onChange={(e) =>
                  setTransferForm({
                    ...transferForm,
                    fromAccountId: Number(e.target.value),
                  })
                }
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value={0} disabled>
                  From account
                </option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} — ৳{a.balance.toLocaleString()}
                  </option>
                ))}
              </select>
              <div className="flex justify-center text-gray-400">
                <FiArrowRight size={20} />
              </div>
              <select
                value={transferForm.toAccountId}
                onChange={(e) =>
                  setTransferForm({
                    ...transferForm,
                    toAccountId: Number(e.target.value),
                  })
                }
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value={0} disabled>
                  To account
                </option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} — ৳{a.balance.toLocaleString()}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={transferForm.amount || ""}
                onChange={(e) =>
                  setTransferForm({
                    ...transferForm,
                    amount: Number(e.target.value),
                  })
                }
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Note (optional)"
                value={transferForm.note}
                onChange={(e) =>
                  setTransferForm({ ...transferForm, note: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setShowTransferForm(false)}
                  className="flex-1 border text-gray-600 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
