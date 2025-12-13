'use client';

import { Settings as SettingsIcon, User, Key, Database, Info, Shield, Zap } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-slate-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Floating Particles */}
            {[...Array(10)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse pointer-events-none"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 3}s`,
                    }}
                />
            ))}

            {/* Header */}
            <div className="glass-dark border-b border-white/10 sticky top-0 z-10 backdrop-blur-xl relative">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                            <SettingsIcon className="text-white" size={28} />
                        </div>
                        <h1 className="text-4xl font-black text-white">
                            Settings
                        </h1>
                    </div>
                    <p className="text-slate-400">
                        Manage your account and application preferences
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
                <div className="space-y-6">
                    {/* Profile Section */}
                    <div className="glass-card rounded-2xl p-8 border border-white/10 shadow-2xl hover-lift">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
                                <User className="text-white" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">
                                Profile Settings
                            </h2>
                        </div>

                        <div className="space-y-5">
                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-bold text-white mb-2 transition-all group-focus-within:text-purple-400">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:border-purple-500 focus:bg-white/10 text-white placeholder-slate-400 transition-all duration-300 outline-none"
                                />
                            </div>

                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-bold text-white mb-2 transition-all group-focus-within:text-purple-400">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:border-purple-500 focus:bg-white/10 text-white placeholder-slate-400 transition-all duration-300 outline-none"
                                />
                            </div>

                            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02]">
                                Save Changes
                            </button>
                        </div>
                    </div>

                    {/* API Configuration */}
                    <div className="glass-card rounded-2xl p-8 border border-white/10 shadow-2xl hover-lift">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
                                <Key className="text-white" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">
                                API Configuration
                            </h2>
                        </div>

                        <div className="space-y-5">
                            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <Shield className="text-purple-400 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-sm text-purple-300 font-semibold mb-1">
                                            Security Note
                                        </p>
                                        <p className="text-sm text-purple-200/80">
                                            API keys are configured in your <code className="bg-purple-900/50 px-2 py-1 rounded text-purple-300">.env.local</code> file.
                                            See the README for setup instructions.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <Zap className="text-indigo-400" size={20} />
                                        <div>
                                            <p className="text-sm font-semibold text-white">Anthropic API Status</p>
                                            <p className="text-xs text-slate-400">Claude AI Integration</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-sm text-green-400 font-medium">Connected</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <Database className="text-purple-400" size={20} />
                                        <div>
                                            <p className="text-sm font-semibold text-white">Supabase Connection</p>
                                            <p className="text-xs text-slate-400">Database & Authentication</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-sm text-green-400 font-medium">Connected</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Database Info */}
                    <div className="glass-card rounded-2xl p-8 border border-white/10 shadow-2xl hover-lift">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
                                <Database className="text-white" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">
                                Database Information
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <p className="text-slate-300">
                                Your presentations are stored securely in Supabase. Make sure you've run the database schema setup.
                            </p>
                            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                                <p className="text-sm font-semibold text-white mb-3">Database Setup Instructions:</p>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
                                    <li>Open your Supabase project dashboard</li>
                                    <li>Navigate to SQL Editor</li>
                                    <li>Run the SQL script from <code className="bg-slate-700 px-2 py-1 rounded text-purple-300">src/database/schema.sql</code></li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    {/* About */}
                    <div className="glass-card rounded-2xl p-8 border border-white/10 shadow-2xl hover-lift">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
                                <Info className="text-white" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">
                                About PowerMyPoint
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-sm text-slate-400 mb-1">Version</p>
                                <p className="text-lg font-bold text-white">1.0.0</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-sm text-slate-400 mb-1">Status</p>
                                <p className="text-lg font-bold text-green-400">Active</p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-sm text-slate-400 mb-2">Technologies</p>
                            <div className="flex flex-wrap gap-2">
                                {['Next.js', 'TypeScript', 'Tailwind CSS', 'Claude AI', 'Supabase'].map((tech) => (
                                    <span key={tech} className="px-3 py-1 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-purple-500/30 rounded-full text-sm text-purple-300 font-medium">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
