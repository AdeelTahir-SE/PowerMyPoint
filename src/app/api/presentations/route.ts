import { supabase } from '@/database/connect';
import { NextRequest, NextResponse } from 'next/server';

// GET all presentations
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');
        const isPublic = searchParams.get('public') === 'true';

        let query = supabase
            .from('presentations')
            .select('*')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (isPublic) {
            query = query.eq('is_public', true);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch presentations' },
                { status: 500 }
            );
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching presentations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch presentations' },
            { status: 500 }
        );
    }
}

// POST create new presentation
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, slides, user_id, is_public } = body;

        if (!title || !slides) {
            return NextResponse.json(
                { error: 'Title and slides are required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('presentations')
            .insert({
                title,
                description: description || '',
                slides,
                user_id: user_id || null,
                is_public: is_public !== undefined ? is_public : true,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to create presentation' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            data,
            message: 'Presentation created successfully',
        });
    } catch (error) {
        console.error('Error creating presentation:', error);
        return NextResponse.json(
            { error: 'Failed to create presentation' },
            { status: 500 }
        );
    }
}
