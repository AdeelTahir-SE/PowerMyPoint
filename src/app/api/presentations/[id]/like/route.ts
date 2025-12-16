import { supabase } from '@/database/connect';
import { NextRequest, NextResponse } from 'next/server';

// POST toggle like on presentation
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Check if user is the owner
        const { data: presentation, error: presentationError } = await supabase
            .from('Presentation')
            .select('owner_id')
            .eq('presentation_id', id)
            .single();

        if (presentationError || !presentation) {
            return NextResponse.json(
                { error: 'Presentation not found' },
                { status: 404 }
            );
        }

        if (presentation.owner_id === userId) {
            return NextResponse.json(
                { error: 'Cannot like your own presentation' },
                { status: 403 }
            );
        }

        // Get current stats
        const { data: stats, error: statsError } = await supabase
            .from('PresentationStats')
            .select('likes')
            .eq('presentation_id', id)
            .single();

        if (statsError) {
            return NextResponse.json(
                { error: 'Failed to fetch stats' },
                { status: 500 }
            );
        }

        // Increment likes
        const newLikes = (stats?.likes || 0) + 1;

        const { error: updateError } = await supabase
            .from('PresentationStats')
            .update({ likes: newLikes })
            .eq('presentation_id', id);

        if (updateError) {
            console.error('Supabase error:', updateError);
            return NextResponse.json(
                { error: 'Failed to update likes' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            likes: newLikes,
            message: 'Like updated successfully',
        });
    } catch (error) {
        console.error('Error updating like:', error);
        return NextResponse.json(
            { error: 'Failed to update like' },
            { status: 500 }
        );
    }
}
