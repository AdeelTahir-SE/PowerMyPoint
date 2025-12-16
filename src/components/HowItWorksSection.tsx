import React from 'react';
import { StickyScroll } from './ui/sticky-scroll-reveal';
import { FileCode, Sparkles, PenTool, MonitorPlay } from 'lucide-react';

const content = [
  {
    title: '1. Describe or Import',
    description:
      "Start from scratch with a prompt, or import an existing '.pmp' DSL file. Our system parses your custom language definitions instantly, giving you full control over structure before generation even begins.",
    content: (
      <div className="h-full w-full bg-slate-900 border border-slate-700 rounded-xl p-8 flex flex-col justify-between shadow-2xl">
        <div className="flex items-start justify-between">
          <FileCode className="text-blue-500 w-12 h-12" />
          <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full font-mono">presentation.pmp</span>
        </div>
        <div className="space-y-2">
          <h4 className="text-2xl font-bold text-white">Import DSL</h4>
          <div className="font-mono text-sm text-slate-400 bg-slate-950 p-4 rounded-lg border border-slate-800">
            <p>PRESENTATION {'{'}</p>
            <p className="pl-4">title = "Strategy_2025";</p>
            <p className="pl-4">...</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: '2. AI-Powered Generation',
    description:
      "Our multimodal AI models analyze your input—whether it's text, a document, or DSL code. It generates high-fidelity slides, selects relevant stock imagery, and applies your chosen design system automatically.",
    content: (
      <div className="h-full w-full bg-slate-900 border border-slate-700 rounded-xl p-8 flex flex-col justify-between shadow-2xl">
        <div className="flex items-start justify-between">
          <Sparkles className="text-purple-500 w-12 h-12" />
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-75"></div>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-2xl font-bold text-white">Generating...</h4>
          <p className="text-slate-400">Processing layout logic, color palettes, and typography rules in real-time.</p>
        </div>
      </div>
    ),
  },
  {
    title: '3. Human-in-the-Loop Editing',
    description:
      "The result isn't static. Enter our Live Editor to tweak every detail. Edit text directly on the canvas, swap images, reorder slides, or modify the underlying DSL code to effect global changes instantly.",
    content: (
      <div className="h-full w-full bg-slate-900 border border-slate-700 rounded-xl p-8 flex flex-col justify-between shadow-2xl">
        <div className="flex items-start justify-between">
          <PenTool className="text-emerald-500 w-12 h-12" />
        </div>
        <div className="space-y-4">
          <h4 className="text-2xl font-bold text-white">Live Editor</h4>
          <div className="flex gap-2">
            <div className="h-20 w-1/3 bg-slate-800 rounded border border-slate-700"></div>
            <div className="h-20 w-1/3 bg-emerald-500/20 rounded border border-emerald-500/50 flex items-center justify-center text-emerald-300 font-bold">Edit</div>
            <div className="h-20 w-1/3 bg-slate-800 rounded border border-slate-700"></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: '4. Present & Export',
    description:
      "Deliver your presentation directly from the browser with our optimized viewer, or export to PowerPoint/PDF formats for offline use. Your deck is ready for any meeting room.",
    content: (
      <div className="h-full w-full bg-slate-900 border border-slate-700 rounded-xl p-8 flex flex-col justify-between shadow-2xl">
        <div className="flex items-start justify-between">
          <MonitorPlay className="text-orange-500 w-12 h-12" />
          <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-1 px-3 rounded transition-colors">Export</button>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-white">Ready to Present</h4>
          <p className="text-slate-400 mt-2">Compatible with PDF, PPTX, and Web.</p>
        </div>
      </div>
    ),
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="w-full bg-slate-950 py-24 relative overflow-hidden">
      {/* Subtle background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center mb-16 relative z-10 px-4">
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">How It Works</h2>
        <p className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto">
          From DSL code to stunning slides in seconds.
        </p>
      </div>
      <StickyScroll content={content} />
    </section>
  );
};
