'use client';

import { Presentation, Slide } from "@/types/types";
import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2, AlignLeft, AlignCenter, AlignRight, Type, Image as ImageIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { dslToSlides } from "@/lib/dsl";

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
    }, [presentation.dsl, presentation.slides]);

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

    const [editedSlides, setEditedSlides] = useState<(Slide | string)[]>(slides);

    // Sync editedSlides when external slides prop changes (from DSL textarea updates)
    useEffect(() => {
        setEditedSlides(slides);
        // Reset selection when slides change externally
        setSelectedElement(null);
    }, [slides]);

    // Use editedSlides for rendering
    const slide = editedSlides[currentSlide];
    const isDsl = typeof slide === 'string';

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (editable && onEdit && isDsl) {
            const html = e.currentTarget.innerHTML;
            triggerUpdate(); // Use centralized update logic
        }
    };


    if (totalSlides === 0) {
        return (
            <div className="flex items-center justify-center h-96 text-gray-500">
                No slides available
            </div>
        );
    }

    const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    // Auto-clear feedback
    const handleElementClick = (e: React.MouseEvent) => {
        if (!editable || isFullscreen) return;

        const target = e.target as HTMLElement;
        if (['H1', 'H2', 'H3', 'P', 'LI', 'SPAN', 'DIV', 'IMG'].includes(target.tagName)) {
            // e.preventDefault();
            e.stopPropagation();
            setSelectedElement(target);

            const rect = target.getBoundingClientRect();
            const containerRect = containerRef.current?.getBoundingClientRect();

            if (containerRect) {
                setToolbarPosition({
                    top: rect.top - containerRect.top - 60,
                    left: rect.left - containerRect.left
                });
            }
        } else {
            setSelectedElement(null);
        }
    };

    // Auto-clear feedback
    useEffect(() => {
        if (feedbackMessage) {
            const timer = setTimeout(() => setFeedbackMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [feedbackMessage]);

    // Inject styles for editor interaction
    useEffect(() => {
        if (editable && containerRef.current) {
            const style = document.createElement('style');
            style.innerHTML = `
                .slide-container h1, .slide-container h2, .slide-container h3, 
                .slide-container p, .slide-container li, .slide-container img {
                    cursor: pointer;
                    transition: outline 0.2s;
                }
                .slide-container h1:hover, .slide-container h2:hover, .slide-container h3:hover, 
                .slide-container p:hover, .slide-container li:hover, .slide-container img:hover {
                    outline: 2px dashed rgba(99, 102, 241, 0.5); /* indigo-500/50 */
                }
            `;
            containerRef.current.appendChild(style);
            return () => {
                if (containerRef.current) {
                    try { containerRef.current.removeChild(style); } catch (e) { }
                }
            }
        }
    }, [editable, currentSlide]);

    const triggerUpdate = () => {
        if (onEdit && containerRef.current && isDsl) {
            const dslContainer = containerRef.current.querySelector('[contenteditable]');
            if (dslContainer) {
                const html = dslContainer.innerHTML;

                // Update local state to prevent re-renders from reverting changes
                setEditedSlides(prev => {
                    const copy = [...prev];
                    copy[currentSlide] = html;
                    return copy;
                });

                // Notify parent
                onEdit(currentSlide, html);
            }
        }
    }

    const updateElementStyle = (classNameToAdd: string, classPatternToRemove: RegExp) => {
        if (!selectedElement) return;

        const currentClasses = selectedElement.className;
        const newClasses = currentClasses.replace(classPatternToRemove, '').trim() + ' ' + classNameToAdd;
        selectedElement.className = newClasses.trim();

        // Trigger update immediately to capture the DOM change into state
        triggerUpdate();
        setFeedbackMessage(`Style updated: ${classNameToAdd.replace('text-', '').replace('font-', '')}`);

        // Update selection rect if needed
        const rect = selectedElement.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (containerRect) {
            setToolbarPosition({
                top: rect.top - containerRect.top - 60,
                left: rect.left - containerRect.left
            });
        }
    };

    const updateImageSrc = (newSrc: string) => {
        if (!selectedElement || selectedElement.tagName !== 'IMG') return;
        selectedElement.setAttribute('src', newSrc);
        triggerUpdate();
        setFeedbackMessage("Image updated successfully");
    };

    const handleDrop = async (e: React.DragEvent) => {
        if (!editable) return;
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result as string;

                // If dropped on an image, replace it
                const target = e.target as HTMLElement;
                if (target.tagName === 'IMG') {
                    target.setAttribute('src', base64);
                    setFeedbackMessage("Image replaced");
                } else if (selectedElement && selectedElement.tagName === 'IMG') {
                    // Or if an image is selected
                    selectedElement.setAttribute('src', base64);
                    setFeedbackMessage("Image replaced");
                }
                triggerUpdate();
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        if (!editable) return;
        e.preventDefault();
    }

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full min-h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl ${isFullscreen ? 'rounded-none' : ''}`}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            onClick={(e) => {
                if (!editable) e.currentTarget.focus();
                // Deselect if clicking background
                if (e.target === e.currentTarget || e.target === containerRef.current?.querySelector('.slide-container')) {
                    setSelectedElement(null);
                }
            }}
        >
            {/* Feedback Toast */}
            {feedbackMessage && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[100] bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium animate-in fade-in slide-in-from-top-4">
                    {feedbackMessage}
                </div>
            )}

            {/* Selection Overlay Border */}
            {editable && selectedElement && containerRef.current && (() => {
                const rect = selectedElement.getBoundingClientRect();
                const containerRect = containerRef.current.getBoundingClientRect();
                return (
                    <div
                        className="absolute border-2 border-indigo-500 pointer-events-none z-10 transition-all duration-200"
                        style={{
                            top: rect.top - containerRect.top,
                            left: rect.left - containerRect.left,
                            width: rect.width,
                            height: rect.height,
                        }}
                    />
                );
            })()}

            {/* Toolbar */}
            {editable && selectedElement && (
                <div
                    className="absolute z-50 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200"
                    style={{
                        top: Math.max(10, toolbarPosition.top),
                        left: Math.max(10, toolbarPosition.left)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking toolbar
                >
                    {/* Text Controls */}
                    {['H1', 'H2', 'H3', 'P', 'LI', 'SPAN', 'DIV'].includes(selectedElement.tagName) && (
                        <>
                            <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
                                <button onClick={() => updateElementStyle('text-left', /text-(center|right|justify)/g)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><AlignLeft size={16} /></button>
                                <button onClick={() => updateElementStyle('text-center', /text-(left|right|justify)/g)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><AlignCenter size={16} /></button>
                                <button onClick={() => updateElementStyle('text-right', /text-(left|center|justify)/g)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><AlignRight size={16} /></button>
                            </div>

                            <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
                                <button onClick={() => updateElementStyle('font-bold', /font-(normal|light|medium)/g)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded font-bold">B</button>
                                <button onClick={() => updateElementStyle('italic', /italic/g)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded italic">I</button>
                            </div>

                            <select
                                className="bg-transparent text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 mr-2"
                                onChange={(e) => updateElementStyle(e.target.value, /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl)/g)}
                            >
                                <option value="">Size</option>
                                <option value="text-sm">Small</option>
                                <option value="text-base">Normal</option>
                                <option value="text-xl">Large</option>
                                <option value="text-2xl">XL</option>
                                <option value="text-4xl">2XL</option>
                                <option value="text-6xl">4XL</option>
                            </select>

                            <div className="flex gap-1">
                                {['text-slate-900', 'text-white', 'text-indigo-600', 'text-emerald-500', 'text-red-500'].map(color => (
                                    <button
                                        key={color}
                                        className={`w-4 h-4 rounded-full border border-gray-300 ${color.replace('text-', 'bg-')}`}
                                        onClick={() => updateElementStyle(color, /text-(slate|gray|white|black|indigo|purple|emerald|red|blue|orange|yellow|green|pink)-(50|100|200|300|400|500|600|700|800|900|950)/g)}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Image Controls */}
                    {selectedElement.tagName === 'IMG' && (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Image URL..."
                                className="text-xs px-2 py-1 border rounded bg-transparent w-40"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') updateImageSrc(e.currentTarget.value);
                                }}
                            />
                            <span className="text-xs text-gray-400">or drop image</span>
                        </div>
                    )}
                </div>
            )}

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
                        className="w-full bg-white text-black h-full outline-none slide-container"
                        dangerouslySetInnerHTML={{ __html: slide as string }}
                        contentEditable={editable}
                        onBlur={handleBlur}
                        onClick={handleElementClick}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
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
