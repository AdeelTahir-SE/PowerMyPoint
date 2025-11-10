import React from 'react';

interface PricingPlan {
  name: string;
  price: number;
  period: string;
  features: string[];
  buttonText: string;
  buttonStyle: 'primary' | 'secondary';
  isFeatured?: boolean;
}

interface PricingSectionProps {
  className?: string;
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    price: 0,
    period: '/month',
    features: ['Basic features', 'Limited templates', 'Standard support'],
    buttonText: 'Get Started Free',
    buttonStyle: 'secondary',
  },
  {
    name: 'Premium',
    price: 19,
    period: '/month',
    features: ['All features', 'Unlimited templates', 'Priority support', 'Custom branding'],
    buttonText: 'Upgrade Now',
    buttonStyle: 'primary',
    isFeatured: true,
  },
];

export const PricingSection: React.FC<PricingSectionProps> = ({ className = '' }) => {
  return (
    <section className={`w-full bg-background-light px-4 py-12 dark:bg-surface-dark sm:px-6 sm:py-16 md:py-20 lg:py-24 xl:py-32 ${className}`}>
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12 md:mb-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-light dark:text-white md:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-3 sm:mt-4 max-w-3xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 px-4">
            Choose the plan that's right for you.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col gap-5 sm:gap-6 rounded-xl p-6 sm:p-8 transition-all duration-300 ${
                plan.isFeatured
                  ? 'border-2 border-primary bg-white shadow-2xl shadow-primary/20 dark:bg-surface-dark'
                  : 'border border-subtle-light/50 bg-white/50 dark:border-subtle-dark/50 dark:bg-surface-dark/50'
              }`}
            >
              {/* Featured Badge */}
              {plan.isFeatured && (
                <div className="absolute -top-3 sm:-top-4 right-6 sm:right-8 rounded-full bg-primary px-3 sm:px-4 py-1 text-xs sm:text-sm font-bold text-white">
                  Best Value
                </div>
              )}

              {/* Plan Info */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-text-light dark:text-white">
                  {plan.name}
                </h3>
                <p className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-text-light dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                    {plan.period}
                  </span>
                </p>
              </div>

              {/* CTA Button */}
              <a
                className={`inline-flex h-11 sm:h-12 w-full items-center justify-center rounded-lg px-5 sm:px-6 text-sm sm:text-base font-semibold transition-all ${
                  plan.buttonStyle === 'primary'
                    ? 'bg-primary text-white shadow-lg hover:bg-primary-light hover:shadow-xl hover:-translate-y-px'
                    : 'border border-subtle-light bg-transparent text-slate-700 shadow-sm hover:bg-slate-100 dark:border-subtle-dark dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
                href="#"
              >
                {plan.buttonText}
              </a>

              {/* Features List */}
              <ul className="space-y-2 sm:space-y-3 text-slate-600 dark:text-slate-400">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">
                      check_circle
                    </span>
                    <span className="text-sm sm:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};