"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const STATS = [
  { value: "10K+", label: "Active Users" },
  { value: "৳2M+", label: "Money Saved" },
  { value: "99%", label: "Satisfaction" },
];

const FEATURES = [
  {
    icon: "📊",
    title: "Smart Analytics",
    desc: "Visual charts to track spending patterns across categories.",
  },
  {
    icon: "🔔",
    title: "Real-time Alerts",
    desc: "Get notified instantly when you're close to your budget limit.",
  },
  {
    icon: "🗂️",
    title: "Category Budgets",
    desc: "Set budgets for Food, Travel, Rent and more — all in one place.",
  },
  {
    icon: "📅",
    title: "Monthly Reports",
    desc: "Filter and review your expenses month by month, year by year.",
  },
];

function Hero() {
  const { isSignedIn } = useUser();

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-indigo-50 to-white">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              Smart Expense Tracker — Free to use
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Take Control of{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-indigo-600">
                  Your Money
                </span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-indigo-100 rounded z-0" />
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
              Set budgets, track spending by category, and get real-time alerts
              before you overspend. Financial clarity starts here.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={isSignedIn ? "/dashboard" : "/sign-up"}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5"
              >
                {isSignedIn ? "Go to Dashboard" : "Start for Free"} →
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold px-8 py-3.5 rounded-full border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all"
              >
                See Features
              </a>
            </div>

            {/* Stats */}
            <div className="mt-14 flex justify-center gap-10 flex-wrap">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-extrabold text-gray-900">
                    {s.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Image */}
          <div className="mt-16 relative mx-auto max-w-4xl">
            <div className="absolute inset-0 bg-linear-to-t from-indigo-50 to-transparent rounded-2xl" />
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
              <Image
                src="/origina.webp"
                width={1200}
                height={700}
                alt="dashboard preview"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need to manage money
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
              Powerful features designed to give you full financial visibility.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-indigo-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-14">
            Get started in 3 simple steps
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                desc: "Sign up for free in seconds with your email.",
              },
              {
                step: "02",
                title: "Set Budgets",
                desc: "Add budgets for each category like Food, Rent, Travel.",
              },
              {
                step: "03",
                title: "Track & Save",
                desc: "Monitor spending and get alerts before overspending.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-sm mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to take control?
          </h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Join thousands of people managing their money smarter.
          </p>
          <Link
            href={isSignedIn ? "/dashboard" : "/sign-up"}
            className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-8 py-3.5 rounded-full hover:bg-indigo-50 transition-all shadow-lg"
          >
            {isSignedIn ? "Go to Dashboard" : "Get Started Free"} →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>
          © {new Date().getFullYear()} Spendly. Built with ❤️ for better
          finances.
        </p>
      </footer>
    </main>
  );
}

export default Hero;
