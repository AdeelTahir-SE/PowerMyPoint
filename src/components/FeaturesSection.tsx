import React from 'react';
import { LayoutGrid } from './ui/layout-grid';

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="w-full bg-slate-50 dark:bg-black py-20 px-4 h-full">
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          A New Era of Presentation Design
        </h2>
        <p className="mt-6 text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          PowerMyPoint leverages cutting-edge AI to redefine how you create and deliver presentations.
        </p>
      </div>
      <div className="h-screen py-20 w-full">
        <LayoutGrid cards={cards} />
      </div>
    </section>
  );
};

const SkeletonOne = () => {
  return (
    <div>
      <p className="font-bold text-4xl text-white">AI-Powered Creation</p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Generate entire presentations from a simple prompt. Our AI handles the heavy lifting:
      </p>
      <ul className="list-disc list-inside text-neutral-200 space-y-2">
        <li>Context-aware content generation</li>
        <li>Automatic data visualization</li>
        <li>Intelligent image curation</li>
      </ul>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="font-bold text-4xl text-white">Smart Layouts</p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Content automatically arranges itself based on visual hierarchy.
      </p>
      <ul className="list-disc list-inside text-neutral-200 space-y-2">
        <li>Auto-resizing text blocks</li>
        <li>Grid-based alignment</li>
        <li>Responsive slide adaptation</li>
      </ul>
    </div>
  );
};
const SkeletonThree = () => {
  return (
    <div>
      <p className="font-bold text-4xl text-white">Sophisticated Themes</p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Professional aesthetics at your fingertips.
      </p>
      <ul className="list-disc list-inside text-neutral-200 space-y-2">
        <li>Dark & Light mode support</li>
        <li>Custom typography systems</li>
        <li>Brand color usage</li>
      </ul>
    </div>
  );
};
const SkeletonFour = () => {
  return (
    <div>
      <p className="font-bold text-4xl text-white">Instant Export</p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Your slides, ready for the world in any format.
      </p>
      <ul className="list-disc list-inside text-neutral-200 space-y-2">
        <li>Export to editable PowerPoint (.pptx)</li>
        <li>High-resolution PDF export</li>
        <li>Live web URL sharing</li>
      </ul>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2664&auto=format&fit=crop",
    title: "AI-Powered Creation",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=3456&auto=format&fit=crop",
    title: "Smart Layouts",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    title: "Sophisticated Themes",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=3544&auto=format&fit=crop",
    title: "Instant Export",
  },
];
