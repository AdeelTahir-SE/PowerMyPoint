"use client";
import React from "react";
import Link from "next/link";
import { Terminal } from "lucide-react";

export const DSLShowcaseSection = () => {
    return (
        <section className="w-full bg-slate-900 py-24 px-4 border-y border-slate-800">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                {/* Left Content */}
                <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
                        Code Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Perfect Slide</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed">
                        For developers and power users, we offer the <strong>PowerMyPoint DSL</strong>.
                        Write your presentation structure in our simple, markup-based language and watch it compile into beautiful slides instantly.
                    </p>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
                        <Link href="/docs" className="flex h-14 items-center justify-center rounded-full bg-white px-8 text-lg font-bold text-slate-900 shadow-lg hover:bg-slate-100 transition-colors">
                            Read Documentation
                        </Link>
                        <Link href="/sandbox" className="flex h-14 items-center justify-center rounded-full border border-slate-600 px-8 text-lg font-bold text-white hover:bg-slate-800 transition-colors">
                            Try Sandbox
                        </Link>
                    </div>
                </div>

                {/* Right Content - Code Editor Mockup */}
                <div className="flex-1 w-full max-w-2xl relative">
                    <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 opacity-30 blur-lg"></div>
                    <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                        {/* Editor Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                                <Terminal size={12} />
                                presentation.pmp
                            </div>
                        </div>

                        {/* Editor Content */}
                        <div className="p-6 overflow-x-auto">
                            <pre className="font-mono text-sm md:text-base leading-loose">
                                <code className="block">
                                    <span className="text-pink-400">PRESENTATION</span> {'{'}
                                    <br />
                                    {'  '}<span className="text-blue-400">id</span> = <span className="text-yellow-300">"q4-review"</span>;
                                    <br />
                                    {'  '}<span className="text-blue-400">title</span> = <span className="text-yellow-300">"Q4 Business Review"</span>;
                                    <br />
                                    {'  '}<span className="text-blue-400">slides</span> = [
                                    <br />
                                    {'    '}<span className="text-pink-400">SLIDE</span> {'{'}
                                    <br />
                                    {'      '}<span className="text-purple-400">div</span> {'{'}
                                    <br />
                                    {'        '}<span className="text-blue-400">classes</span> = <span className="text-green-300">"flex flex-col items-center justify-center h-full bg-slate-900"</span>;
                                    <br />
                                    {'        '}<span className="text-blue-400">children</span> = [
                                    <br />
                                    {'          '}<span className="text-purple-400">h1</span> {'{'}
                                    <br />
                                    {'            '}<span className="text-blue-400">content</span> = <span className="text-green-300">"Q4 Highlights"</span>;
                                    <br />
                                    {'            '}<span className="text-blue-400">classes</span> = <span className="text-green-300">"text-6xl font-bold text-white mb-4"</span>;
                                    <br />
                                    {'          '}{'};'}<span className="text-slate-500"></span>
                                    <br />
                                    {'          '}<span className="text-purple-400">p</span> {'{'}
                                    <br />
                                    {'            '}<span className="text-blue-400">content</span> = <span className="text-green-300">"Exceeding expectations."</span>;
                                    <br />
                                    {'            '}<span className="text-blue-400">classes</span> = <span className="text-green-300">"text-2xl text-blue-400"</span>;
                                    <br />
                                    {'          '}{'};'}
                                    <br />
                                    {'        '}{'];'}
                                    <br />
                                    {'      '}{'};'}
                                    <br />
                                    {'    '}{'};'}
                                    <br />
                                    {'  ]};'}
                                    <br />
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
