'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, User, FlaskConical } from "lucide-react";
import { useExperimentalMode } from "@/contexts/experimental-mode-context";

export default function NavbarMain() {
  const pathname = usePathname();
  const { experimentalMode, toggleExperimentalMode } = useExperimentalMode();

  // Extract page name from pathname
  const getPageName = () => {
    if (pathname === '/explore') return 'Explore';
    if (pathname === '/trendings') return 'Trending';
    if (pathname === '/settings') return 'Settings';
    if (pathname?.startsWith('/presentations')) return 'Presentation';
    return 'Dashboard';
  };

  return (
    <header className="flex flex-row items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {getPageName()}
      </h1>
      <div className="flex flex-row items-center gap-4">
        <button
          onClick={toggleExperimentalMode}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            experimentalMode
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          title="Toggle Experimental Mode (Reveal.js)"
        >
          <FlaskConical size={18} />
          <span className="text-sm font-medium">Experimental</span>
        </button>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative">
          <Bell size={20} className="text-gray-600 dark:text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <Link href="/settings" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
          <User size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
      </div>
    </header>
  );
}
