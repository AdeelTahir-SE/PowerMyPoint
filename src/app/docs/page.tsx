"use client";
import React from 'react';
import { Book, Code, FileText, Layout } from 'lucide-react';

// Mock components since we don't have the actual ones
const Navbar = () => (
  <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
    <div className="max-w-7xl mx-auto px-4 py-4">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">PowerMyPoint</h1>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8">
    <div className="max-w-7xl mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
      <p>© 2024 PowerMyPoint. All rights reserved.</p>
    </div>
  </footer>
);

export default function DocsPage() {
    const [activeSection, setActiveSection] = React.useState('introduction');

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950">
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 md:py-20 md:px-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-6">
                                <Book className="w-5 h-5 text-blue-500" />
                                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">Documentation</h4>
                            </div>
                            <nav className="flex flex-col space-y-2">
                                {[
                                    { id: 'introduction', label: 'Introduction', icon: FileText },
                                    { id: 'syntax', label: 'Basic Syntax', icon: Code },
                                    { id: 'structure', label: 'Structure', icon: Layout },
                                    { id: 'reference', label: 'Element Reference', icon: Book }
                                ].map(({ id, label, icon: Icon }) => (
                                    <a
                                        key={id}
                                        href={`#${id}`}
                                        onClick={() => setActiveSection(id)}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                                            activeSection === id
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-500 dark:hover:text-blue-400'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="font-medium">{label}</span>
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 md:p-12">
                            {/* Header */}
                            <div className="mb-12">
                                <div className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
                                    DSL Reference
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    PowerMyPoint DSL
                                </h1>
                                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                                    The PowerMyPoint Domain-Specific Language (DSL) is a declarative format for defining presentations.
                                    It combines a C-like structure with HTML/Tailwind-inspired styling.
                                </p>
                            </div>

                            <hr className="my-12 border-slate-200 dark:border-slate-700" />

                            {/* Introduction */}
                            <section id="introduction" className="mb-16 scroll-mt-24">
                                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    Introduction
                                </h2>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                        Presentations are defined as a hierarchical tree of elements. The root element is always <code className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm font-mono text-blue-600 dark:text-blue-400">PRESENTATION</code>,
                                        which contains a list of <code className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm font-mono text-blue-600 dark:text-blue-400">SLIDE</code> objects. Each slide allows you to nest standard HTML-like elements
                                        such as <code className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm font-mono text-blue-600 dark:text-blue-400">div</code>, <code className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm font-mono text-blue-600 dark:text-blue-400">h1</code>, <code className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm font-mono text-blue-600 dark:text-blue-400">p</code>, and <code className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm font-mono text-blue-600 dark:text-blue-400">img</code> to build complex layouts.
                                    </p>
                                </div>
                            </section>

                            {/* Basic Syntax */}
                            <section id="syntax" className="mb-16 scroll-mt-24">
                                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                        <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    Basic Syntax
                                </h2>
                                <div className="space-y-4 mb-6">
                                    {[
                                        { title: 'Blocks', desc: 'Elements are defined with their type name followed by curly braces', code: '{ }' },
                                        { title: 'Properties', desc: 'Key-value pairs are assigned with = and end with a semicolon', code: ';' },
                                        { title: 'Lists', desc: 'Arrays of elements are enclosed in square brackets', code: '[ ]' },
                                        { title: 'Strings', desc: 'All string values must be enclosed in double quotes', code: '" "' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc} <code className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono text-blue-600 dark:text-blue-400">{item.code}</code></p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 bg-slate-900 rounded-xl p-6 border border-slate-700 shadow-2xl overflow-x-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Example</span>
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        </div>
                                    </div>
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

                            {/* Structure */}
                            <section id="structure" className="mb-16 scroll-mt-24">
                                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <Layout className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    Structure
                                </h2>
                                <h3 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">The Presentation Object</h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-6">The top-level object containing global metadata.</p>
                                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-100 dark:bg-slate-800">
                                                <th className="py-4 px-6 text-slate-900 dark:text-white font-bold">Property</th>
                                                <th className="py-4 px-6 text-slate-900 dark:text-white font-bold">Type</th>
                                                <th className="py-4 px-6 text-slate-900 dark:text-white font-bold">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900">
                                            <tr className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-4 px-6 font-mono text-sm text-blue-500 dark:text-blue-400 font-semibold">id</td>
                                                <td className="py-4 px-6"><span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-sm font-medium">String</span></td>
                                                <td className="py-4 px-6">Unique identifier for the presentation.</td>
                                            </tr>
                                            <tr className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-4 px-6 font-mono text-sm text-blue-500 dark:text-blue-400 font-semibold">title</td>
                                                <td className="py-4 px-6"><span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-sm font-medium">String</span></td>
                                                <td className="py-4 px-6">The main title of the deck.</td>
                                            </tr>
                                            <tr className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-4 px-6 font-mono text-sm text-blue-500 dark:text-blue-400 font-semibold">slides</td>
                                                <td className="py-4 px-6"><span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-sm font-medium">List</span></td>
                                                <td className="py-4 px-6">Array of SLIDE objects.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Element Reference */}
                            <section id="reference" className="mb-8 scroll-mt-24">
                                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                        <Book className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    Element Reference
                                </h2>

                                <div className="space-y-6">
                                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Generic Elements (div, h1, p)</h3>
                                        <p className="text-slate-700 dark:text-slate-300 mb-4">Standard container and text elements. They support nesting via <code className="px-2 py-1 bg-white dark:bg-slate-800 rounded text-sm font-mono text-blue-600 dark:text-blue-400">children</code>.</p>
                                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-sm font-mono overflow-x-auto">
                                            <span className="text-purple-400">div</span> {'{'} <br />
                                            &nbsp;&nbsp;<span className="text-blue-400">classes</span> = <span className="text-green-300">"flex flex-col gap-4"</span>; <br />
                                            &nbsp;&nbsp;<span className="text-blue-400">children</span> = [ <span className="text-slate-500">...</span> ]; <br />
                                            {'}'}
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Image (img)</h3>
                                        <p className="text-slate-700 dark:text-slate-300 mb-4">Renders an image from a URL.</p>
                                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-sm font-mono overflow-x-auto">
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
                </div>
            </main>
            <Footer />
        </div>
    );
}