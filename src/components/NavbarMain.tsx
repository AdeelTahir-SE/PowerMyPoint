'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, FlaskConical, Settings } from "lucide-react";
import { useExperimentalMode } from "@/contexts/experimental-mode-context";
import { useState, useRef, useEffect } from "react";

export default function NavbarMain() {
  const pathname = usePathname();
  const router = useRouter();
  const { experimentalMode, toggleExperimentalMode } = useExperimentalMode();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

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
        
        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <User size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  router.push('/settings');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings size={18} />
                <span className="text-sm font-medium">Profile</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
