import React from 'react';

interface CTASectionProps {
  className?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({ className = '' }) => {
  return (
    <section className={`w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24 xl:py-32 ${className}`}>
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl py-12 sm:py-16 px-6 sm:px-8 text-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-slate-900/10 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
          
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Ready to transform your presentations?
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-indigo-100 px-4">
              Join thousands of professionals creating stunning presentations with PowerMyPoint.
            </p>
            <div className="mt-6 sm:mt-8">
              <a
                className="inline-flex h-11 sm:h-12 items-center justify-center rounded-lg bg-white px-6 sm:px-8 text-sm sm:text-base font-bold text-primary shadow-lg transition-all hover:bg-slate-100 hover:scale-105"
                href="#"
              >
                Get Started Free
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};