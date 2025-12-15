'use client';

import { Presentation } from "@/types/types";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import PresentationViewer from "@/components/PresentationViewer";
import { ArrowLeft, Edit, Trash2, Download, FileAudio } from "lucide-react";
import Link from "next/link";
import { dslToSlides } from "@/lib/dsl";
import pptxgen from "pptxgenjs";

export default function PresentationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (params.id) {
            fetchPresentation(params.id as string);
        }
    }, [params.id]);

    const fetchPresentation = async (id: string) => {
        try {
            const response = await fetch(`/api/presentations/${id}`);
            const data = await response.json();

            if (response.ok) {
                setPresentation(data.data);
            } else {
                setError('Presentation not found');
            }
        } catch (error) {
            console.error('Error fetching presentation:', error);
            setError('Failed to load presentation');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!presentation || !confirm('Are you sure you want to delete this presentation?')) return;

        try {
            const response = await fetch(`/api/presentations/${presentation?.presentation_id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/explore');
            } else {
                alert('Failed to delete presentation');
            }
        } catch (error) {
            console.error('Error deleting presentation:', error);
            alert('Failed to delete presentation');
        }
    };

    const handlePPTExport = async () => {
        if (!presentation) return;

        const pres = new pptxgen();
        pres.layout = 'LAYOUT_16x9';
        pres.title = presentation.title;
        pres.author = "PowerMyPoint";

        const slideData = presentation.dsl
            ? dslToSlides(presentation.dsl)
            : presentation.slides || [];

        slideData.forEach((slideItem: any, index: number) => {
            const slide = pres.addSlide();

            // Standard Slide Object
            if (typeof slideItem === 'object' && slideItem.title) {
                slide.addText(slideItem.title, { x: 0.5, y: 0.5, w: '90%', h: 1, fontSize: 32, bold: true, color: '363636' });
                slide.addText(slideItem.content, { x: 0.5, y: 1.5, w: '90%', h: 4, fontSize: 18, color: '666666' });
                if (slideItem.imageUrl) {
                    slide.addImage({ path: slideItem.imageUrl, x: 7, y: 1.5, w: 5, h: 3 });
                }
            }
            // DSL HTML String
            else if (typeof slideItem === 'string') {
                // Parse HTML content to extract text and images
                const parser = new DOMParser();
                const doc = parser.parseFromString(slideItem, 'text/html');

                // Try to find Headings
                const h1 = doc.querySelector('h1')?.textContent;
                const h2 = doc.querySelector('h2')?.textContent;
                const titleText = h1 || h2 || `Slide ${index + 1}`;

                // Try to find Paragraphs / Lists
                const paragraphs = Array.from(doc.querySelectorAll('p, li'))
                    .map(p => p.textContent)
                    .filter(t => t && t.trim().length > 0)
                    .join('\n');

                // Try to find Images
                const img = doc.querySelector('img');
                const imgSrc = img?.getAttribute('src');

                // Add to Slide
                slide.addText(titleText, { x: 0.5, y: 0.5, w: '90%', h: 1, fontSize: 32, bold: true, color: '363636' });

                if (paragraphs) {
                    slide.addText(paragraphs, { x: 0.5, y: 1.5, w: '50%', h: 4, fontSize: 18, color: '666666' });
                }

                if (imgSrc) {
                    // Check if it's a valid URL, otherwise pptxgen might fail. 
                    // We assume Unsplash URLs or valid public URLs.
                    slide.addImage({ path: imgSrc, x: 6, y: 1.5, w: 4, h: 3 });
                }
            }
        });

        pres.writeFile({ fileName: `${presentation.title.replace(/\s+/g, '-')}.pptx` });
    };

    const handleExport = () => {
        if (!presentation) return;

        if (presentation.dsl) {
            // Export as .pmp for DSL presentations
            const dataBlob = new Blob([presentation.dsl], { type: 'text/plain' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${presentation.title.replace(/\s+/g, '-')}.pmp`;
            link.click();
            URL.revokeObjectURL(url);
        } else {
            // Fallback to JSON for standard presentations
            const dataStr = JSON.stringify(presentation, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${presentation.title.replace(/\s+/g, '-')}.json`;
            link.click();
            URL.revokeObjectURL(url);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size={40} text="Loading presentation..." />
            </div>
        );
    }

    if (error || !presentation) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {error || 'Presentation not found'}
                </h2>
                <Link
                    href="/explore"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                    Back to Explore
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/explore"
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Back to Explore
                        </Link>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePPTExport}
                                className="flex items-center gap-2 px-4 py-2 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800"
                                title="Export as PowerPoint"
                            >
                                <FileAudio size={18} />
                                Export PPT
                            </button>

                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Export source file"
                            >
                                <Download size={18} />
                                Export Source
                            </button>

                            <Link
                                href={`/presentations/${presentation?.presentation_id}/edit`}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Edit size={18} />
                                Edit
                            </Link>

                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <Trash2 size={18} />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Presentation Viewer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <PresentationViewer presentation={presentation} />
            </div>
        </div>
    );
}
