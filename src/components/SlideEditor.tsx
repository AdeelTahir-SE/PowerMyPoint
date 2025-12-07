'use client';

import { Slide } from "@/types/types";
import { useState } from "react";
import { Trash2, Plus } from "lucide-react";

interface SlideEditorProps {
    slide: Slide;
    onUpdate: (slide: Slide) => void;
    onDelete?: () => void;
    showDelete?: boolean;
}

export default function SlideEditor({ slide, onUpdate, onDelete, showDelete = true }: SlideEditorProps) {
    const [title, setTitle] = useState(slide.title);
    const [content, setContent] = useState(slide.content);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        onUpdate({ ...slide, title: newTitle });
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        onUpdate({ ...slide, content: newContent });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Slide {slide.order}
                </h3>
                {showDelete && onDelete && (
                    <button
                        onClick={onDelete}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete slide"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            {/* Title Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Slide Title
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter slide title..."
                />
            </div>

            {/* Content Textarea */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Slide Content (Markdown supported)
                </label>
                <textarea
                    value={content}
                    onChange={handleContentChange}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-y"
                    placeholder="Enter slide content using markdown..."
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Use markdown formatting: **bold**, *italic*, # headings, - bullet points
                </p>
            </div>
        </div>
    );
}
