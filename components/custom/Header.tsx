"use client";

import Image from "next/image";
import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/expense.png" height={40} width={40} alt="logo" />
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            Spendly
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8 text-lg text-gray-600 ">
          <a
            href="#features"
            className="hover:text-indigo-600 transition-colors"
          >
            Features
          </a>
          <a href="#how" className="hover:text-indigo-600 transition-colors">
            How it works
          </a>
          <a
            href="#pricing"
            className="hover:text-indigo-600 transition-colors"
          >
            Pricing
          </a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-lg  text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Dashboard
              </Link>
              <UserButton />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Get Started →
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
