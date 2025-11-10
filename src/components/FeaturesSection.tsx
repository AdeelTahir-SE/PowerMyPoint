import React from 'react';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  className?: string;
}

const features: Feature[] = [
  {
    icon: 'auto_awesome',
    title: 'AI-Powered Creation',
    description: 'Generate entire presentations from a simple prompt. Our AI handles the design, layout, and content structure.',
  },
  {
    icon: 'aod',
    title: 'Interactive Elements',
    description: 'Engage your audience with live polls, Q&A sessions, and interactive charts that capture attention.',
  },
  {
    icon: 'palette',
    title: 'Sophisticated Themes',
    description: 'Choose from a library of modern, professionally designed themes that adapt to your content.',
  },
];

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ className = '' }) => {
  return (
    <section className={`w-full bg-background-light px-4 py-12 dark:bg-surface-dark sm:px-6 sm:py-16 md:py-20 lg:py-24 xl:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12 md:mb-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-light dark:text-white md:text-4xl">
            A New Era of Presentation Design
          </h2>
          <p className="mt-3 sm:mt-4 max-w-3xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 px-4">
            PowerMyPoint leverages cutting-edge AI to redefine how you create and deliver presentations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-xl border border-subtle-light/50 bg-white/50 p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/30 dark:bg-surface-dark/50 dark:border-subtle-dark/50 dark:hover:bg-surface-dark dark:hover:border-primary/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-500 text-white">
                <span className="material-symbols-outlined text-2xl sm:text-3xl">{feature.icon}</span>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <h3 className="text-base sm:text-lg font-bold text-text-light dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};