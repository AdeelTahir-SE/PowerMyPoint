'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/database/connect';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email: string, password: string, metadata?: any) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        });

        if (error) {
            return { error };
        }

        // Create user record in User table
        if (data.user) {
            try {
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: data.user.id,
                        email: email,
                        full_name: metadata?.full_name,
                        role: metadata?.role,
                        account_type: metadata?.account_type,
                        interests: metadata?.interests,
                        newsletter: metadata?.newsletter,
                    }),
                });

                if (!response.ok) {
                    console.error('Failed to create user in User table');
                }
            } catch (err) {
                console.error('Error creating user record:', err);
            }
        }

        return { error: null };
    };

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { error };
        }

        // Verify user exists in User table
        if (data.user) {
            try {
                const response = await fetch(`/api/users?userId=${data.user.id}`);

                if (!response.ok) {
                    // User doesn't exist in User table
                    await supabase.auth.signOut();
                    return {
                        error: {
                            message: 'User account not found. Please sign up first.'
                        }
                    };
                }
            } catch (err) {
                console.error('Error verifying user:', err);
                await supabase.auth.signOut();
                return {
                    error: {
                        message: 'Failed to verify user account'
                    }
                };
            }
        }

        return { error: null };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const value = {
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
