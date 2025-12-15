import React from 'react';
import { StickyScroll } from './ui/sticky-scroll-reveal';
import Image from 'next/image';

const content = [
  {
    title: 'Input Your Idea',
    description:
      'Start with a topic, a document, or a simple outline. The more context you provide, the better the result. Our AI understands your intent and structures it into a coherent narrative.',
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Input Idea
      </div>
    ),
  },
  {
    title: 'Generate with AI',
    description:
      'Our AI analyzes your input, generates structured content, selects visuals, and applies a sleek design. Watch as your raw ideas transform into a professional presentation in seconds.',
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--pink-500),var(--indigo-500))] flex items-center justify-center text-white">
        Generic AI Processing
      </div>
    ),
  },
  {
    title: 'Refine & Present',
    description:
      'Easily customize your presentation, add interactive elements, and deliver with confidence. Export to PowerPoint or present directly from the browser.',
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        Presentation Ready
      </div>
    ),
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="w-full bg-slate-950 py-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
        <p className="text-slate-400">From idea to presentation in three simple steps.</p>
      </div>
      <StickyScroll content={content} />
    </section>
  );
};
