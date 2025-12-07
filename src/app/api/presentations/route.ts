import { supabase } from '@/database/connect';
import { NextRequest, NextResponse } from 'next/server';

// GET all presentations with pagination and filtering
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = parseInt(searchParams.get('offset') || '0');
        const isPublic = searchParams.get('public') === 'true';

        let query = supabase
            .from('Presentation')
            .select(`
                *,
                PresentationStats(*)
            `)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (isPublic) {
            query = query.eq('presentation_data->>is_public', 'true');
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
        const { presentation_data, prompts, thumbnail, owner_id } = body;

        const { data, error } = await supabase
            .from('Presentation')
            .insert([
                {
                    presentation_data,
                    prompts: prompts ? [prompts] : [],
                    thumbnail,
                    owner_id,
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to create presentation' },
                { status: 500 }
            );
        }

        // Create stats entry
        await supabase
            .from('PresentationStats')
            .insert([
                {
                    presentation_id: data.presentation_id,
                    likes: 0,
                }
            ]);

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
