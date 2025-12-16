'use client';

import { Presentation, Slide } from "@/types/types";
import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { dslToSlides } from "@/lib/dsl";
import RevealPresentationViewer from "./RevealPresentationViewer";
import { useExperimentalMode } from "@/contexts/experimental-mode-context";

interface PresentationViewerProps {
    presentation: Presentation;
    onClose?: () => void;
    editable?: boolean;
    onEdit?: (index: number, newSlideDsl: string) => void;
}

export default function PresentationViewer({ presentation, onClose, editable, onEdit }: PresentationViewerProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { experimentalMode } = useExperimentalMode();
    const containerRef = useRef<HTMLDivElement>(null);

    const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    const slides: (Slide | string)[] = useMemo(() => {
        if (presentation.dsl) {
            return dslToSlides(presentation.dsl);
        }
        return presentation.slides || [];
    }, [presentation.dsl, presentation.slides]);

    const totalSlides = slides.length;
    const [editedSlides, setEditedSlides] = useState<(Slide | string)[]>(slides);

    useEffect(() => {
        setEditedSlides(slides);
        setSelectedElement(null);
    }, [slides]);

    const slide = editedSlides[currentSlide];
    const isDsl = typeof slide === 'string';

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
        if (editable && isDsl) return;
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') previousSlide();
        if (e.key === 'Escape') {
            if (!isFullscreen) {
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
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (editable && onEdit && isDsl) {
            triggerUpdate();
        }
    };

    const triggerUpdate = () => {
        if (onEdit && containerRef.current && isDsl) {
            const dslContainer = containerRef.current.querySelector('[contenteditable]');
            if (dslContainer) {
                const html = dslContainer.innerHTML;
                setEditedSlides(prev => {
                    const copy = [...prev];
                    copy[currentSlide] = html;
                    return copy;
                });
                onEdit(currentSlide, html);
            }
        }
    }

    const updateElementStyle = (classNameToAdd: string, classPatternToRemove: RegExp) => {
        if (!selectedElement) return;

        const currentClasses = selectedElement.className;
        const newClasses = currentClasses.replace(classPatternToRemove, '').trim() + ' ' + classNameToAdd;
        selectedElement.className = newClasses.trim();

        triggerUpdate();
        setFeedbackMessage(`Style updated: ${classNameToAdd.replace('text-', '').replace('font-', '')}`);

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
                const target = e.target as HTMLElement;
                if (target.tagName === 'IMG') {
                    target.setAttribute('src', base64);
                    setFeedbackMessage("Image replaced");
                } else if (selectedElement && selectedElement.tagName === 'IMG') {
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

    const handleElementClick = (e: React.MouseEvent) => {
        if (!editable || isFullscreen) return;

        const target = e.target as HTMLElement;
        if (['H1', 'H2', 'H3', 'P', 'LI', 'SPAN', 'DIV', 'IMG'].includes(target.tagName)) {
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

    useEffect(() => {
        if (feedbackMessage) {
            const timer = setTimeout(() => setFeedbackMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [feedbackMessage]);

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
                    outline: 2px dashed rgba(99, 102, 241, 0.5);
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

    if (totalSlides === 0) {
        return (
            <div className="flex items-center justify-center h-96 text-gray-500">
                No slides available
            </div>
        );
    }

    // Experimental mode with Reveal.js
    if (experimentalMode) {
        return (
            <div
                ref={containerRef}
                className={`relative ${isFullscreen ? 'w-screen h-screen fixed inset-0 z-50' : 'w-full h-full min-h-[600px]'} bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950`}
            >
                {/* Header components for experimental mode ... */}
                {!isFullscreen && (
                    <div className="absolute top-0 left-0 right-0 z-20 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl">
                        <div className="flex items-center justify-between p-6">
                            <h2 className="text-xl font-bold text-white truncate bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                {presentation.title}
                            </h2>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={toggleFullscreen}
                                    className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all text-white border border-white/20 hover:scale-105"
                                    title="Fullscreen"
                                >
                                    <Maximize2 size={20} />
                                </button>
                                {onClose && (
                                    <button
                                        onClick={onClose}
                                        className="p-2.5 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-xl transition-all text-red-300 hover:text-red-100 border border-red-500/30"
                                        title="Close"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Floating Exit for Fullscreen */}
                {isFullscreen && (
                    <button
                        onClick={toggleFullscreen}
                        className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full transition-all text-white border border-white/20 hover:scale-110 shadow-2xl"
                        title="Exit Fullscreen"
                    >
                        <Minimize2 size={24} />
                    </button>
                )}

                <div className={`absolute inset-0 ${isFullscreen ? '' : 'top-[72px]'}`}>
                    <RevealPresentationViewer presentation={presentation} onClose={onClose} />
                </div>
            </div>
        );
    }

    // Standard presentation view
    return (
        <div
            ref={containerRef}
            className={`relative ${isFullscreen ? 'w-screen h-screen fixed inset-0 z-50' : 'w-full h-full min-h-[600px]'} bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 overflow-hidden`}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            onClick={(e) => {
                if (!editable) e.currentTarget.focus();
                if (e.target === e.currentTarget || e.target === containerRef.current?.querySelector('.slide-container')) {
                    setSelectedElement(null);
                }
            }}
        >
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Feedback Toast */}
            {feedbackMessage && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[100] bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl animate-in fade-in slide-in-from-top-4 border border-white/20">
                    ✨ {feedbackMessage}
                </div>
            )}

            {/* Selection Border logic... */}
            {editable && selectedElement && containerRef.current && (() => {
                const rect = selectedElement.getBoundingClientRect();
                const containerRect = containerRef.current.getBoundingClientRect();
                return (
                    <div
                        className="absolute border-2 border-purple-500 pointer-events-none z-10 transition-all duration-200 rounded-lg shadow-lg shadow-purple-500/50"
                        style={{
                            top: rect.top - containerRect.top,
                            left: rect.left - containerRect.left,
                            width: rect.width,
                            height: rect.height,
                        }}
                    />
                );
            })()}

            {/* Floating Toolbar... */}
            {editable && selectedElement && (
                <div
                    className="absolute z-50 bg-slate-900/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 p-3 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200"
                    style={{
                        top: Math.max(10, toolbarPosition.top),
                        left: Math.max(10, toolbarPosition.left)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    {['H1', 'H2', 'H3', 'P', 'LI', 'SPAN', 'DIV'].includes(selectedElement.tagName) && (
                        <>
                            <div className="flex items-center gap-1.5 border-r border-white/20 pr-3">
                                <button onClick={() => updateElementStyle('text-left', /text-(center|right|justify)/g)} className="p-2 hover:bg-white/10 rounded-lg transition-all text-white hover:scale-110"><AlignLeft size={16} /></button>
                                <button onClick={() => updateElementStyle('text-center', /text-(left|right|justify)/g)} className="p-2 hover:bg-white/10 rounded-lg transition-all text-white hover:scale-110"><AlignCenter size={16} /></button>
                                <button onClick={() => updateElementStyle('text-right', /text-(left|center|justify)/g)} className="p-2 hover:bg-white/10 rounded-lg transition-all text-white hover:scale-110"><AlignRight size={16} /></button>
                            </div>

                            <div className="flex items-center gap-1.5 border-r border-white/20 pr-3">
                                <button onClick={() => updateElementStyle('font-bold', /font-(normal|light|medium)/g)} className="p-2 hover:bg-white/10 rounded-lg transition-all text-white font-bold hover:scale-110">B</button>
                                <button onClick={() => updateElementStyle('italic', /italic/g)} className="p-2 hover:bg-white/10 rounded-lg transition-all text-white italic hover:scale-110">I</button>
                            </div>

                            <select
                                className="bg-white/10 text-white text-xs border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                onChange={(e) => updateElementStyle(e.target.value, /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl)/g)}
                            >
                                <option value="" className="bg-slate-900">Size</option>
                                <option value="text-sm" className="bg-slate-900">Small</option>
                                <option value="text-base" className="bg-slate-900">Normal</option>
                                <option value="text-xl" className="bg-slate-900">Large</option>
                                <option value="text-2xl" className="bg-slate-900">XL</option>
                                <option value="text-4xl" className="bg-slate-900">2XL</option>
                                <option value="text-6xl" className="bg-slate-900">4XL</option>
                            </select>

                            <div className="flex gap-1.5">
                                {['text-slate-900', 'text-white', 'text-indigo-400', 'text-emerald-400', 'text-red-400'].map(color => (
                                    <button
                                        key={color}
                                        className={`w-6 h-6 rounded-full border-2 border-white/30 ${color.replace('text-', 'bg-')} hover:scale-110 transition-transform shadow-lg`}
                                        onClick={() => updateElementStyle(color, /text-(slate|gray|white|black|indigo|purple|emerald|red|blue|orange|yellow|green|pink)-(50|100|200|300|400|500|600|700|800|900|950)/g)}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {selectedElement.tagName === 'IMG' && (
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="Image URL..."
                                className="text-xs px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 w-48 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') updateImageSrc(e.currentTarget.value);
                                }}
                            />
                            <span className="text-xs text-white/50">or drop image</span>
                        </div>
                    )}
                </div>
            )}

            {/* Glassmorphic Header */}
            {!isFullscreen && (
                <div className="absolute top-0 left-0 right-0 z-20 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl">
                    <div className="flex items-center justify-between p-6">
                        <h2 className="text-xl font-bold text-white truncate bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            {presentation.title}
                        </h2>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleFullscreen}
                                className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all text-white border border-white/20 hover:scale-105"
                                title="Fullscreen"
                            >
                                <Maximize2 size={20} />
                            </button>
                            {onClose && (
                                <button
                                    onClick={onClose}
                                    className="p-2.5 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-xl transition-all text-red-300 hover:text-red-100 border border-red-500/30"
                                    title="Close"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Exit for Fullscreen */}
            {isFullscreen && (
                <button
                    onClick={toggleFullscreen}
                    className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full transition-all text-white border border-white/20 hover:scale-110 shadow-2xl"
                    title="Exit Fullscreen"
                >
                    <Minimize2 size={24} />
                </button>
            )}

            {/* Slide Content - MODIFIED SECTION */}
            <div className={`absolute inset-0 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-4 md:p-6 top-[72px] bottom-[80px]'}`}>
                {isDsl ? (
                    <div
                        className={`${isFullscreen ? 'w-screen h-screen' : 'w-full h-full'} bg-white rounded-2xl shadow-2xl outline-none slide-container presentation-slide overflow-auto p-8 md:p-10`}
                        dangerouslySetInnerHTML={{ __html: slide as string }}
                        contentEditable={editable}
                        onBlur={handleBlur}
                        onClick={handleElementClick}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        suppressContentEditableWarning={true}
                    />
                ) : (
                    <div className={`w-full max-w-6xl bg-white/95 backdrop-blur-sm shadow-2xl p-8 md:p-12 overflow-y-auto ${isFullscreen ? 'h-full rounded-none' : 'h-full rounded-2xl'} border border-white/20 flex flex-col`}>
                        {/* Title - Reduced margin, ensure it doesn't wrap oddly */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6 pb-4 border-b-4 border-gradient-to-r from-purple-500 to-blue-500 shrink-0">
                            {(slide as Slide).title}
                        </h1>
                        
                        {/* Content & Image Wrapper - Flex to manage space */}
                        <div className="flex-1 min-h-0 flex flex-col gap-6">
                            {/* Markdown - Changed prose-xl to responsive prose-lg to fit better */}
                            <div className="prose prose-slate md:prose-lg max-w-none prose-headings:leading-tight prose-p:leading-relaxed text-slate-700">
                                <ReactMarkdown>{(slide as Slide).content}</ReactMarkdown>
                            </div>

                            {(slide as Slide).imageUrl && (
                                <div className="mt-auto pt-4 flex justify-center">
                                    <img
                                        src={(slide as Slide).imageUrl!}
                                        alt={(slide as Slide).title}
                                        className="rounded-2xl shadow-2xl border border-white/20 max-h-[50vh] w-auto object-contain"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modern Navigation */}
            {!isFullscreen ? (
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-white/10 backdrop-blur-xl border-t border-white/20 shadow-2xl h-[80px]">
                    <div className="flex items-center justify-between px-6 h-full">
                        <button
                            onClick={previousSlide}
                            disabled={currentSlide === 0}
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg hover:scale-105 font-semibold text-sm"
                        >
                            <ChevronLeft size={18} />
                            Previous
                        </button>

                        <div className="flex items-center gap-6">
                            <span className="text-xs font-bold text-white bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                                {currentSlide + 1} / {totalSlides}
                            </span>
                            <div className="flex gap-2 hidden md:flex">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`h-1.5 rounded-full transition-all ${index === currentSlide
                                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 w-8'
                                            : 'bg-white/30 w-2 hover:bg-white/50'
                                            }`}
                                        title={`Slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={nextSlide}
                            disabled={currentSlide === totalSlides - 1}
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg hover:scale-105 font-semibold text-sm"
                        >
                            Next
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <button
                        onClick={previousSlide}
                        disabled={currentSlide === 0}
                        className="absolute left-6 bottom-6 z-50 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full transition-all text-white border border-white/20 disabled:opacity-20 disabled:cursor-not-allowed shadow-2xl hover:scale-110"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={nextSlide}
                        disabled={currentSlide === totalSlides - 1}
                        className="absolute right-6 bottom-6 z-50 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full transition-all text-white border border-white/20 disabled:opacity-20 disabled:cursor-not-allowed shadow-2xl hover:scale-110"
                    >
                        <ChevronRight size={32} />
                    </button>
                </>
            )}
        </div>
    );
}