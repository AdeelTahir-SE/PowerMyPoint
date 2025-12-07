import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/database/connect';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
    try {
        const { prompt, userId } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // Generate presentation using Claude
        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4096,
            messages: [
                {
                    role: 'user',
                    content: `Create a presentation about: ${prompt}

Please respond with a JSON object in this exact format:
{
  "title": "Presentation Title",
  "description": "Brief description",
  "slides": [
    {
      "title": "Slide Title",
      "content": "Slide content in markdown format"
    }
  ]
}

Create 5-7 slides with engaging content. Use markdown formatting for the content.`,
                },
            ],
        });

        // Parse Claude's response
        const content = message.content[0];
        let presentationData;

        if (content.type === 'text') {
            const jsonMatch = content.text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                presentationData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Failed to parse presentation data');
            }
        }

        // Add is_public flag
        presentationData.is_public = true;

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

        return NextResponse.json({
            data,
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
