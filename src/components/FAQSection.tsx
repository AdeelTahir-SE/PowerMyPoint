"use client"
import React, { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  className?: string;
}

const faqs: FAQ[] = [
  {
    question: 'What is PowerMyPoint?',
    answer: 'PowerMyPoint is an AI-powered platform that automates the creation of professional, interactive presentations. It uses advanced algorithms to generate slides, content, and design based on your input, saving you time and effort.',
  },
  {
    question: 'How does the AI presentation generation work?',
    answer: 'Simply provide a topic, outline, or existing document. Our AI analyzes your input, structures the content logically, selects appropriate visuals and layouts, and applies a professional design theme to generate a complete presentation in seconds.',
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes, we offer a free plan that allows you to explore the basic features of PowerMyPoint. You can generate a limited number of presentations to see how it works. For unlimited access and premium features, you can upgrade to our Premium plan.',
  },
];

export const FAQSection: React.FC<FAQSectionProps> = ({ className = '' }) => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className={`w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24 xl:py-32 ${className}`}>
      <div className="mx-auto max-w-3xl">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-light dark:text-white md:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group rounded-xl border border-subtle-light/50 bg-white/50 p-4 sm:p-5 transition-all duration-300 hover:border-primary/30 dark:bg-surface-dark/50 dark:border-subtle-dark/50 dark:hover:border-primary/50"
            >
              <button
                className="flex w-full cursor-pointer items-center justify-between text-left"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <h3 className="text-base sm:text-lg font-medium text-text-light dark:text-white pr-4">
                  {faq.question}
                </h3>
                <span
                  className={`material-symbols-outlined flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>
              
              {/* Answer - Animated */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 mt-3 sm:mt-4' : 'max-h-0'
                }`}
              >
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};