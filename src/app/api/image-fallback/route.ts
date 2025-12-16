import { NextRequest, NextResponse } from 'next/server';
import { processSingleImageFallback } from '@/lib/image-fallback';

/**
 * API endpoint for client-side image fallback
 * Called when an image fails to load in the browser
 */
export async function POST(request: NextRequest) {
    try {
        const { url, context, slideTitle, keyPoints } = await request.json();

        if (!url) {
            return NextResponse.json(
                { success: false, error: 'URL is required' },
                { status: 400 }
            );
        }

        console.log(`[IMAGE-FALLBACK-API] Processing fallback for URL: ${url.substring(0, 50)}...`);

        const replacementUrl = await processSingleImageFallback(
            url,
            context,
            slideTitle,
            keyPoints
        );

        if (replacementUrl) {
            return NextResponse.json({
                success: true,
                url: replacementUrl,
            });
        } else {
            return NextResponse.json({
                success: false,
                error: 'All fallback methods failed',
            });
        }
    } catch (error) {
        console.error('[IMAGE-FALLBACK-API] Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

