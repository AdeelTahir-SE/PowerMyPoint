'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, User } from "lucide-react";

export default function NavbarMain() {
  const pathname = usePathname();

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
