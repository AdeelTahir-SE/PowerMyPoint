'use client';

import PresentationCard from "@/components/PresentationCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Presentation } from "@/types/types";
import { useEffect, useState } from "react";
import { Sparkles, Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Page() {
    const { user } = useAuth();
    const [presentations, setPresentations] = useState<Presentation[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [error, setError] = useState('');

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
                setPresentations([result.data, ...presentations]);
                setPrompt('');
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

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 water-bg">
            {/* Animated background orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl float"></div>
            </div>

            {/* Header */}
            <div className="glass-dark border-b border-white/10 sticky top-0 z-10 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg hover-glow">
                            <Search className="text-white" size={28} />
                        </div>
                        <h1 className="text-4xl font-bold gradient-text-blue">
                            Explore Presentations
                        </h1>
                    </div>
                    <p className="text-indigo-200/80">
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
                                className="flex-1 px-6 py-4 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/5 text-white placeholder-indigo-200/50 text-lg transition-all"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {presentations.map((presentation) => (
                            <PresentationCard
                                key={presentation.presentation_id}
                                Presentation={presentation}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32">
                        <div className="glass-card rounded-2xl p-12 max-w-md mx-auto">
                            <div className="text-indigo-400/60 mb-6 float">
                                <Search size={80} className="mx-auto" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                No presentations yet
                            </h3>
                            <p className="text-indigo-200/70">
                                Create your first presentation using the form above
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
