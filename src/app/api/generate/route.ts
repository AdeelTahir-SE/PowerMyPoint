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
                    content: `You are a professional presentation creator. Create a detailed presentation based on this prompt: "${prompt}"

Please respond with a JSON object in this exact format:
{
  "title": "Presentation Title",
  "description": "Brief description of the presentation",
  "slides": [
    {
      "id": "1",
      "title": "Slide Title",
      "content": "Slide content in markdown format. Use bullet points, headings, and formatting.",
      "order": 1
    }
  ]
}

Create 5-8 slides with comprehensive content. Make the first slide an introduction and the last slide a conclusion or call-to-action. Use markdown formatting for the content.`,
                },
            ],
        });

        // Parse Claude's response
        const responseText = message.content[0].type === 'text'
            ? message.content[0].text
            : '';

        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to parse presentation data from Claude response');
        }

        const presentationData = JSON.parse(jsonMatch[0]);

        // Save to Supabase
        const { data: presentation, error } = await supabase
            .from('presentations')
            .insert({
                title: presentationData.title,
                description: presentationData.description,
                slides: presentationData.slides,
                user_id: userId || null,
                is_public: true,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to save presentation to database' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            data: presentation,
            message: 'Presentation generated successfully',
        });
    } catch (error) {
        console.error('Error generating presentation:', error);
        return NextResponse.json(
            { error: 'Failed to generate presentation', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
