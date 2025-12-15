import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/database/connect';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' });

export async function POST(request: NextRequest) {
    try {
        const { prompt, userId } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // Generate presentation using Gemini
        const dslPrompt = `You are an expert presentation designer specializing in creating beautiful, engaging presentations using a custom Domain-Specific Language (DSL).

    You are tasked with creating a presentation about: ${prompt}

         Please respond with a custom DSL format exactly like this:

        PRESENTATION {
           id = "presentation-id";
           title = "Presentation Title";
           slides = [
             SLIDE {
               div {
                 classes = "relative w-full min-h-screen overflow-hidden";
                 children = [
                   img {
                     content = "https://images.unsplash.com/photo-example?auto=format&fit=crop&w=1920&q=80";
                     classes = "absolute inset-0 w-full h-full object-cover";
                   };
                 ];
               };
             }
           ];
        };

Rules:
1. Use standard Tailwind CSS classes for styling.
2. For images, use Unsplash URLs that match the content.
3. Structure keys (id, title, classes, content) must be unquoted.
4. String values must be double-quoted.
5. Create 5-6 slides with engaging layouts.
6. Return ONLY the DSL string, starting with PRESENTATION {.

`;

        const result = await model.generateContent(dslPrompt);
        const response = await result.response;
        const content = response.text();
        console.log("CONTENT", content);
        let dslString = "";

        // Parse Gemini's response
        if (typeof content === 'string') {
            const dslMatch = content.match(/PRESENTATION\s*\{[\s\S]*\}$/);

            if (dslMatch) {
                dslString = dslMatch[0];
            } else {
                // Fallback if there is extra text but PRESENTATION starts somewhere
                const start = content.indexOf("PRESENTATION {");
                if (start !== -1) {
                    dslString = content.substring(start);
                } else {
                    throw new Error('Failed to parse presentation DSL');
                }
            }
        }

        // Add is_public flag logic if needed, but here we store raw data
        const presentationData = { dsl: dslString, is_public: true };

        // We should extract title for accessibility/searching if possible
        const titleMatch = dslString.match(/title\s*=\s*"([^"]*)"/);
        const title = titleMatch ? titleMatch[1] : prompt;

        // Save to database
        const { data, error } = await supabase
            .from('Presentation')
            .insert([
                {
                    presentation_data: presentationData,
                    prompts: [prompt],
                    owner_id: userId || '00000000-0000-0000-0000-000000000000', // Default UUID if no user
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                { error: 'Failed to save presentation' },
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

        // Return the DSL string to the client immediately so they can view it
        // The client might be expecting { data: { ... }, message }
        return NextResponse.json({
            data: { ...data, dsl: dslString },
            message: 'Presentation generated successfully',
        });
    } catch (error) {
        console.error('Error generating presentation:', error);
        return NextResponse.json(
            { error: 'Failed to generate presentation' },
            { status: 500 }
        );
    }
}
