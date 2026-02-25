"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { FiCheck, FiX, FiZap, FiShield, FiArrowRight } from "react-icons/fi";

const FREE_FEATURES = [
  { text: "Up to 5 budgets", included: true },
  { text: "Basic expense tracking", included: true },
  { text: "Monthly analytics", included: true },
  { text: "Real-time notifications", included: true },
  { text: "Savings goals (2 max)", included: true },
  { text: "PDF export", included: false },
  { text: "Multi-currency support", included: false },
  { text: "Unlimited budgets", included: false },
  { text: "AI spending insights", included: false },
  { text: "Priority support", included: false },
];

const PRO_FEATURES = [
  { text: "Unlimited budgets", included: true },
  { text: "Advanced expense tracking", included: true },
  { text: "Full analytics + charts", included: true },
  { text: "Real-time notifications", included: true },
  { text: "Unlimited savings goals", included: true },
  { text: "PDF & Excel export", included: true },
  { text: "Multi-currency support", included: true },
  { text: "AI spending insights", included: true },
  { text: "Weekly email digest", included: true },
  { text: "Priority support", included: true },
];

const FAQS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes! You can cancel your Pro subscription anytime. You'll keep Pro access until the end of your billing period.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "Yes, we offer a 14-day free trial for Pro. No credit card required to start.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, bKash, Nagad, and bank transfers.",
  },
  {
    q: "Can I switch between monthly and yearly?",
    a: "Absolutely! You can switch plans anytime from your account settings.",
  },
  {
    q: "What happens to my data if I downgrade?",
    a: "Your data is always safe. If you exceed free limits after downgrading, older records are archived but never deleted.",
  },
];

export default function PricingPage() {
  const { isSignedIn } = useUser();
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const monthlyPrice = 299;
  const yearlyPrice = Math.round(monthlyPrice * 12 * 0.7);
  const yearlyPerMonth = Math.round(yearlyPrice / 12);
  const savings = Math.round(monthlyPrice * 12 - yearlyPrice);

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-4 text-center">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-indigo-600 transition mb-8"
        >
          ← Back to home
        </Link>

        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
          <FiZap size={12} /> Simple, transparent pricing
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Choose your plan
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Start free, upgrade when you're ready. No hidden fees, no surprises.
        </p>

        {/* Monthly/Yearly Toggle */}
        <div className="mt-8 inline-flex items-center gap-3 bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setYearly(false)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              !yearly ? "bg-white shadow text-gray-900" : "text-gray-500"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              yearly ? "bg-white shadow text-gray-900" : "text-gray-500"
            }`}
          >
            Yearly
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
              Save 30%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col">
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Free
            </p>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-extrabold text-gray-900">৳0</span>
              <span className="text-gray-400 mb-1">/month</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Perfect for getting started
            </p>
          </div>

          <Link
            href={isSignedIn ? "/dashboard" : "/sign-up"}
            className="w-full text-center py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-indigo-300 hover:text-indigo-600 transition mb-8"
          >
            {isSignedIn ? "Go to Dashboard" : "Get Started Free"}
          </Link>

          <ul className="space-y-3 flex-1">
            {FREE_FEATURES.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                {f.included ? (
                  <FiCheck className="text-green-500 shrink-0" size={16} />
                ) : (
                  <FiX className="text-gray-300 shrink-0" size={16} />
                )}
                <span
                  className={f.included ? "text-gray-700" : "text-gray-400"}
                >
                  {f.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="relative bg-indigo-600 rounded-2xl p-8 flex flex-col shadow-2xl shadow-indigo-200">
          {/* Popular badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1 rounded-full shadow">
              ⭐ Most Popular
            </span>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-indigo-200 uppercase tracking-wide mb-2">
              Pro
            </p>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-extrabold text-white">
                ৳{yearly ? yearlyPerMonth : monthlyPrice}
              </span>
              <span className="text-indigo-300 mb-1">/month</span>
            </div>
            {yearly && (
              <p className="text-sm text-indigo-300 mt-1">
                ৳{yearlyPrice} billed yearly — save ৳{savings}
              </p>
            )}
            {!yearly && (
              <p className="text-sm text-indigo-300 mt-1">
                or ৳{yearlyPerMonth}/mo billed yearly
              </p>
            )}
          </div>

          <Link
            href={isSignedIn ? "/dashboard" : "/sign-up"}
            className="w-full text-center py-3 rounded-xl bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition mb-8 flex items-center justify-center gap-2"
          >
            Start 14-day Free Trial <FiArrowRight size={14} />
          </Link>

          <ul className="space-y-3 flex-1">
            {PRO_FEATURES.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <FiCheck className="text-indigo-200 shrink-0" size={16} />
                <span className="text-indigo-100">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Money-back Guarantee */}
      <div className="max-w-2xl mx-auto px-6 mb-16">
        <div className="flex items-center gap-4 bg-green-50 border border-green-100 rounded-2xl px-6 py-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
            <FiShield className="text-green-600" size={22} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              30-day money-back guarantee
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              Not satisfied? Get a full refund within 30 days — no questions
              asked.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Frequently asked questions
        </h2>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex justify-between items-center px-5 py-4 text-left"
              >
                <span className="font-medium text-gray-900 text-sm">
                  {faq.q}
                </span>
                <span
                  className={`text-gray-400 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
