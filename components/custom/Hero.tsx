import Image from "next/image";
import React from "react";
import Link from "next/link";

function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto w-screen max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-prose text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Manager Your Expense
            <strong className="text-indigo-600"> Control </strong>
            Your Money
          </h1>

          <p className="mt-4 text-lg font-semibold text-pretty text-gray-700 sm:text-lg/relaxed">
            Start Creating your budget and save ton of money.
          </p>

          <div className="mt-4 flex justify-center gap-4 sm:mt-6">
            <Link href={"/sign-in"}>
              <button className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700">
                Get Started
              </button>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center mt-5">
          <Image
            src={"/origina.webp"}
            width={500}
            height={700}
            alt="dashboard"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
