/**
 * StreamingPresentationPreview Component
 * 
 * DESIGN SPECIFICATION:
 * This component provides a real-time preview of presentations as they are being generated.
 * It supports two rendering modes:
 * 1. Standard HTML mode - renders slides as HTML with custom styling
 * 2. Reveal.js mode (experimental) - uses Reveal.js for professional presentation rendering
 * 
 * ARCHITECTURE:
 * - Receives streaming slide data with partial DSL content
 * - Parses and renders slides incrementally as data arrives
 * - Auto-advances to newest slide during generation
 * - Provides manual navigation between slides
 * 
 * STYLING APPROACH:
 * - Glassmorphism design with dark theme
 * - Purple/indigo accent colors for consistency with app theme
 * - Full-screen modal overlay with backdrop blur
 * - Responsive layout with fixed header and navigation controls
 */
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { dslToSlides } from '@/lib/dsl';
import { dslToRevealSlides } from '@/lib/reveal-converter';
import { useExperimentalMode } from '@/contexts/experimental-mode-context';

// DESIGN NOTE: CSS imports for Reveal.js theme
// Conditionally loaded only in browser environment to avoid SSR issues
if (typeof window !== 'undefined') {
    import('reveal.js/dist/reveal.css');
    import('reveal.js/dist/theme/black.css');
    import('highlight.js/styles/github-dark.css');
}

/**
 * INTERFACE: StreamingSlide
 * Represents a single slide being streamed from the server
 * - slideIndex: 0-based position in the presentation
 * - partialDsl: Incrementally built DSL content (may be incomplete)
 * - isComplete: Flag indicating if slide generation is finished
 */
interface StreamingSlide {
    slideIndex: number;
    partialDsl: string;
    isComplete: boolean;
}

/**
 * INTERFACE: StreamingPresentationPreviewProps
 * Component props for controlling the preview modal
 * - slides: Array of streaming slide data
 * - onClose: Callback to close the preview modal
 * - onComplete: Callback when presentation generation completes
 * - isStreaming: Flag indicating if data is still being received
 */
interface StreamingPresentationPreviewProps {
    slides: StreamingSlide[];
    onClose?: () => void;
    onComplete?: (presentationId: string) => void;
    isStreaming: boolean;
}

