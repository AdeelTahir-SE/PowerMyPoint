'use client';

import PresentationCard from "@/components/PresentationCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Presentation } from "@/types/types";
import { useEffect, useState } from "react";
import { Sparkles, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function Page() {
    const { user } = useAuth();
    const router = useRouter();
    const [presentations, setPresentations] = useState<Presentation[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchPresentations();
    }, []);

    const fetchPresentations = async () => {
        try {
            const response = await fetch('/api/presentations?public=true');
            const data = await response.json();
            setPresentations(data.data || []);
        } catch (error) {
            console.error('Error fetching presentations:', error);
            setError('Failed to load presentations');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setCreating(true);
        setError('');

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    userId: user?.id
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Navigate to the newly created presentation
                const presentationId = result.data.presentation_id;
                router.push(`/presentations/${presentationId}`);
            } else {
                setError(result.error || 'Failed to generate presentation');
            }
        } catch (error) {
            console.error('Error creating presentation:', error);
            setError('Failed to generate presentation');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = (id: string) => {
        setPresentations(presentations.filter(p => p.presentation_id !== id));
    };

    // Pagination calculations
    const totalPages = Math.ceil(presentations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPresentations = presentations.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 water-bg">
            {/* Animated background orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-slate-600/5 rounded-full blur-3xl float"></div>
            </div>

            {/* Header */}
            <div className="glass-dark border-b border-white/10 sticky top-0 z-10 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg hover-glow">
                            <Search className="text-white" size={28} />
                        </div>
                        <h1 className="text-4xl font-bold gradient-text">
                            Explore Presentations
                        </h1>
                    </div>
                    <p className="text-purple-200/80">
                        Discover amazing presentations or create your own with AI
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
                {/* Create Presentation Form */}
                <div className="mb-8 glass-card rounded-2xl p-8 border border-white/20 shadow-2xl hover-lift">
                    <form onSubmit={handleCreate} className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                                <Sparkles className="text-white" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">
                                Create New Presentation
                            </h2>
                        </div>

                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe your presentation... e.g., 'Create a presentation about climate change'"
                                className="flex-1 px-6 py-4 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/5 text-white placeholder-indigo-200/50 text-lg transition-all"
                                disabled={creating}
                            />
                            <button
                                type="submit"
                                disabled={creating || !prompt.trim()}
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center gap-3 whitespace-nowrap shadow-xl hover-lift hover-glow"
                            >
                                {creating ? (
                                    <>
                                        <LoadingSpinner size={20} />
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        <span>Create</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {error && (
                            <div className="text-red-300 text-sm glass-dark px-6 py-3 rounded-xl border border-red-500/30 animate-pulse">
                                {error}
                            </div>
                        )}
                    </form>
                </div>

                {/* Presentations Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoadingSpinner size={48} text="Loading presentations..." />
                    </div>
                ) : presentations.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentPresentations.map((presentation) => (
                                <PresentationCard
                                    key={presentation.presentation_id}
                                    Presentation={presentation}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-3 glass-card border border-white/20 rounded-xl hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover-lift"
                                >
                                    <ChevronLeft className="text-white" size={20} />
                                </button>

                                {[...Array(totalPages)].map((_, index) => {
                                    const page = index + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`px-5 py-3 rounded-xl font-semibold transition-all hover-lift ${
                                                currentPage === page
                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl'
                                                    : 'glass-card border border-white/20 text-purple-200 hover:bg-white/10'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-3 glass-card border border-white/20 rounded-xl hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover-lift"
                                >
                                    <ChevronRight className="text-white" size={20} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-32">
                        <div className="glass-card rounded-2xl p-12 max-w-md mx-auto">
                            <div className="text-purple-400/60 mb-6 float">
                                <Search size={80} className="mx-auto" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                No presentations yet
                            </h3>
                            <p className="text-purple-200/70">
                                Create your first presentation using the form above
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}