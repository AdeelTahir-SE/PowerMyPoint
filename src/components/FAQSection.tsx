"use client";
import React from 'react';
import { Accordion } from './ui/accordion';

export const FAQSection = () => {
  return (
    <section className="w-full bg-slate-50 dark:bg-black py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400">
            Everything you need to know about PowerMyPoint.
          </p>
        </div>
        <Accordion items={faqs} />
      </div>
    </section>
  );
};

const faqs = [
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
  {
    question: 'Can I export my presentations?',
    answer: 'Absolutely. You can export your presentations to PowerPoint (.pptx), PDF, or present directly from the browser with our built-in viewer.',
  },
];
