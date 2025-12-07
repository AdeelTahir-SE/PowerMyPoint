'use client';

import PresentationCard from "@/components/PresentationCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Presentation } from "@/types/types";
import { useEffect, useState } from "react";
import { TrendingUp, Flame } from "lucide-react";

export default function TrendingsPage() {
    const [presentations, setPresentations] = useState<Presentation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTrendingPresentations();
    }, []);

    const fetchTrendingPresentations = async () => {
        try {
            const response = await fetch('/api/presentations?public=true&limit=50');
            const data = await response.json();

            // Sort by views (trending)
            const sorted = (data.data || []).sort((a: Presentation, b: Presentation) =>
                (b.views || 0) - (a.views || 0)
            );

            setPresentations(sorted);
        } catch (error) {
            console.error('Error fetching trending presentations:', error);
            setError('Failed to load trending presentations');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        setPresentations(presentations.filter(p => p.id !== id));
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Flame size={36} />
                        <h1 className="text-4xl font-bold">
                            Trending Presentations
                        </h1>
                    </div>
                    <p className="text-orange-100 text-lg">
                        Discover the most popular presentations right now
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoadingSpinner size={40} text="Loading trending presentations..." />
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                ) : presentations.length > 0 ? (
                    <div>
                        {/* Stats */}
                        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="text-green-600" size={24} />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Presentations</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{presentations.length}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <Flame className="text-orange-600" size={24} />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Most Viewed</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {presentations[0]?.views || 0} views
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="text-blue-600" size={24} />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {presentations.reduce((sum, p) => sum + (p.views || 0), 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Presentations Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {presentations.map((presentation, index) => (
                                <div key={presentation.id} className="relative">
                                    {/* Rank badge for top 3 */}
                                    {index < 3 && (
                                        <div className="absolute -top-2 -left-2 z-10 bg-gradient-to-br from-yellow-400 to-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                                            {index + 1}
                                        </div>
                                    )}
                                    <PresentationCard
                                        Presentation={presentation}
                                        onDelete={handleDelete}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-gray-400 dark:text-gray-600 mb-4">
                            <TrendingUp size={64} className="mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No trending presentations yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Be the first to create a popular presentation!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
