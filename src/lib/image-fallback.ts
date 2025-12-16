/**
 * Image Fallback System
 * Validates image URLs and provides fallbacks via Pexels API and Google Imagen 3
 * 
 * Required Environment Variables:
 * - PEXELS_API_KEY: Pexels API key for searching stock photos (optional)
 * - GOOGLE_IMAGEN_API_KEY or GOOGLE_GEMINI_API_KEY: For image generation fallback (optional)
 * - GOOGLE_CLOUD_PROJECT_ID: Google Cloud Project ID (required if using Imagen API)
 * - GOOGLE_CLOUD_LOCATION: Google Cloud location, default: us-central1 (optional)
 */

export interface ImageUrlInfo {
    url: string;
    type: 'img' | 'background';
    context?: string;
}

/**
 * Validate if an image URL is accessible (returns 200 OK)
 */
export async function validateImageUrl(url: string): Promise<boolean> {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            signal: AbortSignal.timeout(5000), // 5 second timeout
        });
        return response.ok && response.status === 200;
    } catch (error) {
        console.warn(`[IMAGE-FALLBACK] URL validation failed for ${url}:`, error);
        return false;
    }
}

/**
 * Extract all image URLs from DSL string
 * Finds both img { content = "..." } and data-background-image = "..."
 */
export function extractImageUrls(dsl: string): ImageUrlInfo[] {
    const imageUrls: ImageUrlInfo[] = [];

    // Extract img { content = "url" } patterns
    const imgPattern = /img\s*\{[^}]*content\s*=\s*"([^"]+)"/g;
    let match;
    while ((match = imgPattern.exec(dsl)) !== null) {
        imageUrls.push({
            url: match[1],
            type: 'img',
        });
    }

    // Extract data-background-image = "url" patterns
    const bgPattern = /data-background-image\s*=\s*"([^"]+)"/g;
    while ((match = bgPattern.exec(dsl)) !== null) {
        imageUrls.push({
            url: match[1],
            type: 'background',
        });
    }

    return imageUrls;
}

/**
 * Replace an image URL in DSL string
 */
export function replaceImageUrl(dsl: string, oldUrl: string, newUrl: string): string {
    // Escape special regex characters in URLs
    const escapedOldUrl = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Replace in img { content = "..." } patterns
    dsl = dsl.replace(
        new RegExp(`(img\\s*\\{[^}]*content\\s*=\\s*")${escapedOldUrl}(")`, 'g'),
        `$1${newUrl}$2`
    );

    // Replace in data-background-image = "..." patterns
    dsl = dsl.replace(
        new RegExp(`(data-background-image\\s*=\\s*")${escapedOldUrl}(")`, 'g'),
        `$1${newUrl}$2`
    );

    return dsl;
}

/**
 * Search Pexels API for an image
 */
export async function searchPexelsImage(query: string, apiKey: string): Promise<string | null> {
    try {
        const searchQuery = encodeURIComponent(query);
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=1&orientation=landscape`,
            {
                headers: {
                    'Authorization': apiKey,
                },
            }
        );

        if (!response.ok) {
            console.warn(`[IMAGE-FALLBACK] Pexels API error: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
            // Use large size for better quality
            const photo = data.photos[0];
            return photo.src?.large || photo.src?.original || null;
        }

        return null;
    } catch (error) {
        console.warn(`[IMAGE-FALLBACK] Pexels search failed:`, error);
        return null;
    }
}

/**
 * Generate image using Google Imagen 3 API
 * Note: This uses Vertex AI Imagen API
 */
