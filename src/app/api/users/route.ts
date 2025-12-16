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
                    tier_plan: body.tier_plan || "free",

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

        // Count Usage (Presentations created this month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count, error: countError } = await supabase
            .from('Presentation')
            .select('*', { count: 'exact', head: true })
            .eq('owner_id', userId)
            .gte('created_at', startOfMonth.toISOString());

        const usage = count || 0;
        const tier = data.tier_plan || 'free';
        const limit = tier === 'pro' ? 20 : 5;

        return NextResponse.json({
            data: {
                ...data,
                usage: {
                    used: usage,
                    limit: limit,
                    remaining: Math.max(0, limit - usage)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}

// PATCH update user
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { user_id, email, name, ...otherUpdates } = body;

        if (!user_id) {
            return NextResponse.json(
                { error: 'user_id is required' },
                { status: 400 }
            );
        }

        // Prepare updates for User table
        const userTableUpdates: any = { ...otherUpdates };
        if (name !== undefined) {
            userTableUpdates.name = name;
        }

        // Update email in Supabase Auth if provided
        if (email) {
            const { error: authError } = await supabase.auth.admin.updateUserById(
                user_id,
                { email: email }
            );

            if (authError) {
                console.error('Supabase Auth email update error:', authError);
                return NextResponse.json(
                    { error: 'Failed to update email in authentication system' },
                    { status: 500 }
                );
            }

            // Also update email in User table
            userTableUpdates.email = email;
        }

        // Update User table
        const { data, error } = await supabase
            .from('User')
            .update(userTableUpdates)
            .eq('user_id', user_id)
            .select()
            .single();

        if (error) {
            console.error('Supabase update error:', error);
            return NextResponse.json(
                { error: 'Failed to update user profile' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            data,
            message: 'User updated successfully',
        });

    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}