export default function StreamingPresentationPreview({
    slides,
    onClose,
    onComplete,
    isStreaming,
}: StreamingPresentationPreviewProps) {
    // STATE MANAGEMENT:
    // - currentSlideIndex: Tracks which slide is currently being displayed
    // - experimentalMode: Determines whether to use Reveal.js or standard HTML rendering
    // - revealRef: DOM reference for Reveal.js container
    // - revealInstanceRef: Persistent reference to Reveal.js instance
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const { experimentalMode } = useExperimentalMode();
    const revealRef = useRef<HTMLDivElement>(null);
    const revealInstanceRef = useRef<any>(null);

    /**
     * RENDERING LOGIC:
     * Converts partial DSL to HTML for each slide
     * 
     * DESIGN DECISIONS:
     * - Uses useMemo for performance optimization (only re-renders when slides change)
     * - Gracefully handles incomplete DSL with fallback rendering
     * - Shows preview of raw DSL when parsing fails
     * - Displays loading indicators for incomplete slides
     * 
     * ERROR HANDLING:
     * - Wraps partial DSL in minimal PRESENTATION structure for parsing
     * - Falls back to showing raw DSL preview if parsing fails
     * - Limits preview length to prevent UI overflow
     */
    const renderedSlides = useMemo(() => {
        return slides.map((slide) => {
            if (!slide.partialDsl) {
                return '';
            }

            try {
                // Try to parse the partial DSL
                // Wrap in a minimal PRESENTATION structure for parsing
                const fullDsl = `PRESENTATION { slides = [ ${slide.partialDsl} ]; }`;
                const htmlSlides = dslToSlides(fullDsl);

                if (htmlSlides.length > 0) {
                    return htmlSlides[0];
                }

                // If parsing failed, try to extract what we can
                // Look for any complete elements in the partial DSL
                return `<div class="relative w-full min-h-screen p-8">
                    <div class="text-white">
                        <div class="mb-4 text-sm text-purple-300">Generating slide content...</div>
                        <pre class="text-xs opacity-50 font-mono overflow-auto max-h-96">${slide.partialDsl.substring(0, 500)}${slide.partialDsl.length > 500 ? '...' : ''}</pre>
                    </div>
                </div>`;
            } catch (e) {
                // If parsing fails, show partial content
                console.log('⚠️ [PREVIEW] Error parsing partial DSL:', e);
                return `<div class="relative w-full min-h-screen p-8">
                    <div class="text-white">
                        <div class="mb-4 text-sm text-purple-300">Building slide...</div>
                        <div class="text-xs opacity-50 font-mono">${slide.partialDsl.substring(0, 200)}${slide.partialDsl.length > 200 ? '...' : ''}</div>
                        ${!slide.isComplete ? '<div class="mt-4"><LoadingSpinner /></div>' : ''}
                    </div>
                </div>`;
            }
        });
    }, [slides]);

    /**
     * REVEAL.JS INITIALIZATION:
     * Dynamically loads and configures Reveal.js when in experimental mode
     * 
     * DESIGN APPROACH:
     * - Only initializes when experimentalMode is enabled
     * - Loads all available Reveal.js plugins (Markdown, Highlight, Notes, Math, Search, Zoom)
     * - Destroys and recreates instance when slides update for proper re-rendering
     * - Cleans up instance when switching out of experimental mode
     * 
     * CONFIGURATION:
     * - Enables all interactive features (controls, progress, keyboard, touch)
     * - Uses slide transition with fade background transition
     * - Enables auto-animate for smooth element transitions
     * - Configures MathJax for mathematical notation support
     * 
     * PERFORMANCE:
     * - Lazy loads Reveal.js and plugins only when needed
     * - Properly cleans up on unmount to prevent memory leaks
     */
    useEffect(() => {
        if (!experimentalMode || !revealRef.current) {
            // Clean up if switching out of experimental mode
            if (revealInstanceRef.current) {
                try {
                    revealInstanceRef.current.destroy();
                    revealInstanceRef.current = null;
                } catch (e) {
                    console.error('Error destroying Reveal.js instance:', e);
                }
            }
            return;
        }

        if (renderedSlides.length === 0) {
            return;
        }

        const initReveal = async () => {
            try {
                const Reveal = (await import('reveal.js')).default;

                // Try to load ALL available plugins
                let plugins: any[] = [];

                // Markdown plugin - using .esm.js as per official docs
                try {
                    const RevealMarkdown = (await import('reveal.js/plugin/markdown/markdown.esm.js')).default;
                    plugins.push(RevealMarkdown);
                    console.log('✅ [STREAMING] Markdown plugin loaded');
                } catch (e) {
                    console.warn('⚠️ [STREAMING] Markdown plugin not available', e);
                }

                // Highlight plugin (code syntax highlighting) - using .esm.js
                try {
                    const RevealHighlight = (await import('reveal.js/plugin/highlight/highlight.esm.js')).default;
                    plugins.push(RevealHighlight);
                    // Initialize highlight.js if available
                    if (typeof window !== 'undefined') {
                        try {
                            const hljs = await import('highlight.js');
                            if (hljs.default) {
                                hljs.default.highlightAll();
                            }
                        } catch (e) {
                            console.warn('⚠️ [STREAMING] highlight.js library not available');
                        }
                    }
                    console.log('✅ [STREAMING] Highlight plugin loaded');
                } catch (e) {
                    console.warn('⚠️ [STREAMING] Highlight plugin not available', e);
                }

                // Notes plugin (speaker notes) - using .esm.js
                try {
                    const RevealNotes = (await import('reveal.js/plugin/notes/notes.esm.js')).default;
                    plugins.push(RevealNotes);
                    console.log('✅ [STREAMING] Notes plugin loaded');
                } catch (e) {
                    console.warn('⚠️ [STREAMING] Notes plugin not available', e);
                }

                // Math plugin (MathJax) - using .esm.js
                try {
                    const RevealMath = (await import('reveal.js/plugin/math/math.esm.js')).default;
                    plugins.push(RevealMath);
                    console.log('✅ [STREAMING] Math plugin loaded');
                } catch (e) {
                    console.warn('⚠️ [STREAMING] Math plugin not available', e);
                }

                // Search plugin - using .esm.js
                try {
                    const RevealSearch = (await import('reveal.js/plugin/search/search.esm.js')).default;
                    plugins.push(RevealSearch);
                    console.log('✅ [STREAMING] Search plugin loaded');
                } catch (e) {
                    console.warn('⚠️ [STREAMING] Search plugin not available', e);
                }

                // Zoom plugin - using .esm.js
                try {
                    const RevealZoom = (await import('reveal.js/plugin/zoom/zoom.esm.js')).default;
                    plugins.push(RevealZoom);
                    console.log('✅ [STREAMING] Zoom plugin loaded');
                } catch (e) {
                    console.warn('⚠️ [STREAMING] Zoom plugin not available', e);
                }

                // Note: Auto-animate is built-in to Reveal.js (enabled via config.autoAnimate)
                // Menu and Anything plugins are not part of the standard reveal.js package

                // Convert to Reveal.js format
                const revealHtml = dslToRevealSlides(renderedSlides);

                if (revealRef.current) {
                    revealRef.current.innerHTML = revealHtml;
                }

                // Initialize or update Reveal.js with COMPLETE feature set
                const fullConfig: any = {
                    hash: true,
                    controls: true,
                    progress: true,
                    center: true,
                    touch: true,
                    keyboard: true,
                    overview: true,
                    transition: 'slide',
                    transitionSpeed: 'default',
                    backgroundTransition: 'fade',
                    fragments: true,
                    autoAnimate: true,
                    autoAnimateMatcher: null,
                    autoAnimateEasing: 'ease',
                    autoAnimateDuration: 1.0,
                    autoAnimateUnmatched: true,
                    help: true,
                    pause: true,
                    showNotes: false,
                    viewDistance: 3,
                    mobileViewDistance: 2
                };

                if (plugins.length > 0) {
                    fullConfig.plugins = plugins;
                }

                // Configure Math plugin if available (simplified config - let plugin handle MathJax)
                const mathPlugin = plugins.find((p: any) => p && p.id === 'math');
                if (mathPlugin) {
                    fullConfig.math = {
                        mathjax: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
                    };
                }

                if (!revealInstanceRef.current) {
                    const revealInstance = new Reveal(revealRef.current!, fullConfig);

                    revealInstance.initialize().then(() => {
                        revealInstanceRef.current = revealInstance;
                    });
                } else {
                    // Update existing instance - destroy and recreate with new slides
                    try {
                        revealInstanceRef.current.destroy();
                    } catch (e) {
                        // Ignore destroy errors
                    }

                    const revealInstance = new Reveal(revealRef.current!, fullConfig);
                    revealInstance.initialize().then(() => {
                        revealInstanceRef.current = revealInstance;
                    });
                }
            } catch (error) {
                console.error('Error initializing Reveal.js:', error);
            }
        };

        initReveal();

        return () => {
            if (revealInstanceRef.current && !experimentalMode) {
                try {
                    revealInstanceRef.current.destroy();
                    revealInstanceRef.current = null;
                } catch (e) {
                    console.error('Error destroying Reveal.js instance:', e);
                }
            }
        };
    }, [experimentalMode, renderedSlides]);

    /**
     * AUTO-ADVANCE LOGIC:
     * Automatically navigates to the newest slide as it arrives
     * 
     * UX RATIONALE:
     * - Keeps user focused on the latest generated content
     * - User can still manually navigate to previous slides
     * - Only triggers when slide count changes (not on content updates)
     */
    useEffect(() => {
        if (slides.length > 0) {
            setCurrentSlideIndex(slides.length - 1);
        }
    }, [slides.length]);

    // DERIVED STATE: Computed values for current slide display
    const currentSlide = renderedSlides[currentSlideIndex] || '';
    const totalSlides = slides.length;
    const currentSlideData = slides[currentSlideIndex];
    const currentDslLength = currentSlideData?.partialDsl.length || 0;

    return (
        /**
         * LAYOUT STRUCTURE:
         * - Full-screen modal overlay (z-50 for top layer)
         * - Dark backdrop with blur effect for focus
         * - Flexbox column layout with fixed header and footer
         * 
         * STYLING:
         * - bg-black/90: Semi-transparent black background
         * - backdrop-blur-sm: Subtle blur effect on content behind modal
         */
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
            <div className="relative w-full h-full flex flex-col">
                {/* 
                    HEADER SECTION:
                    - Fixed at top with glassmorphism effect
                    - Shows generation status and slide count
                    - Includes close button and mode indicator
                    
                    DESIGN CLASSES:
                    - glass-dark: Custom glassmorphism with dark background
                    - border-b border-white/10: Subtle bottom border
                    - z-20: Ensures header stays above slide content
                */}
                <div className="absolute top-0 left-0 right-0 z-20 glass-dark border-b border-white/10 p-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold text-white">
                                Generating Presentation...
                            </h2>
                            {isStreaming && (
                                <div className="flex items-center gap-2 text-sm text-purple-300">
                                    <LoadingSpinner size={16} />
                                    <span>
                                        {totalSlides > 0 ? (
                                            <>Slide {currentSlideIndex + 1} - {currentDslLength} chars {currentSlideData?.isComplete ? '(complete)' : '(building...)'}</>
                                        ) : (
                                            <>Generating first slide...</>
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            {experimentalMode && (
                                <div className="px-3 py-1.5 bg-purple-600/80 text-white rounded-lg text-xs font-medium">
                                    Reveal.js Mode
                                </div>
                            )}
                            <div className="text-sm text-white/70">
                                {totalSlides} {totalSlides === 1 ? 'slide' : 'slides'}
                            </div>
                            {onClose && (
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="text-white" size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 
                    NAVIGATION CONTROLS:
                    - Only shown when multiple slides exist
                    - Centered at bottom with glassmorphism pill design
                    - Previous/Next buttons with disabled states
                    
                    POSITIONING:
                    - absolute bottom-8: Fixed 2rem from bottom
                    - left-1/2 -translate-x-1/2: Horizontally centered
                    - z-20: Above slide content but below header
                    
                    STYLING:
                    - rounded-full: Pill-shaped container
                    - glass-dark: Glassmorphism effect for modern look
                */}
                {totalSlides > 1 && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-4 glass-dark px-6 py-3 rounded-full border border-white/20">
                        <button
                            onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                            disabled={currentSlideIndex === 0}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Previous slide"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-white text-sm font-medium">
                            {currentSlideIndex + 1} / {totalSlides}
                        </span>
                        <button
                            onClick={() => setCurrentSlideIndex(Math.min(totalSlides - 1, currentSlideIndex + 1))}
                            disabled={currentSlideIndex === totalSlides - 1}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Next slide"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* 
                    SLIDE CONTENT AREA:
                    - Main content area with flex-1 to fill available space
                    - Padding accounts for fixed header (pt-20) and navigation (pb-24)
                    - Centers content both horizontally and vertically
                    
                    RENDERING MODES:
                    1. Reveal.js mode (experimentalMode=true):
                       - Professional presentation framework
                       - Full Reveal.js features (transitions, fragments, etc.)
                    2. Standard HTML mode (experimentalMode=false):
                       - Custom HTML rendering with dangerouslySetInnerHTML
                       - Simpler but faster rendering
                    
                    OVERFLOW HANDLING:
                    - overflow-hidden: Prevents content from breaking layout
                */}
                <div className="flex-1 flex items-center justify-center p-8 pt-20 pb-24 overflow-hidden">
                    {experimentalMode ? (
                        <div
                            ref={revealRef}
                            className="w-full h-full reveal-viewport"
                            style={{ width: '100%', height: '100%' }}
                        />
                    ) : (
                        currentSlide ? (
                            <div
                                className="w-full h-full max-w-7xl mx-auto presentation-slide"
                                dangerouslySetInnerHTML={{ __html: currentSlide }}
                                key={`slide-${currentSlideIndex}-${currentDslLength}`}
                            />
                        ) : (
                            <div className="text-center">
                                <LoadingSpinner size={48} text="Waiting for first slide..." />
                            </div>
                        )
                    )}
                </div>

                {/* 
                    STREAMING PROGRESS INDICATOR:
                    - Only visible while actively receiving data
                    - Shows pulsing animation to indicate live streaming
                    - Positioned at bottom center, above navigation
                    
                    DESIGN:
                    - Glassmorphism pill with purple accent
                    - Animated dot for visual feedback
                    - Clear "Streaming DSL..." message
                */}
                {isStreaming && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                        <div className="glass-dark px-4 py-2 rounded-full border border-white/20">
                            <div className="flex items-center gap-2 text-sm text-purple-300">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                <span>Streaming DSL...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
