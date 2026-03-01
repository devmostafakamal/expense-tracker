"use client";

import { FiArrowRight, FiArrowDown } from "react-icons/fi";

interface Income {
  id: number;
  title: string;
  amount: number;
  category: string;
  month: number;
  year: number;
  accountId: number;
}

interface Transfer {
  id: number;
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  note: string | null;
  createdAt: string;
}

interface Account {
  id: number;
  name: string;
}

interface Props {
  incomes: Income[];
  transfers: Transfer[];
  accounts: Account[];
}

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

type Transaction =
  | { kind: "income"; data: Income }
  | { kind: "transfer"; data: Transfer };

export default function TransactionHistory({
  incomes,
  transfers,
  accounts,
}: Props) {
  // সব transactions একসাথে sort করো
  const all: Transaction[] = [
    ...incomes.map((i) => ({ kind: "income" as const, data: i })),
    ...transfers.map((t) => ({ kind: "transfer" as const, data: t })),
  ];

  function getAccountName(id: number) {
    return accounts.find((a) => a.id === id)?.name ?? "Unknown";
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Transaction History
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {all.length} transactions total
          </p>
        </div>
        {all.length > 0 && (
          <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-3 py-1 rounded-full border border-indigo-100">
            All Time
          </span>
        )}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {all.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-gray-300">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <FiArrowRight size={22} />
            </div>
            <p className="text-sm font-medium text-gray-400">
              No transactions yet
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Add income or make a transfer
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {all.map((tx, i) => {
              if (tx.kind === "income") {
                const inc = tx.data;
                return (
                  <div
                    key={`inc-${inc.id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-green-50/30 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className="relative">
                        <div className="w-10 h-10 bg-linear-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-sm shadow-green-200">
                          <FiArrowDown className="text-white" size={16} />
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-100 border-2 border-white rounded-full" />
                      </div>

                      {/* Info */}
                      <div>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                          {inc.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">
                            Income
                          </span>
                          <span className="text-xs text-gray-400">
                            {inc.category}
                          </span>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-gray-400">
                            {MONTHS[inc.month - 1]} {inc.year}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">
                        +৳{inc.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-300 mt-0.5">received</p>
                    </div>
                  </div>
                );
              }

              const tr = tx.data;
              return (
                <div
                  key={`tr-${tr.id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-blue-50/30 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="relative">
                      <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-sm shadow-blue-200">
                        <FiArrowRight className="text-white" size={16} />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-100 border-2 border-white rounded-full" />
                    </div>

                    {/* Info */}
                    <div>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {getAccountName(tr.fromAccountId)}{" "}
                        <span className="text-gray-300 font-normal mx-1">
                          →
                        </span>{" "}
                        {getAccountName(tr.toAccountId)}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                          Transfer
                        </span>
                        {tr.note && (
                          <span className="text-xs text-gray-400">
                            {tr.note}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">
                      ৳{tr.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-300 mt-0.5">transferred</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
