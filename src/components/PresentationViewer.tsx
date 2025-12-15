'use client';

import { Presentation, Slide } from "@/types/types";
import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { dslToSlides, htmlToDsl } from "@/lib/dsl";

interface PresentationViewerProps {
    presentation: Presentation;
    onClose?: () => void;
    editable?: boolean;
    onEdit?: (index: number, newSlideDsl: string) => void;
}

export default function PresentationViewer({ presentation, onClose, editable, onEdit }: PresentationViewerProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const slides: (Slide | string)[] = useMemo(() => {
        if (presentation.dsl) {
            return dslToSlides(presentation.dsl);
        }
        return presentation.slides || [];
    }, [presentation]);

    const totalSlides = slides.length;

    const nextSlide = () => {
        if (currentSlide < totalSlides - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const previousSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (editable && isDsl) return; // Don't capture keys if editing text
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') previousSlide();
        if (e.key === 'Escape') {
            if (isFullscreen) {
                // specific handling for fullscreen escape is often automatic, but we might want to sync state
            } else {
                onClose?.();
            }
        }
    };

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            if (containerRef.current) {
                containerRef.current.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
            }
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(err => {
                    console.error(`Error attempting to exit fullscreen: ${err.message}`);
                });
            }
        }
        // State update will be handled by the event listener to be more robust
        // But for simple toggle, we can set it here too, however event listener is better source of truth
    };

    // Sync fullscreen state with browser events (e.g. user pressing Esc)
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const slide = slides[currentSlide];
    const isDsl = typeof slide === 'string';

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (editable && onEdit && isDsl) {
            const html = e.currentTarget.innerHTML;
            const newDsl = htmlToDsl(html);
            if (newDsl) {
                onEdit(currentSlide, newDsl);
            }
        }
    };


    if (totalSlides === 0) {
        return (
            <div className="flex items-center justify-center h-96 text-gray-500">
                No slides available
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full min-h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl ${isFullscreen ? 'rounded-none' : ''}`}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            // Ensure focus for key events
            onClick={(e) => {
                // Only focus container if not clicking on editable content
                if (!editable) e.currentTarget.focus();
            }}
        >
            {/* Header - Hidden in fullscreen */}
            {!isFullscreen && (
                <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-10">
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {presentation.title}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Toggle fullscreen"
                        >
                            <Maximize2 size={20} />
                        </button>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Close viewer"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Floating Exit Button for Fullscreen */}
            {isFullscreen && (
                <button
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
                    title="Exit Fullscreen"
                >
                    <Minimize2 size={24} />
                </button>
            )}

            {/* Slide Content */}
            <div className={`absolute inset-0 flex items-center justify-center p-0 overflow-y-auto ${isFullscreen ? '' : 'top-16 bottom-16'}`}>
                {isDsl ? (
                    <div
                        className="w-full h-full outline-none"
                        dangerouslySetInnerHTML={{ __html: slide as string }}
                        contentEditable={editable}
                        onBlur={handleBlur}
                        suppressContentEditableWarning={true}
                    />
                ) : (
                    <div className={`w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl p-12 overflow-y-auto ${isFullscreen ? 'h-full rounded-none' : 'h-full rounded-lg m-8'}`}>
                        {/* Slide Title */}
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 border-b-4 border-indigo-500 pb-4">
                            {(slide as Slide).title}
                        </h1>

                        {/* Slide Content */}
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <ReactMarkdown>{(slide as Slide).content}</ReactMarkdown>
                        </div>

                        {/* Slide Image if available */}
                        {(slide as Slide).imageUrl && (
                            <div className="mt-8">
                                <Image
                                    src={(slide as Slide).imageUrl!}
                                    alt={(slide as Slide).title}
                                    width={800}
                                    height={600}
                                    className="w-full h-auto rounded-lg shadow-md"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation Controls */}
            {!isFullscreen ? (
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={previousSlide}
                        disabled={currentSlide === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={20} />
                        Previous
                    </button>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Slide {currentSlide + 1} of {totalSlides}
                        </span>

                        <div className="flex gap-1">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                                        ? 'bg-indigo-600 w-8'
                                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                                        }`}
                                    title={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={nextSlide}
                        disabled={currentSlide === totalSlides - 1}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                        <ChevronRight size={20} />
                    </button>
                </div>
            ) : (
                <>
                    {/* Fullscreen Navigation Buttons */}
                    <button
                        onClick={previousSlide}
                        disabled={currentSlide === 0}
                        className="absolute left-4 bottom-4 z-50 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Previous Slide"
                    >
                        <ChevronLeft size={32} />
                    </button>

                    <button
                        onClick={nextSlide}
                        disabled={currentSlide === totalSlides - 1}
                        className="absolute right-4 bottom-4 z-50 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Next Slide"
                    >
                        <ChevronRight size={32} />
                    </button>
                </>
            )}

            {/* Keyboard shortcuts hint */}
            {!isFullscreen && (
                <div className="absolute bottom-20 right-4 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full">
                    Use ← → arrow keys to navigate
                </div>
            )}
        </div>
    );
}
