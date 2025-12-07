import { supabase } from '@/database/connect';
import { NextRequest, NextResponse } from 'next/server';

// GET single presentation by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const { data, error } = await supabase
            .from('presentations')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Presentation not found' },
                { status: 404 }
            );
        }

        // Increment view count
        await supabase
            .from('presentations')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', id);

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching presentation:', error);
        return NextResponse.json(
            { error: 'Failed to fetch presentation' },
            { status: 500 }
        );
    }
}

// PUT update presentation
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, description, slides, is_public } = body;

        const updateData: Record<string, unknown> = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (slides !== undefined) updateData.slides = slides;
        if (is_public !== undefined) updateData.is_public = is_public;

        const { data, error } = await supabase
            .from('presentations')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to update presentation' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            data,
            message: 'Presentation updated successfully',
        });
    } catch (error) {
        console.error('Error updating presentation:', error);
        return NextResponse.json(
            { error: 'Failed to update presentation' },
            { status: 500 }
        );
    }
}

// DELETE presentation
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const { error } = await supabase
            .from('presentations')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to delete presentation' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: 'Presentation deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting presentation:', error);
        return NextResponse.json(
            { error: 'Failed to delete presentation' },
            { status: 500 }
        );
    }
}
