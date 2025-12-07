'use client';

import { Settings as SettingsIcon, User, Key, Database, Info } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-3">
                        <SettingsIcon className="text-indigo-600 dark:text-indigo-400" size={28} />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Settings
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage your account and application preferences
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="space-y-6">
                    {/* Profile Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <User className="text-indigo-600 dark:text-indigo-400" size={24} />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Profile Settings
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* API Configuration */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Key className="text-indigo-600 dark:text-indigo-400" size={24} />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                API Configuration
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                    <strong>Note:</strong> API keys are configured in your <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">.env.local</code> file.
                                    See the README for setup instructions.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Anthropic API Status
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${process.env.ANTHROPIC_API_KEY ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {process.env.ANTHROPIC_API_KEY ? 'Connected' : 'Not configured'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Supabase Connection Status
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Connected' : 'Not configured'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Database Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Database className="text-indigo-600 dark:text-indigo-400" size={24} />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Database Information
                            </h2>
                        </div>

                        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            <p>
                                Your presentations are stored securely in Supabase. Make sure you&apos;ve run the database schema setup.
                            </p>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 font-mono text-xs">
                                <p>To set up the database:</p>
                                <ol className="list-decimal list-inside mt-2 space-y-1">
                                    <li>Open your Supabase project dashboard</li>
                                    <li>Navigate to SQL Editor</li>
                                    <li>Run the SQL script from <code>src/database/schema.sql</code></li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    {/* About */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Info className="text-indigo-600 dark:text-indigo-400" size={24} />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                About PowerMyPoint
                            </h2>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>
                                <strong>Version:</strong> 1.0.0
                            </p>
                            <p>
                                <strong>Description:</strong> AI-powered presentation generator using Claude AI and Supabase
                            </p>
                            <p>
                                <strong>Technologies:</strong> Next.js, TypeScript, Tailwind CSS, Anthropic Claude, Supabase
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
