"use client";
import React from 'react';
import { BackgroundBeams } from "./ui/background-beams";

export const CTASection = () => {
  return (
    <div className="h-[30rem] w-full rounded-md bg-slate-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-4xl md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Ready to present?
        </h1>
        <p></p>
        <p className="text-neutral-500 max-w-lg mx-auto my-4 text-sm text-center relative z-10">
          Join thousands of professionals creating stunning presentations with PowerMyPoint. Get started today and unleash your ideas.
        </p>
        <div className="flex justify-center mt-8 relative z-10">
          <a
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-base font-bold text-black shadow-lg hover:scale-105 transition-transform"
            href="/explore"
          >
            Get Started Free
          </a>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
};