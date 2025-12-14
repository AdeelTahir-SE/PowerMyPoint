import { supabase } from '@/database/connect';
import { NextRequest, NextResponse } from 'next/server';

// POST create new user in User table
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { user_id, email, full_name, role, account_type, interests, newsletter } = body;

        if (!user_id || !email) {
            return NextResponse.json(
                { error: 'user_id and email are required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('User')
            .insert([
                {
                    user_id,
                    email,
                    name: full_name,
                    profile_image: "/placeholder-avatar.jpeg",
                    tier_plan: "free",

                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to create user' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            data,
            message: 'User created successfully',
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
}

// GET user by ID
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'userId is required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('User')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}
