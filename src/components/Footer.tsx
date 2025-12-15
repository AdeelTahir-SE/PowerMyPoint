import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 pt-20 pb-10 px-4 border-t border-slate-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10 mb-20">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-white">PowerMyPoint</h3>
          <p className="text-slate-400 text-sm max-w-xs">
            AI-powered presentation generator. Turn ideas into stunning slides in seconds.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold">Product</h4>
            <Link href="#" className="text-slate-400 hover:text-white text-sm">Features</Link>
            <Link href="#" className="text-slate-400 hover:text-white text-sm">Pricing</Link>
            <Link href="#" className="text-slate-400 hover:text-white text-sm">Templates</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold">Company</h4>
            <Link href="#" className="text-slate-400 hover:text-white text-sm">About</Link>
            <Link href="#" className="text-slate-400 hover:text-white text-sm">Blog</Link>
            <Link href="#" className="text-slate-400 hover:text-white text-sm">Careers</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold">Legal</h4>
            <Link href="#" className="text-slate-400 hover:text-white text-sm">Privacy</Link>
            <Link href="#" className="text-slate-400 hover:text-white text-sm">Terms</Link>
          </div>
        </div>
      </div>

      <div className="w-full relative">
        <h1 className="text-[12vw] sm:text-[13vw] font-bold text-slate-800/50 text-center leading-none select-none pointer-events-none">
          POWERMYPOINT
        </h1>
        <div className="absolute bottom-4 w-full text-center">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} PowerMyPoint. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
