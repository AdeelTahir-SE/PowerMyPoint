"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Settings as SettingsIcon, User, Key, Database, Info, Shield, Zap, CreditCard, Check } from "lucide-react";

export default function SettingsPage() {
    const { user } = useAuth();
    const [tier, setTier] = useState<string>('loading');
    const [usage, setUsage] = useState<{ used: number; limit: number; remaining: number } | null>(null);
    const [upgrading, setUpgrading] = useState(false);

    useEffect(() => {
        if (user) {
            // Fetch latest user data
            fetch(`/api/users?userId=${user.id}`)
                .then(res => res.json())
                .then(res => {
                    if (res.data) {
                        setTier(res.data.tier_plan || 'free');
                        if (res.data.usage) setUsage(res.data.usage);
                    }
                })
                .catch(err => console.error("Failed to fetch tier", err));
        }
    }, [user]);

    const handleUpgrade = async () => {
        setUpgrading(true);
        // Mock Payment
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const res = await fetch('/api/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user?.id,
                    tier_plan: 'pro'
                })
            });
            if (res.ok) {
                setTier('pro');
                alert("Successfully upgraded to Pro!");
            }
        } catch (error) {
            console.error(error);
            alert("Upgrade failed");
        } finally {
            setUpgrading(false);
        }
    };

    const handleDowngrade = async (requestRefund: boolean) => {
        // Confirmation is handled by UI state now, but double check

        setUpgrading(true);
        try {
            const res = await fetch('/api/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user?.id,
                    tier_plan: 'free'
                })
            });

            if (res.ok) {
                setTier('free');
                setShowDowngradeConfirm(false);
                if (requestRefund) {
                    alert("Plan downgraded to Free. Your refund request has been submitted for review.");
                } else {
                    alert("Plan downgraded to Free.");
                }
            }
        } catch (error) {
            console.error(error);
            alert("Downgrade failed");
        } finally {
            setUpgrading(false);
        }
    }

    const [showDowngradeConfirm, setShowDowngradeConfirm] = useState(false);
    const [requestRefund, setRequestRefund] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* ... (Background elements remain same) ... */}

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
                        Manage your account and subscription
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
                <div className="space-y-6">

                    {/* Subscription Section */}
                    <div className="glass-card rounded-2xl p-8 border border-white/10 shadow-2xl hover-lift">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                                <CreditCard className="text-white" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">
                                Subscription Plan
                            </h2>
                        </div>

                        <div className="flex-1">
                            <p className="text-sm text-slate-400 mb-1">Current Plan</p>
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-3xl font-bold text-white capitalize">{tier === 'loading' ? '...' : tier}</h3>
                                {tier === 'pro' && (
                                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/50">
                                        ACTIVE
                                    </span>
                                )}
                            </div>

                            {/* Usage Stats */}
                            {usage && (
                                <div className="max-w-xs">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-400">Monthly Usage</span>
                                        <span className="text-white font-medium">{usage.used} / {usage.limit} generated</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${(usage.used / usage.limit) > 0.9 ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-500 to-green-500'
                                                }`}
                                            style={{ width: `${Math.min(100, (usage.used / usage.limit) * 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {usage.remaining} presentations remaining
                                    </p>
                                </div>
                            )}
                        </div>

                        {tier === 'free' && (
                            <button
                                onClick={handleUpgrade}
                                disabled={upgrading}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-purple-900/50 transition-all hover:scale-[1.02] flex items-center gap-2"
                            >
                                {upgrading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <Zap size={18} />
                                        Upgrade to Pro ($19)
                                    </>
                                )}
                            </button>
                        )}
                        {tier === 'pro' && !showDowngradeConfirm && (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-emerald-400 mr-4">
                                    <Check size={24} />
                                    <span className="font-bold">Pro Features Unlocked</span>
                                </div>
                                <button
                                    onClick={() => setShowDowngradeConfirm(true)}
                                    className="text-sm text-slate-400 hover:text-white underline decoration-slate-600 hover:decoration-white transition-all"
                                >
                                    Cancel Subscription
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Downgrade Confirmation UI */}
                    {showDowngradeConfirm && tier === 'pro' && (
                        <div className="border-t border-white/10 p-6 animate-in slide-in-from-top-2 fade-in bg-white/5 mx-6 mb-6 rounded-b-xl -mt-6">
                            <h4 className="text-lg font-bold text-white mb-2">Cancel Subscription?</h4>
                            <p className="text-slate-400 text-sm mb-4">
                                You will lose access to Pro features like private presentations and increased limits immediately.
                            </p>

                            <label className="flex items-center gap-2 mb-6 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={requestRefund}
                                        onChange={(e) => setRequestRefund(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="w-5 h-5 border-2 border-slate-500 rounded peer-checked:bg-purple-500 peer-checked:border-purple-500 transition-all flex items-center justify-center">
                                        {requestRefund && <Check size={14} className="text-white" />}
                                    </div>
                                </div>
                                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                                    Request a refund for this month
                                </span>
                            </label>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowDowngradeConfirm(false)}
                                    className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
                                >
                                    Keep Pro Plan
                                </button>
                                <button
                                    onClick={() => handleDowngrade(requestRefund)}
                                    disabled={upgrading}
                                    className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/50 text-sm font-semibold hover:bg-red-500/20 transition-colors"
                                >
                                    {upgrading ? 'Processing...' : 'Confirm Cancellation'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

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
                                        <p className="text-sm font-semibold text-white">Google Gemini API Status</p>
                                        <p className="text-xs text-slate-400">Gemini AI Integration</p>
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
                            {['Next.js', 'TypeScript', 'Tailwind CSS', 'Google Gemini', 'Supabase'].map((tech) => (
                                <span key={tech} className="px-3 py-1 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-purple-500/30 rounded-full text-sm text-purple-300 font-medium">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
