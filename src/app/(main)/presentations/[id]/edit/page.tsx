'use client';

import { Presentation, Slide } from "@/types/types";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import SlideEditor from "@/components/SlideEditor";
import PresentationViewer from "@/components/PresentationViewer";
import { ArrowLeft, Save, Plus, Eye } from "lucide-react";
import Link from "next/link";
import { updateSlideInDsl } from "@/lib/dsl";
import { useAuth } from "@/hooks/use-auth";

export default function EditPresentationPage() {
    const { user } = useAuth();
    const params = useParams();
    const router = useRouter();
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [slides, setSlides] = useState<Slide[]>([]);
    const [dsl, setDsl] = useState<string>('');

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
                setTitle(data.data.title);
                setDescription(data.data.description || '');
                setSlides(data.data.slides || []);
                setDsl(data.data.dsl || '');
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

    const handleSave = async () => {
        if (!presentation) return;

        setSaving(true);
        setError('');

        try {
            // If DSL mode, we only save the DSL string (and title/desc)
            // If standard mode, we save the slides array
            const body = dsl ? {
                title,
                description,
                userId: user?.id,
                presentation_data: {
                    ...presentation,
                    dsl,
                    title, // Ensure title is synced
                    description // Ensure description is synced
                }
            } : {
                title,
                description,
                userId: user?.id,
                slides,
            };

            const response = await fetch(`/api/presentations/${presentation?.presentation_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                router.push(`/presentations/${presentation?.presentation_id}`);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to save changes');
            }
        } catch (error) {
            console.error('Error saving presentation:', error);
            setError('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const handleSlideUpdate = (index: number, updatedSlide: Slide) => {
        const newSlides = [...slides];
        newSlides[index] = updatedSlide;
        setSlides(newSlides);
    };

    const handleVisualUpdate = (index: number, newSlideDsl: string) => {
        const newDsl = updateSlideInDsl(dsl, index, newSlideDsl);
        setDsl(newDsl);
    };

    const handleAddSlide = () => {
        const newSlide: Slide = {
            id: `slide-${Date.now()}`,
            title: 'New Slide',
            content: 'Enter your content here...',
            order: slides.length + 1,
        };
        setSlides([...slides, newSlide]);
    };

    const handleDeleteSlide = (index: number) => {
        if (slides.length <= 1) {
            alert('Presentation must have at least one slide');
            return;
        }

        const newSlides = slides.filter((_, i) => i !== index);
        // Reorder remaining slides
        const reorderedSlides = newSlides.map((slide, i) => ({
            ...slide,
            order: i + 1,
        }));
        setSlides(reorderedSlides);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size={40} text="Loading presentation..." />
            </div>
        );
    }

    if (error && !presentation) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {error}
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
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href={`/presentations/${presentation?.presentation_id}`}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Cancel
                        </Link>

                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            Edit Presentation
                        </h1>

                        <div className="flex items-center gap-2">
                            <Link
                                href={`/presentations/${presentation?.presentation_id}`}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <Eye size={18} />
                                Preview
                            </Link>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                <Save size={18} />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Presentation Info */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Presentation Details
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="Presentation title..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="Brief description..."
                            />
                        </div>
                    </div>
                </div>

                {/* Slides or DSL Editor */}
                {dsl ? (
                    <div className="space-y-6">
                        {/* Visual Editor */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Visual Editor
                            </h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Click on text to edit. Changes are synced with the DSL below.
                            </p>
                            <div className="h-[600px] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                {presentation && (
                                    <PresentationViewer
                                        presentation={{ ...presentation, dsl: dsl }}
                                        editable={true}
                                        onEdit={handleVisualUpdate}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Raw DSL Editor */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                DSL Code
                            </h2>
                            <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg">
                                <textarea
                                    value={dsl}
                                    onChange={(e) => setDsl(e.target.value)}
                                    className="w-full h-[300px] font-mono text-sm bg-transparent border-0 focus:ring-0 p-4 text-gray-800 dark:text-gray-200"
                                    spellCheck={false}
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                Edit the standard DSL to modify slides. Be careful with syntax.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Slides ({slides.length})
                            </h2>
                            <button
                                onClick={handleAddSlide}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Plus size={18} />
                                Add Slide
                            </button>
                        </div>

                        {slides.map((slide, index) => (
                            <SlideEditor
                                key={slide.id}
                                slide={slide}
                                onUpdate={(updatedSlide) => handleSlideUpdate(index, updatedSlide)}
                                onDelete={() => handleDeleteSlide(index)}
                                showDelete={slides.length > 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
