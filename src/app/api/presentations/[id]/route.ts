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
            .from('Presentation')
            .select(`
                *,
                PresentationStats(*)
            `)
            .eq('presentation_id', id)
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Presentation not found' },
                { status: 404 }
            );
        }

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
        const { presentation_data, prompts, thumbnail } = body;

        const updateData: Record<string, unknown> = {};
        if (presentation_data !== undefined) updateData.presentation_data = presentation_data;
        if (prompts !== undefined) updateData.prompts = prompts;
        if (thumbnail !== undefined) updateData.thumbnail = thumbnail;

        const { data, error } = await supabase
            .from('Presentation')
            .update(updateData)
            .eq('presentation_id', id)
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

        // Delete stats first (foreign key constraint)
        await supabase
            .from('PresentationStats')
            .delete()
            .eq('presentation_id', id);

        const { error } = await supabase
            .from('Presentation')
            .delete()
            .eq('presentation_id', id);

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
