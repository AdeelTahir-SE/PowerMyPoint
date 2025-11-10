import React from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface HowItWorksSectionProps {
  className?: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Input Your Idea',
    description: 'Start with a topic, a document, or a simple outline. The more context you provide, the better the result.',
  },
  {
    number: 2,
    title: 'Generate with AI',
    description: 'Our AI analyzes your input, generates structured content, selects visuals, and applies a sleek design.',
  },
  {
    number: 3,
    title: 'Refine & Present',
    description: 'Easily customize your presentation, add interactive elements, and deliver with confidence.',
  },
];

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ className = '' }) => {
  return (
    <section className={`w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24 xl:py-32 ${className}`}>
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12 md:mb-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-light dark:text-white md:text-4xl">
            How It Works
          </h2>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Vertical Line - Hidden on mobile, shown on larger screens */}
          <div
            aria-hidden="true"
            className="hidden sm:block absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-purple-300 to-indigo-300 dark:from-purple-700 dark:to-indigo-700"
          ></div>

          {/* Steps */}
          <div className="relative flex flex-col gap-8 sm:gap-12 md:gap-16">
            {steps.map((step, index) => (
              <div key={index} className="relative flex items-start gap-4 sm:gap-6 lg:gap-8">
                {/* Step Number Circle */}
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500 text-white shadow-md z-10">
                  <span className="text-lg sm:text-xl font-bold">{step.number}</span>
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-1 sm:pt-2 pb-2">
                  <h3 className="text-base sm:text-lg font-bold text-text-light dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};