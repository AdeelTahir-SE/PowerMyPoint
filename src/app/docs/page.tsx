"use client";
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function DocsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 md:py-20 md:px-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-sm">Documentation</h4>
                            <nav className="flex flex-col space-y-3">
                                <a href="#introduction" className="text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Introduction</a>
                                <a href="#syntax" className="text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Basic Syntax</a>
                                <a href="#structure" className="text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Structure</a>
                                <a href="#reference" className="text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Element Reference</a>
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="flex-1 prose prose-slate dark:prose-invert max-w-none">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">PowerMyPoint DSL</h1>
                        <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                            The PowerMyPoint Domain-Specific Language (DSL) is a declarative format for defining presentations.
                            It combines a C-like structure with HTML/Tailwind-inspired styling.
                        </p>

                        <hr className="my-12 border-slate-200 dark:border-slate-800" />

                        <section id="introduction" className="mb-16">
                            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Introduction</h2>
                            <p>
                                Presentations are defined as a hierarchical tree of elements. The root element is always <code>PRESENTATION</code>,
                                which contains a list of <code>SLIDE</code> objects. Each slide allows you to nest standard HTML-like elements
                                such as <code>div</code>, <code>h1</code>, <code>p</code>, and <code>img</code> to build complex layouts.
                            </p>
                        </section>

                        <section id="syntax" className="mb-16">
                            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Basic Syntax</h2>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                                <li><strong>Blocks:</strong> Elements are defined with their type name followed by curly braces <code>{`{ }`}</code>.</li>
                                <li><strong>Properties:</strong> Key-value pairs are assigned with <code>=</code> and end with a semicolon <code>;</code>.</li>
                                <li><strong>Lists:</strong> Arrays of elements (like children or slides) are enclosed in square brackets <code>[ ]</code>.</li>
                                <li><strong>Strings:</strong> All string values must be enclosed in double quotes <code>" "</code>.</li>
                            </ul>
                            <div className="mt-6 bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-xl overflow-x-auto">
                                <pre className="text-green-400 font-mono text-sm leading-relaxed">
                                    {`PRESENTATION {
  id = "doc-example";
  title = "My Presentation";
  slides = [
    SLIDE {
      div {
        classes = "p-10 bg-white text-black";
        children = [ /* ... */ ];
      };
    }
  ];
}`}
                                </pre>
                            </div>
                        </section>

                        <section id="structure" className="mb-16">
                            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Structure</h2>
                            <h3 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">The Presentation Object</h3>
                            <p>The top-level object containing global metadata.</p>
                            <table className="w-full text-left border-collapse mt-4">
                                <thead>
                                    <tr className="border-b border-slate-700">
                                        <th className="py-2 px-4 text-slate-900 dark:text-white">Property</th>
                                        <th className="py-2 px-4 text-slate-900 dark:text-white">Type</th>
                                        <th className="py-2 px-4 text-slate-900 dark:text-white">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-600 dark:text-slate-300">
                                    <tr className="border-b border-slate-800">
                                        <td className="py-2 px-4 font-mono text-blue-400">id</td>
                                        <td className="py-2 px-4">String</td>
                                        <td className="py-2 px-4">Unique identifier for the presentation.</td>
                                    </tr>
                                    <tr className="border-b border-slate-800">
                                        <td className="py-2 px-4 font-mono text-blue-400">title</td>
                                        <td className="py-2 px-4">String</td>
                                        <td className="py-2 px-4">The main title of the deck.</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 px-4 font-mono text-blue-400">slides</td>
                                        <td className="py-2 px-4">List</td>
                                        <td className="py-2 px-4">Array of SLIDE objects.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        <section id="reference" className="mb-16">
                            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Element Reference</h2>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Generic Elements (div, h1, p)</h3>
                                    <p className="mb-4">Standard container and text elements. They support nesting via `children`.</p>
                                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-sm font-mono overflow-x-auto">
                                        <span className="text-purple-400">div</span> {'{'} <br />
                                        &nbsp;&nbsp;<span className="text-blue-400">classes</span> = <span className="text-green-300">"flex flex-col gap-4"</span>; <br />
                                        &nbsp;&nbsp;<span className="text-blue-400">children</span> = [ <span className="text-slate-500">...</span> ]; <br />
                                        {'}'}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Image (img)</h3>
                                    <p className="mb-4">Renders an image from a URL.</p>
                                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-sm font-mono overflow-x-auto">
                                        <span className="text-purple-400">img</span> {'{'} <br />
                                        &nbsp;&nbsp;<span className="text-blue-400">content</span> = <span className="text-green-300">"https://example.com/image.jpg"</span>; <br />
                                        &nbsp;&nbsp;<span className="text-blue-400">classes</span> = <span className="text-green-300">"w-full h-full object-cover"</span>; <br />
                                        {'}'}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
