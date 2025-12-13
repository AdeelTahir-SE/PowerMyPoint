"use client"
import Link from 'next/link';
import React from 'react';

export const Navbar: React.FC = () => {

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-slate-200/50 bg-background-light/80 px-4 py-3 backdrop-blur-md dark:border-slate-800/50 dark:bg-background-dark/80 sm:px-6 lg:px-10">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-500 text-white shadow-md">
          <svg className="lucide lucide-presentation" fill="none" height="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 3h20"></path>
            <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"></path>
            <path d="m7 21 5-5 5 5"></path>
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">PowerMyPoint</h2>
      </div>
      <nav className="hidden items-center gap-8 md:flex">
        <a className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary" href="#">Product</a>
        <a className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary" href="#">Solutions</a>
        <a className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary" href="#">Resources</a>
        <a className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary" href="#">Pricing</a>
      </nav>
      <div className="flex items-center gap-2">
        <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-slate-800/50">
          Log In
        </Link>
        <Link href="/signup" className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-light hover:shadow-lg hover:-translate-y-px sm:block">
          Get Started Free
        </Link>
        <button className="ml-2 block md:hidden">
          <span className="material-symbols-outlined"> menu </span>
        </button>
      </div>
    </header>
  );
};