import React from 'react';
import { BentoGrid, BentoGridItem } from './ui/bento-grid';
import { Wand2, Zap, Palette, Share2, Layers, BarChart } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  return (
    <section className="w-full bg-slate-50 dark:bg-black py-20 px-4">
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          A New Era of Presentation Design
        </h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          PowerMyPoint leverages cutting-edge AI to redefine how you create and deliver presentations.
        </p>
      </div>
      <BentoGrid className="max-w-4xl mx-auto">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            icon={item.icon}
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>
    </section>
  );
};

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

const items = [
  {
    title: "AI-Powered Creation",
    description: "Generate entire presentations from a simple prompt. Our AI handles everything.",
    header: <Skeleton />,
    icon: <Wand2 className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Interactive Elements",
    description: "Engage your audience with live polls and interactive charts.",
    header: <Skeleton />,
    icon: <Zap className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Sophisticated Themes",
    description: "Choose from a library of modern, professionally designed themes.",
    header: <Skeleton />,
    icon: <Palette className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Real-time Collaboration",
    description: "Work with your team in real-time. Changes sync instantly.",
    header: <Skeleton />,
    icon: <Share2 className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Version Control",
    description: "Never lose previous versions of your work. Rollback anytime.",
    header: <Skeleton />,
    icon: <Layers className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Analytics Dashboard",
    description: "Track engagement and performance metrics for your presentations.",
    header: <Skeleton />,
    icon: <BarChart className="h-4 w-4 text-neutral-500" />,
  },
];
