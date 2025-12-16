/**
 * PresentationCard Component
 * 
 * DESIGN SPECIFICATION:
 * A reusable card component for displaying presentation previews in grid layouts.
 * Features:
 * - Live preview of first slide rendered from DSL
 * - Glassmorphism design with hover effects
 * - Like/Unlike functionality for non-owners
 * - Edit/Delete actions for owners
 * - Responsive layout with gradient overlays
 * 
 * PERFORMANCE OPTIMIZATION:
 * - Wrapped with React.memo to prevent unnecessary re-renders
 * - Custom comparison function checks only essential props
 * - Prevents re-rendering when parent state changes (e.g., typing in search)
 * 
 * STYLING APPROACH:
 * - Dark glassmorphism with purple/indigo accents
 * - Hover effects: glow, shimmer, gradient overlay
 * - Smooth transitions for premium feel
 * - Responsive aspect ratio for slide preview
 */
'use client';

import { Presentation } from "@/types/types";
import Link from "next/link";
import { Calendar, Eye, FileText, Trash2, Edit, Heart } from "lucide-react";
import { useState, useEffect, memo } from "react";
import { dslToSlides } from "@/lib/dsl";
import { useAuth } from "@/hooks/use-auth";

/**
 * INTERFACE: PresentationCardProps
 * - Presentation: Full presentation object with metadata and content
 * - onDelete: Optional callback when presentation is deleted
 */
interface PresentationCardProps {
    Presentation: Presentation;
    onDelete?: (id: string) => void;
}

