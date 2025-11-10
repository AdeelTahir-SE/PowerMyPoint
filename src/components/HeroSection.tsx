import React from 'react';

interface HeroSectionProps {
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className = '' }) => {
  return (
<section className="w-full px-4 py-20 sm:px-6 md:py-28 lg:py-40">
<div className="mx-auto max-w-6xl">
<div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
<div className="flex flex-col gap-6 text-center lg:text-left">
<h1 className="text-4xl font-extrabold tracking-tighter text-text-light dark:text-white sm:text-5xl md:text-6xl">
                            Create <span className="gradient-text">Stunning Presentations</span>, Instantly.
                        </h1>
<p className="max-w-xl text-lg text-slate-600 dark:text-slate-400">
                            Our AI-powered platform designs compelling, interactive presentations in seconds. Unleash your ideas, effortlessly.
                        </p>
<div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
<a className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-white shadow-lg transition-all hover:bg-primary-light hover:shadow-xl hover:-translate-y-px" href="#">Get Started Free</a>
<a className="inline-flex h-12 items-center justify-center rounded-lg border border-subtle-light bg-transparent px-6 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-subtle-dark dark:text-slate-300 dark:hover:bg-surface-dark" href="#">Try Demo</a>
</div>
</div>
<div className="w-full relative">
<div className="absolute -inset-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl opacity-20 blur-2xl"></div>
<div className="aspect-video w-full rounded-xl bg-cover bg-center shadow-2xl shadow-slate-900/10" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAyVvECe8aDEBr4D6g7m5MZ7M6CLwqOOV_QNamvfBiZYAzCRLvM1PVPQ36y3DsWM2cIjJQwU60bw_DBBSB6nTmjIoaxmRKgpmq0rlBNcNBwxioEHWt8Y9HNJ6kBZ5fLJk2BoLoJsrzB8ceFQhOxkoxCehmb7c9KxrREQdwVziqlAwidHSw5zA24hGEqdifJ5RYyHqj87nhfVlWy-ZXruBCwFbmqFzef8coqqrUXDvIdTQrNhjz9u2fNB2FMuJyOZNnAV6tFQYJ51N6V')"}}></div>
</div>
</div>
</div>
</section>
  );
};