'use client';

import PresentationCard from "@/components/PresentationCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Presentation } from "@/types/types";
import { useEffect, useState } from "react";
import { FileText, Plus, Filter, Grid3x3, List, Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function PresentationsPage() {
    const { user } = useAuth();
    const [presentations, setPresentations] = useState<Presentation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user) {
            fetchMyPresentations();
        }
    }, [user]);

    const fetchMyPresentations = async () => {
        try {
            const response = await fetch(`/api/presentations?userId=${user?.id}`);
            const data = await response.json();
            setPresentations(data.data || []);
        } catch (error) {
            console.error('Error fetching presentations:', error);
            setError('Failed to load your presentations');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        setPresentations(presentations.filter(p => p.presentation_id !== id));
    };

    const filteredPresentations = presentations.filter(p =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-slate-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Floating Particles */}
            {[...Array(12)].map((_, i) => (
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                                <FileText className="text-white" size={28} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white">
                                    My Presentations
                                </h1>
                                <p className="text-slate-400">
                                    Manage and organize your work
                                </p>
                            </div>
                        </div>

                        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02]">
                            <Plus size={20} />
                            <span className="hidden sm:inline">New Presentation</span>
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search presentations..."
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:bg-white/10 text-white placeholder-slate-400 transition-all duration-300 outline-none"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-purple-500/50 text-slate-400 hover:text-white transition-all">
                                <Filter size={20} />
                                <span className="hidden sm:inline text-sm font-medium">Filter</span>
                            </button>

                            <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <Grid3x3 size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoadingSpinner size={48} text="Loading your presentations..." />
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="glass-card rounded-2xl p-12 max-w-md mx-auto">
                            <p className="text-red-400 text-lg">{error}</p>
                        </div>
                    </div>
                ) : filteredPresentations.length > 0 ? (
                    <div>
                        {/* Stats Bar */}
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-slate-400">
                                <span className="text-white font-semibold">{filteredPresentations.length}</span> presentation{filteredPresentations.length !== 1 ? 's' : ''} found
                            </p>
                        </div>

                        {/* Presentations Grid/List */}
                        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-4'}>
                            {filteredPresentations.map((presentation) => (
                                <PresentationCard
                                    key={presentation.presentation_id}
                                    Presentation={presentation}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-32">
                        <div className="glass-card rounded-2xl p-12 max-w-md mx-auto">
                            <div className="text-purple-400/60 mb-6 float">
                                <FileText size={80} className="mx-auto" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                {searchQuery ? 'No presentations found' : 'No presentations yet'}
                            </h3>
                            <p className="text-slate-400 mb-6">
                                {searchQuery ? 'Try adjusting your search' : 'Create your first presentation to get started'}
                            </p>
                            {!searchQuery && (
                                <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02]">
                                    <Plus size={20} />
                                    Create Presentation
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}