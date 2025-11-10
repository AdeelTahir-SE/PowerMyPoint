import React from 'react';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`w-full bg-background-light px-4 py-8 sm:py-10 dark:bg-surface-dark sm:px-6 lg:px-10 ${className}`}>
      <div className="mx-auto max-w-6xl">
        {/* Top Section - Links and Social */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-center md:justify-start">
            <a
              className="text-xs sm:text-sm text-slate-600 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-xs sm:text-sm text-slate-600 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-xs sm:text-sm text-slate-600 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
              href="#"
            >
              Contact Us
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              className="text-slate-500 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
              href="#"
              aria-label="Twitter"
            >
              <svg
                fill="none"
                height="20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
                className="sm:h-6 sm:w-6"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 2.8 3.2 2.8 5.2 0 3.9-3.1 7-7 7H6c-3.9 0-7-3.1-7-7s3.1-7 7-7h1"></path>
                <path d="M16 8s-1.3-2-3-2c-1.7 0-3 2-3 2"></path>
              </svg>
            </a>
            <a
              className="text-slate-500 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
              href="#"
              aria-label="LinkedIn"
            >
              <svg
                fill="none"
                height="20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
                className="sm:h-6 sm:w-6"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect height="12" width="4" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="mt-6 sm:mt-8 border-t border-subtle-light pt-5 sm:pt-6 text-center text-xs sm:text-sm text-slate-500 dark:border-subtle-dark dark:text-slate-400">
          <p>© 2023 PowerMyPoint. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};