function PresentationCard({ Presentation, onDelete }: PresentationCardProps) {
    // AUTHENTICATION: Get current user to determine ownership
    const { user } = useAuth();

    // STATE MANAGEMENT:
    // - isDeleting: Tracks delete operation in progress
    // - firstSlideHtml: Cached HTML of first slide for preview
    // - isLiked: User's like status for this presentation
    // - likeCount: Total number of likes
    // - isLiking: Tracks like operation in progress
    const [isDeleting, setIsDeleting] = useState(false);
    const [firstSlideHtml, setFirstSlideHtml] = useState<string | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiking, setIsLiking] = useState(false);

    // OWNERSHIP CHECK: Determines which actions are available
    const isOwner = user?.id === Presentation.user_id;

    /**
     * SLIDE PREVIEW GENERATION:
     * Parses DSL and extracts first slide for preview thumbnail
     * 
     * DESIGN DECISION:
     * - Only runs when DSL changes (dependency: Presentation.dsl)
     * - Gracefully handles parsing errors
     * - Shows null preview if no DSL or parsing fails
     */
    useEffect(() => {
        if (Presentation.dsl) {
            try {
                const slides = dslToSlides(Presentation.dsl);
                setFirstSlideHtml(slides[0] || null);
            } catch (error) {
                console.error('Error parsing DSL for preview:', error);
                setFirstSlideHtml(null);
            }
        } else {
            setFirstSlideHtml(null);
        }
    }, [Presentation.dsl]);

    /**
     * LIKE COUNT INITIALIZATION:
     * Extracts like count from presentation stats
     * 
     * DATA STRUCTURE:
     * - PresentationStats is an array (Supabase relation)
     * - Takes first element and extracts likes count
     */
    useEffect(() => {
        const likes = (Presentation as any).PresentationStats?.[0]?.likes || 0;
        setLikeCount(likes);
    }, [Presentation]);

    /**
     * DELETE HANDLER:
     * Handles presentation deletion with confirmation
     * 
     * UX FLOW:
     * 1. Show confirmation dialog
     * 2. Make DELETE API request
     * 3. Update parent component via onDelete callback
     * 4. Show error if deletion fails
     * 
     * ERROR HANDLING:
     * - Shows user-friendly error messages
     * - Maintains loading state during operation
     */
    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to delete this presentation?')) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/presentations/${Presentation?.presentation_id}?userId=${user?.id}`, {
                method: 'DELETE',
            });

            if (response.ok && onDelete) {
                onDelete(Presentation.presentation_id);
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to delete presentation');
            }
        } catch (error) {
            console.error('Error deleting presentation:', error);
            alert('Failed to delete presentation');
        } finally {
            setIsDeleting(false);
        }
    };

    /**
     * LIKE HANDLER:
     * Handles like/unlike toggle with optimistic updates
     * 
     * OPTIMISTIC UI:
     * - Updates UI immediately for responsiveness
     * - Reverts changes if API call fails
     * - Prevents multiple simultaneous requests
     * 
     * RESTRICTIONS:
     * - Owners cannot like their own presentations
     * - Disabled during API operations
     */
    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isOwner || isLiking) return;

        setIsLiking(true);

        // Optimistic update
        const newLiked = !isLiked;
        setIsLiked(newLiked);
        setLikeCount(prev => newLiked ? prev + 1 : prev - 1);

        try {
            const response = await fetch(`/api/presentations/${Presentation.presentation_id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.id }),
            });

            if (!response.ok) {
                // Revert on error
                setIsLiked(!newLiked);
                setLikeCount(prev => newLiked ? prev - 1 : prev + 1);
            } else {
                const data = await response.json();
                setLikeCount(data.likes);
            }
        } catch (error) {
            console.error('Error liking presentation:', error);
            // Revert on error
            setIsLiked(!newLiked);
            setLikeCount(prev => newLiked ? prev - 1 : prev + 1);
        } finally {
            setIsLiking(false);
        }
    };

    // DATE FORMATTING: Convert ISO timestamp to readable format
    const formattedDate = new Date(Presentation.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    // METADATA EXTRACTION: Parse presentation data with fallbacks
    const title = Presentation?.title || 'Untitled Presentation';
    const description = Presentation?.description || 'No description available';
    // Count slides by matching SLIDE { pattern in DSL
    const slidesCount = Presentation.dsl
        ? (Presentation.dsl.match(/SLIDE\s*\{/g) || []).length
        : (Presentation?.slides?.length || 0);

    return (
        /**
         * CARD LAYOUT:
         * - Glassmorphism card with rounded corners
         * - Multiple layered effects for depth
         * - Group hover for coordinated animations
         * 
         * VISUAL EFFECTS:
         * 1. Gradient overlay (opacity 0 → 100 on hover)
         * 2. Glow effect (blur with gradient border)
         * 3. Shimmer animation
         * 4. Lift animation (hover-lift class)
         */
        <div className="group relative glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl hover-lift transition-all duration-500">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

            <Link href={`/presentations/${Presentation.presentation_id}`} className="block relative">
                {/* 
                    SLIDE PREVIEW SECTION:
                    - 16:9 aspect ratio (aspect-video)
                    - Scaled down preview using transform
                    - Gradient overlay for text readability
                    
                    SCALING TECHNIQUE:
                    - scale-[0.35]: Shrinks content to 35%
                    - origin-top-left: Scales from top-left corner
                    - width/height 285.7%: Compensates for scale (1/0.35)
                    - pointer-events-none: Prevents interaction with preview
                */}
                {firstSlideHtml && (
                    <div className="relative w-full aspect-video bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden border-b border-white/10">
                        <div
                            className="absolute inset-0 scale-[0.35] origin-top-left pointer-events-none"
                            style={{
                                width: '285.7%',
                                height: '285.7%',
                            }}
                            dangerouslySetInnerHTML={{ __html: firstSlideHtml }}
                        />
                        {/* Overlay gradient for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                        {/* Preview badge */}
                        <div className="absolute top-3 right-3 px-3 py-1 glass-dark rounded-full border border-white/20 backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <Eye size={14} className="text-indigo-300" />
                                <span className="text-xs text-white font-medium">Preview</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
                                <FileText size={20} className="text-white" />
                            </div>
                            <span className="text-sm font-semibold text-indigo-300">Presentation</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1 glass rounded-full border border-white/10">
                                <Heart size={14} className="text-red-400" />
                                <span className="text-sm text-white font-medium">{likeCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-300 group-hover:to-purple-300 transition-all duration-300">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-indigo-200/70 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-indigo-300/80">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 glass-dark rounded-full border border-white/5">
                            <FileText size={16} />
                            <span className="font-medium">{slidesCount} slides</span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Action buttons */}
            <div className="flex items-center gap-2 px-6 pb-4 pt-2 border-t border-white/10 relative">
                {isOwner ? (
                    <>
                        <Link
                            href={`/presentations/${Presentation.presentation_id}/edit`}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 glass hover:glass-card text-indigo-300 hover:text-white rounded-xl transition-all text-sm font-semibold border border-white/10 hover:border-indigo-500/50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Edit size={16} />
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 glass hover:glass-card text-red-300 hover:text-red-200 rounded-xl transition-all text-sm font-semibold disabled:opacity-50 border border-white/10 hover:border-red-500/50"
                        >
                            <Trash2 size={16} />
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleLike}
                        disabled={isLiking}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm font-semibold border disabled:opacity-50 ${isLiked
                            ? 'bg-red-500/20 text-red-300 border-red-500/50 hover:bg-red-500/30'
                            : 'glass hover:glass-card text-indigo-300 hover:text-white border-white/10 hover:border-red-500/50'
                            }`}
                    >
                        <Heart size={16} className={isLiked ? 'fill-red-400' : ''} />
                        {isLiked ? 'Liked' : 'Like'}
                    </button>
                )}
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 pointer-events-none" />
        </div>
    );
}

// Memoize the component to prevent re-renders when parent state changes
// Only re-render if the presentation data actually changes
export default memo(PresentationCard, (prevProps, nextProps) => {
    // Only re-render if presentation_id or dsl changes
    return (
        prevProps.Presentation.presentation_id === nextProps.Presentation.presentation_id &&
        prevProps.Presentation.dsl === nextProps.Presentation.dsl &&
        prevProps.Presentation.title === nextProps.Presentation.title &&
        prevProps.Presentation.description === nextProps.Presentation.description &&
        prevProps.onDelete === nextProps.onDelete
    );
});