export async function generateImagenImage(prompt: string, apiKey: string): Promise<string | null> {
    try {
        // Google Imagen API endpoint (Vertex AI)
        // Using the REST API for Imagen 3
        const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
        const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

        if (!projectId) {
            console.warn('[IMAGE-FALLBACK] GOOGLE_CLOUD_PROJECT_ID not set, cannot generate with Imagen');
            return null;
        }

        const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagen-3.0-generate-001:predict`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                instances: [{
                    prompt: prompt,
                }],
                parameters: {
                    sampleCount: 1,
                    aspectRatio: '16:9',
                    safetyFilterLevel: 'block_some',
                },
            }),
        });

        if (!response.ok) {
            // If Vertex AI doesn't work, try alternative approach
            console.warn(`[IMAGE-FALLBACK] Imagen API error: ${response.status}`);
            
            // Alternative: Try using Google AI Studio API if available
            // This is a fallback - may need different authentication
            return null;
        }

        const data = await response.json();
        if (data.predictions && data.predictions.length > 0) {
            // Imagen returns base64 encoded images
            const base64Image = data.predictions[0].bytesBase64Encoded;
            if (base64Image) {
                return `data:image/png;base64,${base64Image}`;
            }
        }

        return null;
    } catch (error) {
        console.warn(`[IMAGE-FALLBACK] Imagen generation failed:`, error);
        return null;
    }
}

/**
 * Extract search query from slide context
 */
function extractSearchQuery(context: string, slideTitle?: string, keyPoints?: string[]): string {
    // Combine context, title, and key points to create a search query
    const parts: string[] = [];
    
    if (slideTitle) parts.push(slideTitle);
    if (keyPoints && keyPoints.length > 0) {
        parts.push(keyPoints.slice(0, 2).join(' '));
    }
    if (context) parts.push(context);

    // Take first 50 characters and clean up
    const query = parts.join(' ').substring(0, 50).trim();
    return query || 'presentation';
}

/**
 * Process image fallback for a single URL
 */
export async function processSingleImageFallback(
    url: string,
    context?: string,
    slideTitle?: string,
    keyPoints?: string[]
): Promise<string | null> {
    console.log(`[IMAGE-FALLBACK] Processing fallback for URL: ${url.substring(0, 50)}...`);

    // Step 1: Validate URL
    const isValid = await validateImageUrl(url);
    if (isValid) {
        console.log(`[IMAGE-FALLBACK] URL is valid, no fallback needed`);
        return null; // No fallback needed
    }

    console.log(`[IMAGE-FALLBACK] URL is invalid (404 or error), attempting fallback...`);

    // Step 2: Try Pexels API
    const pexelsKey = process.env.PEXELS_API_KEY;
    if (pexelsKey) {
        const searchQuery = extractSearchQuery(context || '', slideTitle, keyPoints);
        console.log(`[IMAGE-FALLBACK] Searching Pexels with query: "${searchQuery}"`);
        const pexelsUrl = await searchPexelsImage(searchQuery, pexelsKey);
        
        if (pexelsUrl) {
            console.log(`[IMAGE-FALLBACK] Found Pexels image: ${pexelsUrl.substring(0, 50)}...`);
            return pexelsUrl;
        }
        console.log(`[IMAGE-FALLBACK] Pexels search returned no results`);
    } else {
        console.warn(`[IMAGE-FALLBACK] PEXELS_API_KEY not set, skipping Pexels fallback`);
    }

    // Step 3: Try Google Imagen 3
    const imagenKey = process.env.GOOGLE_IMAGEN_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
    if (imagenKey) {
        const imagePrompt = context || slideTitle || 'professional presentation background';
        console.log(`[IMAGE-FALLBACK] Generating image with Imagen 3, prompt: "${imagePrompt}"`);
        const imagenUrl = await generateImagenImage(imagePrompt, imagenKey);
        
        if (imagenUrl) {
            console.log(`[IMAGE-FALLBACK] Generated image with Imagen 3`);
            return imagenUrl;
        }
        console.log(`[IMAGE-FALLBACK] Imagen generation failed`);
    } else {
        console.warn(`[IMAGE-FALLBACK] GOOGLE_IMAGEN_API_KEY not set, skipping Imagen fallback`);
    }

    console.warn(`[IMAGE-FALLBACK] All fallback methods failed for URL: ${url}`);
    return null;
}

/**
 * Process image fallbacks for entire DSL
 * Validates all images and replaces broken ones
 */
export async function processImageFallback(
    dsl: string,
    outline?: { slides?: Array<{ title?: string; keyPoints?: string[]; visualDescription?: string }> }
): Promise<string> {
    console.log(`[IMAGE-FALLBACK] Starting image fallback processing...`);
    
    const imageUrls = extractImageUrls(dsl);
    console.log(`[IMAGE-FALLBACK] Found ${imageUrls.length} image URLs in DSL`);

    if (imageUrls.length === 0) {
        return dsl;
    }

    let updatedDsl = dsl;
    let processedCount = 0;
    let replacedCount = 0;

    for (let i = 0; i < imageUrls.length; i++) {
        const imageInfo = imageUrls[i];
        processedCount++;

        // Get context from outline if available
        const slideIndex = Math.floor(i / 2); // Rough estimate - may need refinement
        const slideContext = outline?.slides?.[slideIndex];
        const context = slideContext?.visualDescription || slideContext?.title || '';
        const slideTitle = slideContext?.title;
        const keyPoints = slideContext?.keyPoints;

        console.log(`[IMAGE-FALLBACK] Processing image ${processedCount}/${imageUrls.length}...`);

        const replacementUrl = await processSingleImageFallback(
            imageInfo.url,
            context,
            slideTitle,
            keyPoints
        );

        if (replacementUrl) {
            updatedDsl = replaceImageUrl(updatedDsl, imageInfo.url, replacementUrl);
            replacedCount++;
            console.log(`[IMAGE-FALLBACK] Replaced image ${processedCount} with fallback URL`);
        }

        // Add small delay to avoid rate limiting
        if (i < imageUrls.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    console.log(`[IMAGE-FALLBACK] Completed: ${processedCount} processed, ${replacedCount} replaced`);
    return updatedDsl;
}

