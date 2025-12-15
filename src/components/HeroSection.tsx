"use client"
import React from 'react';
import { SparklesCore } from './ui/SparklesCore';
import { WavyBackground } from './ui/WavyBackground';
import Link from 'next/link';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-black w-full overflow-hidden pt-[40px]">
      <WavyBackground className="max-w-4xl mx-auto pb-40" containerClassName='min-h-[90vh]' colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]} waveWidth={50} backgroundFill="black" blur={10} speed="fast" waveOpacity={0.5}>
        <div className="flex flex-col items-center justify-center text-center px-4 md:px-6 relative z-10">
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Stunning Presentations</span>, <br /> Instantly.
          </h1>

          <p className="max-w-xl text-lg md:text-xl text-slate-300 mb-8 mt-4">
            Our AI-powered platform designs compelling, interactive presentations in seconds. Unleash your ideas, effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center animate-fade-in-up">
            <Link href="/explore" className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-8 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 hover:shadow-indigo-500/40">
              Get Started Free
            </Link>
            <button onClick={() => { }} className="inline-flex h-12 items-center justify-center rounded-full border border-slate-700 bg-slate-900/50 px-8 text-base font-semibold text-slate-300 backdrop-blur-sm transition-all hover:bg-slate-800 hover:text-white">
              Try Demo
            </button>
          </div>
        </div>
      </WavyBackground>
    </div>
  );
};
