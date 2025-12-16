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

        // Helper to map tailwind classes to pptx styles
        const getStyles = (element: Element) => {
            const classes = element.className || '';
            const style: any = {
                fontSize: 16, // default
                color: '363636', // default
                bold: false,
                align: 'left',
            };

            // Font Sizes
            if (classes.includes('text-xs')) style.fontSize = 10;
            if (classes.includes('text-sm')) style.fontSize = 12;
            if (classes.includes('text-base')) style.fontSize = 16;
            if (classes.includes('text-lg')) style.fontSize = 18;
            if (classes.includes('text-xl')) style.fontSize = 20;
            if (classes.includes('text-2xl')) style.fontSize = 24;
            if (classes.includes('text-3xl')) style.fontSize = 30;
            if (classes.includes('text-4xl')) style.fontSize = 36;
            if (classes.includes('text-5xl')) style.fontSize = 44;
            if (classes.includes('text-6xl')) style.fontSize = 52;
            if (classes.includes('text-7xl')) style.fontSize = 72;
            if (classes.includes('text-8xl')) style.fontSize = 96;

            // Colors (Approximate Tailwind Default Palette)
            if (classes.includes('text-white')) style.color = 'FFFFFF';
            if (classes.includes('text-black')) style.color = '000000';
            if (classes.includes('text-gray-500') || classes.includes('text-slate-500')) style.color = '6B7280';
            if (classes.includes('text-gray-900') || classes.includes('text-slate-900')) style.color = '111827';
            if (classes.includes('text-indigo-600') || classes.includes('text-indigo-500')) style.color = '4F46E5';
            if (classes.includes('text-purple-600') || classes.includes('text-purple-500')) style.color = '9333EA';
            if (classes.includes('text-emerald-500')) style.color = '10B981';

            // Weight
            if (classes.includes('font-bold')) style.bold = true;
            if (classes.includes('font-semibold')) style.bold = true;

            // Alignment
            if (classes.includes('text-center')) style.align = 'center';
            if (classes.includes('text-right')) style.align = 'right';

            return style;
        };

        slideData.forEach((slideItem: any, index: number) => {
            const slide = pres.addSlide();

            // Process DSL HTML
            if (typeof slideItem === 'string') {
                const parser = new DOMParser();
                const doc = parser.parseFromString(slideItem, 'text/html');
                const root = doc.body.firstElementChild;

                if (!root) return;

                // 1. Background Check
                let bgImage = null;
                const potentialBg = root.querySelector('img.absolute.inset-0');
                if (potentialBg) {
                    const src = potentialBg.getAttribute('src');
                    if (src) {
                        // Use addImage with sizing for background
                        slide.addImage({ path: src, x: 0, y: 0, w: '100%', h: '100%' });
                        // Add a semi-transparent overlay to ensure text readability if needed (simulated)
                        // slide.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:'100%', h:'100%', fill:{ color:'000000', transparency:50 } });
                    }
                } else if (root.className.includes('bg-')) {
                    // Try to map bg color
                    if (root.className.includes('bg-slate-900') || root.className.includes('bg-gray-900')) {
                        slide.background = { color: '111827' };
                        // Note: Default text color must be handled per-text element, as slide.color doesn't exist
                    } else if (root.className.includes('bg-indigo-900')) {
                        slide.background = { color: '312E81' };
                    }
                }

                // 2. Content Traversal
                // Simple layout strategy: Vertical stack unless grid
                let yCursor = 0.5; // Start a bit down

                const processNode = (node: Element, xPos: number | string = 0.5, width: number | string = '90%') => {
                    // If hidden background image, skip
                    if (node.tagName.toLowerCase() === 'img' && node.className.includes('absolute') && node.className.includes('inset-0')) {
                        return;
                    }

                    // Handle Grid (Basic 2-col support)
                    if (node.className.includes('grid') && node.className.includes('grid-cols-2')) {
                        const children = Array.from(node.children);
                        if (children.length >= 2) {
                            // Left Col
                            processNode(children[0], 0.5, '45%');
                            // Reset Y for Right Col (roughly, simplistic)
                            // Ideally we calculate max height. 
                            const savedY = yCursor;
                            // Right Col
                            // If we didn't track height, this might overlap. 
                            // For now, simpler: process usually stack or side-by-side. 
                            // PPTX doesn't auto-flow. We force right col to specific position
                            // Reset Y checking logic is complex without measuring text.
                            // Let's just place right column at x=50%

                            // Actually, let's just dump the text content in separate boxes
                            // Re-processing children manually with override positions
                            handleTextContent(children[0], 0.5, '45%' as any);
                            handleTextContent(children[1], 5.5, '45%' as any);

                            // Move cursor down arbitrarily
                            yCursor += 3;
                            return;
                        }
                    }

                    // Handle Text Elements
                    if (['h1', 'h2', 'h3', 'p', 'li', 'div', 'span'].includes(node.tagName.toLowerCase())) {
                        handleTextContent(node, xPos, width);
                    }

                    // Handle Image Elements (standard flow)
                    if (node.tagName.toLowerCase() === 'img' && !node.className.includes('absolute')) {
                        const src = node.getAttribute('src');
                        if (src) {
                            slide.addImage({ path: src, x: xPos as any, y: yCursor as any, w: 4, h: 3 });
                            yCursor += 3.2;
                        }
                    }

                    // Recurse for simple containers (not grid)
                    if (node.tagName.toLowerCase() === 'div' && !node.className.includes('grid')) {
                        Array.from(node.children).forEach(child => processNode(child, xPos, width));
                    }
                };

                const handleTextContent = (node: Element, x: number | string, w: number | string) => {
                    const text = node.textContent?.trim();
                    if (!text) return; // Skip empty

                    // Don't duplicate if we are traversing into children that are block elements
                    // Only print if leaf or inline-only children? 
                    // Simplification: Print only headers and paragraphs/list-items
                    if (['h1', 'h2', 'h3', 'p', 'li'].includes(node.tagName.toLowerCase())) {
                        const style = getStyles(node);

                        // Adjust sizing logic
                        let h = 0.5;
                        if (style.fontSize > 30) h = 1.2;
                        else if (style.fontSize > 18) h = 0.8;
                        else h = 0.5; // per line approx

                        // Heuristic for length
                        if (text.length > 50) h *= (Math.ceil(text.length / 50));

                        slide.addText(text, {
                            x: x as any,
                            y: yCursor as any,
                            w: w as any,
                            h: h as any,
                            fontSize: style.fontSize,
                            color: style.color,
                            bold: style.bold,
                            align: style.align as any
                        });

                        yCursor += h + 0.2; // Add spacing
                    }
                }

                // Start Processing from Root children to avoid bg wrapper
                Array.from(root.children).forEach(child => processNode(child));

            } else {
                // Formatting for JSON/Object slides (Legacy fallback)
                // ... existing logic ...
                if (slideItem && slideItem.title) {
                    slide.addText(slideItem.title, { x: 0.5, y: 0.5, w: '90%', h: 1, fontSize: 32, bold: true, color: '363636' });
                    slide.addText(slideItem.content, { x: 0.5, y: 1.5, w: '90%', h: 4, fontSize: 18, color: '666666' });
                }
            }
        });

        const safeTitle = presentation.title.replace(/[^a-z0-9]/gi, '_').substring(0, 20);
        pres.writeFile({ fileName: `${safeTitle}.pptx` });
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
