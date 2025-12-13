'use client';

import PresentationCard from "@/components/PresentationCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Presentation } from "@/types/types";
import { useEffect, useState } from "react";
import { TrendingUp, Flame, Eye, Award } from "lucide-react";

export default function TrendingsPage() {
    const [presentations, setPresentations] = useState<Presentation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTrendingPresentations();
    }, []);

    const fetchTrendingPresentations = async () => {
        try {
            const response = await fetch('/api/presentations?public=true&limit=50');
            const data = await response.json();

            // Sort by views (trending)
            const sorted = (data.data || []).sort((a: Presentation, b: Presentation) =>
                (b.views || 0) - (a.views || 0)
            );

            setPresentations(sorted);
        } catch (error) {
            console.error('Error fetching trending presentations:', error);
            setError('Failed to load trending presentations');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        setPresentations(presentations.filter(p => p?.presentation_id !== id));
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-slate-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Floating Particles */}
            {[...Array(15)].map((_, i) => (
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
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-3xl"></div>
                <div className="glass-dark border-b border-white/10 backdrop-blur-xl relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-4 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl shadow-lg animate-pulse">
                                <Flame size={36} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-white mb-2">
                                    Trending Now
                                </h1>
                                <p className="text-purple-200/80 text-lg">
                                    Discover the most popular presentations right now
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoadingSpinner size={48} text="Loading trending presentations..." />
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="glass-card rounded-2xl p-12 max-w-md mx-auto">
                            <p className="text-red-400 text-lg">{error}</p>
                        </div>
                    </div>
                ) : presentations.length > 0 ? (
                    <div>
                        {/* Stats */}
                        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card rounded-2xl p-6 border border-white/10 hover-lift">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
                                        <TrendingUp className="text-white" size={28} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 font-medium">Total Presentations</p>
                                        <p className="text-3xl font-black text-white">{presentations.length}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card rounded-2xl p-6 border border-white/10 hover-lift">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-br from-orange-600 to-pink-600 rounded-xl animate-pulse">
                                        <Flame className="text-white" size={28} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 font-medium">Most Viewed</p>
                                        <p className="text-3xl font-black text-white">
                                            {presentations[0]?.views || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card rounded-2xl p-6 border border-white/10 hover-lift">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
                                        <Eye className="text-white" size={28} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 font-medium">Total Views</p>
                                        <p className="text-3xl font-black text-white">
                                            {presentations.reduce((sum, p) => sum + (p.views || 0), 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Presentations Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {presentations.map((presentation, index) => (
                                <div key={presentation?.presentation_id} className="relative group">
                                    {/* Rank badge for top 3 */}
                                    {index < 3 && (
                                        <div className="absolute -top-3 -left-3 z-20">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-lg opacity-60"></div>
                                                <div className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shadow-2xl border-2 border-white/20">
                                                    {index === 0 && <Award className="text-white" size={24} />}
                                                    {index > 0 && (index + 1)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <PresentationCard
                                        Presentation={presentation}
                                        onDelete={handleDelete}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-32">
                        <div className="glass-card rounded-2xl p-12 max-w-md mx-auto">
                            <div className="text-purple-400/60 mb-6 float">
                                <TrendingUp size={80} className="mx-auto" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                No trending presentations yet
                            </h3>
                            <p className="text-slate-400">
                                Be the first to create a popular presentation!
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
