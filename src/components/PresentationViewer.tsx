'use client';

import { Presentation } from "@/types/types";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

interface PresentationViewerProps {
    presentation: Presentation;
    onClose?: () => void;
}

export default function PresentationViewer({ presentation, onClose }: PresentationViewerProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const slides = presentation.slides || [];
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
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') previousSlide();
        if (e.key === 'Escape') onClose?.();
    };

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
    };

    if (totalSlides === 0) {
        return (
            <div className="flex items-center justify-center h-96 text-gray-500">
                No slides available
            </div>
        );
    }

    const slide = slides[currentSlide];

    return (
        <div
            className="relative w-full h-full min-h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            {/* Header */}
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
                        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
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

            {/* Slide Content */}
            <div className="absolute inset-0 top-16 bottom-16 flex items-center justify-center p-8">
                <div className="w-full max-w-4xl h-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-12 overflow-y-auto">
                    {/* Slide Title */}
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 border-b-4 border-indigo-500 pb-4">
                        {slide.title}
                    </h1>

                    {/* Slide Content */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <ReactMarkdown>{slide.content}</ReactMarkdown>
                    </div>

                    {/* Slide Image if available */}
                    {slide.imageUrl && (
                        <div className="mt-8">
                            <Image
                                src={slide.imageUrl}
                                alt={slide.title}
                                width={800}
                                height={600}
                                className="w-full h-auto rounded-lg shadow-md"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Controls */}
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

                    {/* Slide indicators */}
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

            {/* Keyboard shortcuts hint */}
            <div className="absolute bottom-20 right-4 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full">
                Use ← → arrow keys to navigate
            </div>
        </div>
    );
}
