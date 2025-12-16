"use client";
import React from "react";
import { BackgroundGradient } from "./ui/background-gradient";
import { CheckCircle2 } from "lucide-react";

export const PricingSection = () => {
  return (
    <section id="pricing" className="w-full bg-slate-950 py-20 px-4">
      <div className="max-w-5xl mx-auto px-8">
        <h2 className="text-5xl md:text-7xl font-bold text-center mb-10 text-white">
          Simple, Transparent Pricing
        </h2>
        <p className="text-center text-xl md:text-2xl text-slate-400 mb-20 max-w-2xl mx-auto">
          Choose the plan that's right for you. No hidden fees.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900 h-full">
            <div className="flex flex-col h-full">
              <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                Free Plan
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Perfect for getting started with AI presentations.
              </p>
              <p className="text-4xl font-bold text-black dark:text-white mt-6 mb-6">
                $0 <span className="text-base font-normal text-neutral-600 dark:text-neutral-400">/month</span>
              </p>
              <div className="flex-1">
                <ul className="space-y-4 mb-8">
                  {['Basic features', 'Limited templates', 'Standard support'].map((feature) => (
                    <li key={feature} className="flex items-center text-neutral-600 dark:text-neutral-300">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="rounded-full px-4 py-2 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800">
                <span>Get Started Free</span>
              </button>
            </div>
          </BackgroundGradient>

          <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900 h-full">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mt-4 mb-2">
                <p className="text-base sm:text-xl text-black dark:text-neutral-200">
                  Premium Plan
                </p>
                <span className="bg-zinc-700 text-white text-xs px-2 py-1 rounded-full">Most Popular</span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Unlocked full potential with unlimited access.
              </p>
              <p className="text-4xl font-bold text-black dark:text-white mt-6 mb-6">
                $19 <span className="text-base font-normal text-neutral-600 dark:text-neutral-400">/month</span>
              </p>
              <div className="flex-1">
                <ul className="space-y-4 mb-8">
                  {['All features', 'Unlimited templates', 'Priority support', 'Custom branding', 'Analytics'].map((feature) => (
                    <li key={feature} className="flex items-center text-neutral-600 dark:text-neutral-300">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="rounded-full px-4 py-2 text-white flex items-center space-x-1 bg-gradient-to-br from-indigo-500 to-purple-500 mt-4 text-xs font-bold shadow-lg shadow-indigo-500/20">
                <span>Upgrade Now</span>
              </button>
            </div>
          </BackgroundGradient>
        </div>
      </div>
    </section>
  );
};
