import React from 'react';
import { HoverEffect } from './ui/card-hover-effect';
import { Wand2, Layout, Palette, Download, Code, Image } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="w-full bg-slate-50 dark:bg-black py-20 px-4">
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          A New Era of Presentation Design
        </h2>
        <p className="mt-6 text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          PowerMyPoint leverages cutting-edge AI to redefine how you create and deliver presentations.
        </p>
      </div>
      <div className="max-w-6xl mx-auto">
        <HoverEffect items={items} />
      </div>
    </section>
  );
};

const items = [
  {
    title: "AI-Powered Creation",
    description: "Generate entire presentations from a simple prompt. Our AI handles structure and content.",
    link: "#", // HoverEffect requires a link, using placeholder or could remove from type if modified
    icon: <Wand2 className="h-8 w-8 text-blue-500" />,
  },
  {
    title: "Smart Layouts",
    description: "Content automatically arranges itself. No more fighting with text boxes and alignment.",
    link: "#",
    icon: <Layout className="h-8 w-8 text-purple-500" />,
  },
  {
    title: "Sophisticated Themes",
    description: "Choose from a library of dark, light, and gradient themes that look professional instantly.",
    link: "#",
    icon: <Palette className="h-8 w-8 text-pink-500" />,
  },
  {
    title: "Instant Export",
    description: "Download your deck as a PDF, PowerPoint, or present directly from the web.",
    link: "#",
    icon: <Download className="h-8 w-8 text-orange-500" />,
  },
  {
    title: "Custom DSL Control",
    description: "For power users: Edit the underlying code to tweak every detail of your slides.",
    link: "#",
    icon: <Code className="h-8 w-8 text-emerald-500" />,
  },
  {
    title: "Visual Asset Library",
    description: "Access millions of high-quality stock photos and icons directly within the editor.",
    link: "#",
    icon: <Image className="h-8 w-8 text-cyan-500" />,
  },
];
