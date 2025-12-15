'use client';

import { useState } from 'react';
import { Upload, ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import PresentationViewer from '@/components/PresentationViewer';
import { Presentation } from '@/types/types';

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (!selectedFile.name.endsWith('.pmp')) {
                setError('Please select a valid .pmp file');
                setFile(null);
                setPresentation(null);
                return;
            }
            setFile(selectedFile);
            setError('');
            parseFile(selectedFile);
        }
    };

    const parseFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;

                // Basic validation: ensure it looks like DSL
                if (!content.includes('PRESENTATION {') || !content.includes('SLIDE {')) {
                    throw new Error('Invalid .pmp file content');
                }

                // Extract title from DSL if possible
                const titleMatch = content.match(/title\s*=\s*"([^"]*)"/);
                const title = titleMatch ? titleMatch[1] : 'Imported Presentation';

                // Create a temporary presentation object
                const tempPresentation: Presentation = {
                    presentation_id: 'temp-preview',
                    title: title,
                    user_id: 'temp',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    dsl: content,
                    description: 'Imported via PMP file',
                    slides: [],
                    is_public: false,
                    views: 0,
                    // Minimal required fields
                };

                setPresentation(tempPresentation);
            } catch (err) {
                console.error("Error parsing file:", err);
                setError('Failed to parse the file. Ensure it is a valid .pmp file.');
                setPresentation(null);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href="/explore"
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Explore
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Import Presentation
                    </h1>
                </div>

                {/* Import Area */}
                {!presentation && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors text-center">
                            <input
                                type="file"
                                id="file-upload"
                                accept=".pmp"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer flex flex-col items-center justify-center gap-4 py-12"
                            >
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400">
                                    <Upload size={48} />
                                </div>
                                <div>
                                    <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        Click to upload or drag & drop
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Only .pmp files are supported
                                    </p>
                                </div>
                            </label>
                        </div>

                        {error && (
                            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-center">
                                {error}
                            </div>
                        )}
                    </div>
                )}

                {/* Preview Area */}
                {presentation && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <FileText className="text-indigo-600" size={24} />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {file?.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Preview Mode
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setPresentation(null); setFile(null); }}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                Import Another
                            </button>
                        </div>

                        <div className="h-[calc(100vh-250px)] min-h-[600px]">
                            <PresentationViewer presentation={presentation} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
