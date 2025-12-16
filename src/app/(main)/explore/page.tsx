/**
 * Explore Page
 * 
 * DESIGN SPECIFICATION:
 * Main discovery page for browsing and creating presentations.
 * Features:
 * - Browse public presentations with pagination
 * - Create new presentations with AI generation
 * - Real-time streaming preview during generation
 * - Search and filter capabilities
 * - Toggle between ChatGPT and Gemini for outline generation
 * 
 * ARCHITECTURE:
 * - Server-side streaming for real-time presentation generation
 * - Incremental DSL parsing and rendering
 * - Abort controller for cancellable generation
 * - Pagination for performance with large datasets
 * 
 * STYLING:
 * - Dark theme with glassmorphism
 * - Purple/indigo gradient accents
 * - Animated background orbs
 * - Responsive grid layout
 */
'use client';

import PresentationCard from "@/components/PresentationCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import StreamingPresentationPreview from "@/components/StreamingPresentationPreview";
import { Presentation } from "@/types/types";
import { useEffect, useState, useRef, useCallback } from "react";
import { Sparkles, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useExperimentalMode } from "@/contexts/experimental-mode-context";

export default function Page() {
    // AUTHENTICATION & ROUTING:
    const { user } = useAuth();
    const router = useRouter();
    const { experimentalMode } = useExperimentalMode();

    // STATE MANAGEMENT:
    // Core data state
    const [presentations, setPresentations] = useState<Presentation[]>([]);
    const [loading, setLoading] = useState(true);

    // Generation state
    const [creating, setCreating] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [error, setError] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // STREAMING STATE:
    // Real-time slide generation with incremental DSL building
    // - streamingSlides: Array of slides being built incrementally
    // - isStreaming: Flag indicating active stream
    // - showStreamingPreview: Controls preview modal visibility
    const [streamingSlides, setStreamingSlides] = useState<Array<{ slideIndex: number; partialDsl: string; isComplete: boolean }>>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [showStreamingPreview, setShowStreamingPreview] = useState(false);

    // AI MODEL SELECTION:
    // Toggle between ChatGPT (better planning) and Gemini-only
    const [useChatGPT, setUseChatGPT] = useState(true);

    // ABORT CONTROLLER:
    // Allows cancellation of in-progress generation
    const abortControllerRef = useRef<AbortController | null>(null);

    /**
     * DATA FETCHING:
     * Loads public presentations on mount and when user changes
     * 
     * API PARAMETERS:
     * - public=true: Only fetch publicly visible presentations
     * - uid: Filter by user ID if provided
     * - page=explore: Context for backend filtering
     */
    useEffect(() => {
        fetchPresentations(user?.id);
    }, [user?.id]);

    const fetchPresentations = async (userId: string | undefined) => {
        try {
            const response = await fetch(`/api/presentations?public=true&uid=${userId}&page=explore`);
            const data = await response.json();
            setPresentations(data.data || []);
        } catch (error) {
            console.error('Error fetching presentations:', error);
            setError('Failed to load presentations');
        } finally {
            setLoading(false);
        }
    };

    /**
     * PRESENTATION GENERATION HANDLER:
     * Handles AI-powered presentation creation with real-time streaming
     * 
     * STREAMING ARCHITECTURE:
     * 1. Sends prompt to /api/generate endpoint
     * 2. Receives Server-Sent Events (SSE) stream
     * 3. Parses JSON events line-by-line
     * 4. Updates UI incrementally as slides are generated
     * 5. Navigates to final presentation on completion
     * 
     * EVENT TYPES:
     * - progress: Status updates
     * - dsl:update: Incremental slide content
     * - complete: Generation finished with presentation ID
     * - error: Generation failed
     * 
     * CANCELLATION:
     * - Uses AbortController for clean cancellation
     * - Properly cleans up on abort
     */
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        console.log('🚀 [FRONTEND] Starting presentation generation');
        console.log('📝 [FRONTEND] Prompt:', prompt);
        console.log('👤 [FRONTEND] User ID:', user?.id || 'anonymous');

        setCreating(true);
        setError('');
        setStreamingSlides([]);
        setIsStreaming(true);
        setShowStreamingPreview(true);

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            console.log('📡 [FRONTEND] Sending fetch request to /api/generate');
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    userId: user?.id,
                    experimentalMode: experimentalMode,
                    useChatGPT: useChatGPT // Use ChatGPT for outline generation
                }),
                signal: abortController.signal,
            });

            console.log('📥 [FRONTEND] Response received:', {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            });

            if (!response.ok) {
                console.error('❌ [FRONTEND] Response not OK:', response.status, response.statusText);
                throw new Error('Failed to start generation');
            }

            if (!response.body) {
                console.error('❌ [FRONTEND] No response body');
                throw new Error('No response body');
            }

            console.log('✅ [FRONTEND] Response body available, starting to read stream');
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let eventCount = 0;
            let chunkCount = 0;

            while (true) {
                const { done, value } = await reader.read();
                chunkCount++;

                if (done) {
                    console.log(`🏁 [FRONTEND] Stream ended. Total chunks: ${chunkCount}, Total events: ${eventCount}`);
                    break;
                }

                const decoded = decoder.decode(value, { stream: true });
                console.log(`📦 [FRONTEND] Chunk #${chunkCount} received, length:`, decoded.length);
                buffer += decoded;
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep incomplete line in buffer

                console.log(`📄 [FRONTEND] Chunk #${chunkCount} split into ${lines.length} lines (buffer: ${buffer.length} chars)`);

                for (const line of lines) {
                    if (!line.trim()) continue;

                    try {
                        const event = JSON.parse(line);
                        eventCount++;
                        console.log(`📨 [FRONTEND] Event #${eventCount} received:`, {
                            type: event.type,
                            slideIndex: event.slideIndex,
                            elementType: event.elementType,
                            isSlideComplete: event.isSlideComplete
                        });

                        switch (event.type) {
                            case 'progress':
                                console.log('📊 [FRONTEND] Progress:', event.message);
                                break;

                            case 'dsl:update':
                                console.log(`📝 [FRONTEND] DSL update received:`, {
                                    slideIndex: event.slideIndex,
                                    dslLength: event.partialDsl?.length || 0,
                                    isComplete: event.isComplete,
                                    preview: event.partialDsl?.substring(0, 100) + '...'
                                });

                                setStreamingSlides((prev) => {
                                    const newSlides = [...prev];
                                    // Find or create the slide
                                    let slide = newSlides.find(s => s.slideIndex === event.slideIndex);
                                    if (!slide) {
                                        console.log(`🆕 [FRONTEND] Creating new slide #${event.slideIndex}`);
                                        slide = {
                                            slideIndex: event.slideIndex,
                                            partialDsl: '',
                                            isComplete: false,
                                        };
                                        newSlides.push(slide);
                                    }

                                    // Update the partial DSL
                                    slide.partialDsl = event.partialDsl;
                                    slide.isComplete = event.isComplete || false;

                                    console.log(`🔄 [FRONTEND] Updated slide #${event.slideIndex}, DSL length: ${slide.partialDsl.length}, complete: ${slide.isComplete}`);

                                    // Sort slides by index
                                    return newSlides.sort((a, b) => a.slideIndex - b.slideIndex);
                                });
                                break;

                            case 'complete':
                                console.log('🎉 [FRONTEND] Generation complete!', {
                                    presentationId: event.presentation_id,
                                    dslLength: event.dsl?.length || 0
                                });
                                setIsStreaming(false);
                                setCreating(false);
                                // Navigate to the newly created presentation
                                if (event.presentation_id) {
                                    console.log(`🔗 [FRONTEND] Navigating to presentation: ${event.presentation_id}`);
                                    setTimeout(() => {
                                        setShowStreamingPreview(false);
                                        router.push(`/presentations/${event.presentation_id}`);
                                    }, 1000); // Small delay to show completion
                                }
                                break;

                            case 'error':
                                console.error('❌ [FRONTEND] Error event received:', event.message);
                                setError(event.message || 'Failed to generate presentation');
                                setIsStreaming(false);
                                setCreating(false);
                                setShowStreamingPreview(false);
                                break;

                            default:
                                console.log(`⚠️ [FRONTEND] Unknown event type: ${event.type}`);
                        }
                    } catch (parseError) {
                        console.error('❌ [FRONTEND] Error parsing event:', parseError);
                        console.error('❌ [FRONTEND] Problematic line:', line);
                    }
                }
            }
        } catch (error) {
            // Don't show error if request was aborted by user
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('🛑 [FRONTEND] Generation cancelled by user');
                return;
            }

            console.error('❌ [FRONTEND] Error creating presentation:', error);
            console.error('❌ [FRONTEND] Error details:', {
                name: error instanceof Error ? error.name : 'Unknown',
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            setError(error instanceof Error ? error.message : 'Failed to generate presentation');
            setIsStreaming(false);
            setCreating(false);
            setShowStreamingPreview(false);
        } finally {
            console.log('🧹 [FRONTEND] Cleaning up, abortController reset');
            abortControllerRef.current = null;
        }
    };

    /**
     * DELETE HANDLER:
     * Removes presentation from local state after deletion
     * 
     * PERFORMANCE:
     * - Wrapped in useCallback to prevent PresentationCard re-renders
     * - Dependency on presentations ensures fresh data
     */
    const handleDelete = useCallback((id: string) => {
        setPresentations(presentations.filter(p => p.presentation_id !== id));
    }, [presentations]);

    // PAGINATION CALCULATIONS:
    // Splits presentations into pages for better performance
    const totalPages = Math.ceil(presentations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPresentations = presentations.slice(startIndex, endIndex);

    /**
     * PAGE NAVIGATION:
     * Handles pagination with smooth scroll to top
     */
    const goToPage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        /**
         * PAGE LAYOUT:
         * - Full-height flex column
         * - Gradient background with animated orbs
         * - Fixed header with glassmorphism
         * - Responsive grid for presentation cards
         * 
         * BACKGROUND DESIGN:
         * - Dark slate gradient base
         * - Three animated orbs with pulse/float animations
         * - Blur effects for depth
         */
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

                        <div className="space-y-4">
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

                            {/* AI Model Selection */}
                            <div className="flex items-center gap-3 px-4 py-3 glass border border-white/10 rounded-lg">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={useChatGPT}
                                        onChange={(e) => setUseChatGPT(e.target.checked)}
                                        disabled={creating}
                                        className="w-4 h-4 rounded border-white/30 bg-white/10 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-white/90">
                                        Use ChatGPT for better planning
                                    </span>
                                </label>
                                <span className="text-xs text-purple-300/70 ml-auto">
                                    {useChatGPT ? 'ChatGPT + Gemini' : 'Gemini only'}
                                </span>
                            </div>
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
                                            className={`px-5 py-3 rounded-xl font-semibold transition-all hover-lift ${currentPage === page
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

            {/* Streaming Preview Modal */}
            {showStreamingPreview && (
                <StreamingPresentationPreview
                    slides={streamingSlides}
                    isStreaming={isStreaming}
                    onClose={() => {
                        if (abortControllerRef.current) {
                            abortControllerRef.current.abort();
                        }
                        setShowStreamingPreview(false);
                        setIsStreaming(false);
                        setCreating(false);
                        setStreamingSlides([]);
                    }}
                    onComplete={(presentationId) => {
                        setShowStreamingPreview(false);
                        router.push(`/presentations/${presentationId}`);
                    }}
                />
            )}
        </div>
    );
}