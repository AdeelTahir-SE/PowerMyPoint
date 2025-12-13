"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Compass, FileText, TrendingUp, Settings, LogOut, User, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function SideBar() {
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    const navItems = [
        { href: "/explore", icon: Compass, label: "Explore" },
        { href: "/presentations", icon: FileText, label: "My Work" },
        { href: "/trendings", icon: TrendingUp, label: "Trending" },
        { href: "/settings", icon: Settings, label: "Settings" },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <aside className="flex flex-col h-screen border-2 min-w-80 lg:w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Logo Section */}
            <div className="relative p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                        <Sparkles className="text-white" size={24} />
                    </div>
                    <div className="hidden lg:block">
                        <h1 className="text-lg font-bold text-white">PowerMyPoint</h1>
                        <p className="text-xs text-slate-400">AI Presentations</p>
                    </div>
                </div>
            </div>

            {/* Search Button */}
            <div className="relative px-4 py-4">
                <button
                    onClick={() => { console.log("open search bar like in sora") }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-xl transition-all duration-300 group"
                >
                    <Search className="text-slate-400 group-hover:text-purple-400 transition-colors" size={20} />
                    <span className="hidden lg:block text-slate-400 group-hover:text-white text-sm font-medium transition-colors">Search</span>
                </button>
            </div>

            {/* Navigation */}
            <nav className="relative flex-1 px-4 py-2 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${active
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {active && (
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-xl"></div>
                            )}
                            <Icon
                                size={20}
                                className={`relative z-10 ${active ? 'text-white' : 'group-hover:text-purple-400'} transition-colors`}
                            />
                            <span className="hidden lg:block relative z-10 text-sm font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className="relative p-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="text-white" size={16} />
                    </div>
                    <div className="hidden lg:block flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{user?.email || 'guest@example.com'}</p>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={() => signOut()}
                    className="w-full mt-2 flex items-center justify-center lg:justify-start gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
                >
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    <span className="hidden lg:block text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}