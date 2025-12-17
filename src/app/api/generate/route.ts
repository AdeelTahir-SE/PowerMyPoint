import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/database/connect';
import { NextRequest, NextResponse } from 'next/server';
import { StreamingDSLParser } from '@/lib/streaming-dsl-parser';
import { dslToSlides, parseSingleElement } from '@/lib/dsl';
import { processImageFallback } from '@/lib/image-fallback';

// Initialize OpenAI (ChatGPT) if available
let openai: any = null;
try {
    const OpenAI = require('openai');
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
        openai = new OpenAI({ apiKey: openaiKey });
        console.log('✅ [BACKEND] OpenAI (ChatGPT) initialized');
    } else {
        console.log('⚠️ [BACKEND] OPENAI_API_KEY not set, ChatGPT features disabled');
    }
} catch (e) {
    console.log('⚠️ [BACKEND] OpenAI package not installed. Run: npm install openai');
}

// Initialize Gemini
const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY || '';
console.log('🔑 [BACKEND] Gemini API Key check:', {
    hasKey: !!geminiApiKey,
    keyLength: geminiApiKey.length,
    keyPrefix: geminiApiKey.substring(0, 10) + '...'
});

if (!geminiApiKey) {
    console.error('❌ [BACKEND] GOOGLE_GEMINI_API_KEY is not set!');
}

const genAI = new GoogleGenerativeAI(geminiApiKey);
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' });
console.log('🤖 [BACKEND] Gemini model initialized:', 'gemini-3-pro-preview');

export async function POST(request: NextRequest) {
    console.log('🚀 [BACKEND] Generate request received');
    try {
        const { prompt, userId, isPublic = true, experimentalMode, useChatGPT } = await request.json();
        console.log('📝 [BACKEND] Request data:', { 
            prompt: prompt?.substring(0, 100) + '...', 
            userId: userId || 'anonymous',
            hasPrompt: !!prompt,
            experimentalMode: experimentalMode || false,
            isPublic: isPublic
        });

        if (!prompt) {
            console.error('❌ [BACKEND] No prompt provided');
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // --- TIER LOGIC START ---
        // TODO: TEMPORARY BYPASS - Remove this return in production
        // Temporarily bypassing subscription checks for development
        const LIMITS = {
            free: { maxPresentations: 5, allowPrivate: false },
            pro: { maxPresentations: 20, allowPrivate: true },
        };
        const tierLimit = LIMITS['pro']; // Set to pro limits temporarily
        // --- TIER LOGIC END (BYPASSED) ---
        
        /* ORIGINAL TIER LOGIC - UNCOMMENT FOR PRODUCTION
        let currentTier = 'free'; // Default to free if no user found
        let usageCount = 0;

        if (userId) {
            // 1. Get User Tier
            const { data: userData, error: userError } = await supabase
                .from('User')
                .select('tier_plan')
                .eq('user_id', userId)
                .single();

            if (!userError && userData) {
                currentTier = userData.tier_plan || 'free';
            }

            // 2. Count Usage (Presentations created this month)
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const { count, error: countError } = await supabase
                .from('Presentation')
                .select('*', { count: 'exact', head: true })
                .eq('owner_id', userId)
                .gte('created_at', startOfMonth.toISOString());

            if (!countError) {
                usageCount = count || 0;
            }
        }

        // 3. Enforce Limits
        const LIMITS = {
            free: { maxPresentations: 5, allowPrivate: false },
            pro: { maxPresentations: 20, allowPrivate: true },
        };

        const tierLimit = LIMITS[currentTier as keyof typeof LIMITS] || LIMITS['free'];

        if (usageCount >= tierLimit.maxPresentations) {
            return NextResponse.json(
                { error: `You have reached your limit of ${tierLimit.maxPresentations} presentations this month. Upgrade to create more.` },
                { status: 403 }
            );
        }

        if (!isPublic && !tierLimit.allowPrivate) {
            return NextResponse.json(
                { error: 'Private presentations are only available on the Pro plan.' },
                { status: 403 }
            );
        }
        // --- TIER LOGIC END ---
        */

        // TWO-STAGE APPROACH: First generate outline, then generate full DSL
        // This ensures better structure, coherence, and quality
        
        // Create a streaming response
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                let fullDSL = '';

                const sendEvent = (type: string, data: any) => {
                    const event = JSON.stringify({ type, ...data }) + '\n';
                    controller.enqueue(encoder.encode(event));
                };

                try {
                    // STAGE 1: Generate detailed outline
                    // Use ChatGPT for outline if available (better at planning), otherwise use Gemini
                    console.log('📋 [BACKEND] STAGE 1: Generating presentation outline...');
                    sendEvent('progress', { message: 'Planning presentation structure...', stage: 'outline' });
                    
                    const outlinePrompt = `You are an expert presentation designer. Create a detailed outline for a presentation about: ${prompt}

Generate a structured outline in JSON format with this exact structure:
{
  "title": "Presentation Title",
  "description": "Brief description of the presentation",
  "slides": [
    {
      "slideNumber": 1,
      "title": "Slide Title",
      "keyPoints": ["Point 1", "Point 2", "Point 3"],
      "visualDescription": "Description of images/visuals needed",
      "transition": "fade",
      "backgroundType": "image|color|gradient",
      "backgroundDescription": "What background to use",
      "fragments": ["First element to show", "Second element to show"],
      "needsCode": false,
      "needsMath": false,
      "speakerNotes": "Optional speaker notes"
    }
  ]
}

REQUIREMENTS:
- Create 6-8 slides for a comprehensive presentation
- ${experimentalMode ? 'For Reveal.js: Vary transitions (slide, fade, zoom, convex, concave)' : 'Use engaging layouts'}
- ${experimentalMode ? 'Plan fragments for progressive reveals' : 'Plan visual elements'}
- ${experimentalMode && 'ONLY mark needsCode=true if topic is about programming/software/technical implementation. DO NOT include code for general topics like animals, nature, history, business.'}
- ${experimentalMode && 'ONLY mark needsMath=true if topic involves mathematical/scientific concepts'}
- CRITICAL: Plan for text visibility - if using background images, specify "needsOverlay: true" and plan for semi-transparent containers behind text
- Ensure logical flow from introduction to conclusion
- Each slide should have clear purpose and visual appeal
- Text must ALWAYS be readable - plan for high contrast and overlays when needed
- use good fonts

Return ONLY valid JSON, no markdown, no code blocks.`;

                    let outlineText = '';
                    
                    // Use ChatGPT for outline if requested and available (better at planning/structure)
                    if (useChatGPT && openai) {
                        console.log('🤖 [BACKEND] Using ChatGPT for outline generation...');
                        try {
                            const completion = await openai.chat.completions.create({
                                model: 'gpt-4o',
                                messages: [
                                    {
                                        role: 'system',
                                        content: 'You are an expert presentation designer. Generate structured JSON outlines for presentations. Always return valid JSON only, no markdown code blocks.'
                                    },
                                    {
                                        role: 'user',
                                        content: outlinePrompt
                                    }
                                ],
                                temperature: 0.7,
                                response_format: { type: 'json_object' }
                            });
                            
                            outlineText = completion.choices[0]?.message?.content || '';
                            console.log('✅ [BACKEND] ChatGPT outline received');
                        } catch (e) {
                            console.error('❌ [BACKEND] ChatGPT error, falling back to Gemini:', e);
                            // Fallback to Gemini
                            const outlineResult = await geminiModel.generateContent(outlinePrompt);
                            const response = outlineResult.response;
                            outlineText = response.text();
                        }
                    } else {
                        // Use Gemini for outline
                        console.log('🤖 [BACKEND] Using Gemini for outline generation...');
                        const outlineResult = await geminiModel.generateContent(outlinePrompt);
                        let response = outlineResult.response;
                        outlineText = response.text();
                    }

                    // Extract JSON from response (might have markdown code blocks)
                    let outlineJson = outlineText.trim();
                    if (outlineJson.startsWith('```json')) {
                        outlineJson = outlineJson.replace(/^```json\n?/, '').replace(/\n?```$/, '');
                    } else if (outlineJson.startsWith('```')) {
                        outlineJson = outlineJson.replace(/^```\n?/, '').replace(/\n?```$/, '');
                    }

                    let outline: any;
                    try {
                        outline = JSON.parse(outlineJson);
                        console.log('✅ [BACKEND] Outline parsed successfully:', {
                            title: outline.title,
                            slideCount: outline.slides?.length || 0
                        });
                    } catch (e) {
                        console.error('❌ [BACKEND] Failed to parse outline JSON:', e);
                        console.log('📄 [BACKEND] Raw outline text:', outlineText.substring(0, 500));
                        throw new Error('Failed to parse presentation outline');
                    }

                    // Send outline to frontend
                    sendEvent('outline', { outline });
                    sendEvent('progress', { message: 'Generating slides...', stage: 'slides' });

                    // STAGE 2: Generate full DSL from outline
                    console.log('🎨 [BACKEND] STAGE 2: Generating full DSL from outline...');
                    
                    // Build DSL prompt that incorporates the outline
                    const outlineSummary = outline.slides.map((slide: any, idx: number) => 
                        `Slide ${idx + 1}: "${slide.title}" - ${slide.keyPoints.join(', ')}${slide.needsCode ? ' [INCLUDE CODE]' : ''}${slide.needsMath ? ' [INCLUDE MATH]' : ''}`
                    ).join('\n');
                    
                    let dslPrompt = '';
                    
                    if (experimentalMode) {
                        // Reveal.js-friendly prompt with ALL features, incorporating the outline
                        dslPrompt = `You are an expert presentation designer specializing in creating beautiful, engaging presentations using a custom Domain-Specific Language (DSL) for Reveal.js.

CRITICAL: This presentation will be displayed using Reveal.js with ALL features enabled. You MUST follow this exact outline:

PRESENTATION OUTLINE:
Title: ${outline.title}
${outlineSummary}

CRITICAL: This presentation will be displayed using Reveal.js with ALL features enabled. You MUST:

DESIGN SYSTEM - TYPOGRAPHY (CRITICAL):
- H1 (Main Titles): Use "text-7xl" or "text-6xl" (64-72px) with "font-bold" - for hero titles on title slides
- H2 (Section Titles): Use "text-5xl" or "text-4xl" (36-48px) with "font-bold" - for major section headings
- H3 (Subsection Titles): Use "text-3xl" or "text-2xl" (24-30px) with "font-semibold" - for subsections
- Body Text: Use "text-xl" or "text-lg" (18-20px) with "font-normal" - for paragraphs and descriptions
- Small Text: Use "text-sm" or "text-base" (14-16px) with "font-normal" - for captions and metadata
- ALWAYS maintain proper hierarchy: H1 > H2 > H3 > Body > Small
- Use "leading-relaxed" or "leading-loose" for better readability on body text
- Use "tracking-tight" for large headings, "tracking-normal" for body

DESIGN SYSTEM - LAYOUT (CRITICAL):
- Container Spacing: Use "p-8", "p-12", or "p-16" for main containers, "px-6 py-4" for smaller elements
- Centered Content: MANDATORY STRUCTURE for centered content:
  * Root slide container: "relative w-full h-screen overflow-hidden"
  * Content wrapper: "absolute inset-0 flex flex-col items-center justify-center" - THIS IS REQUIRED for all slides
  * Inner content container: "max-w-5xl mx-auto text-center" or "max-w-4xl mx-auto" for text content
  * CRITICAL: Every slide MUST have the content wrapper with "flex flex-col items-center justify-center" to ensure proper centering
- Text Containers: Use "max-w-4xl" or "max-w-5xl" with "mx-auto" for readable text widths
- Element Gaps: Use "gap-4", "gap-6", or "gap-8" between related elements
- Grid Layouts: Use "grid grid-cols-2" or "grid grid-cols-3" with "gap-6" for multi-column content
- Alignment: Use "text-center" for titles, "text-left" for body text in containers
- Responsive: Use "px-4 md:px-8 lg:px-12" for responsive padding
- Vertical Spacing: Use "mb-4", "mb-6", "mb-8" for spacing between elements
- Full Height: Use "h-screen" or "h-full" for full-slide layouts - CRITICAL: Root slide container MUST use "relative w-full h-screen" or "absolute inset-0" to fill viewport properly in fullscreen
- Viewport Sizing: Root slide div should use "relative w-full h-screen overflow-hidden" to ensure proper fullscreen sizing

DESIGN SYSTEM - COLORS (CRITICAL - CONSISTENCY REQUIRED):
- COLOR CONSISTENCY RULE: Choose ONE color scheme for the ENTIRE presentation and maintain it across ALL slides:
  * Option A (Dark Theme): Dark backgrounds (bg-gradient-to-br from-purple-900/90 to-indigo-900/90) with white text (text-white) - USE THIS FOR ALL SLIDES
  * Option B (Light Theme): Light backgrounds (bg-gradient-to-br from-blue-50 to-purple-50) with dark text (text-gray-900) - USE THIS FOR ALL SLIDES
  * DO NOT mix dark and light themes - pick one and stick with it throughout the presentation
- Background Gradients: Use consistent gradient direction and colors across slides (e.g., if slide 1 uses "from-purple-600 to-indigo-600", use similar purple/indigo gradients on all slides)
- Text Colors: MANDATORY - If using dark backgrounds, ALL text must be "text-white" or "text-white/90". If using light backgrounds, ALL text must be "text-gray-900" or "text-gray-800"
- Accent Colors: Use consistent accent colors (e.g., if slide 1 uses "text-purple-300", use purple accents throughout)
- Opacity Hierarchy: Use "text-white/90" for primary text, "text-white/80" for secondary, "text-white/60" for tertiary (on dark backgrounds)
- Contrast: ALWAYS ensure WCAG AA contrast (4.5:1 ratio) - test dark text on light backgrounds and vice versa
- Overlay Colors: Use consistent overlay opacity (e.g., if slide 1 uses "bg-black/70", use similar opacity on all slides with overlays)
- Border Colors: Use "border-white/20" for dark themes, "border-gray-300" for light themes - keep consistent

DESIGN SYSTEM - ANIMATIONS (CRITICAL):
- Entrance Animations: Add to ALL elements - "animate-slide-in-up", "animate-fade-in-scale", "animate-zoom-in"
- Staggered Delays: Use "delay-100", "delay-200", "delay-300" for sequential element appearances
- Auto-Playing: Add "animate-pulse", "animate-float", "animate-glow" to key elements for visual interest
- Fragment Animations: Combine with Reveal.js fragments - "fragment fade-up animate-slide-in-up delay-100"
- Animation Variety: Mix different entrance animations (slide-in-up, fade-in-scale, zoom-in) across elements
- Smooth Transitions: All animations use ease-out timing for professional feel

DESIGN SYSTEM - ICONS (CRITICAL - USE INSTEAD OF EMOJIS):
- NEVER use emojis (🌙, 🎯, 👽, 💉, 📡, etc.) - they look unprofessional
- ALWAYS use Lucide icons via the "icon" element: icon { content = "IconName"; classes = "w-8 h-8 text-white"; }
- Available icons: Brain, Target, Users, Moon, Rocket, Satellite, Search, Eye, Building, Syringe, Zap, AlertTriangle, Check, Globe, Lightbulb, TrendingUp, Shield, Heart, Star, Book, GraduationCap, Flask, Microscope, Atom
- Icon sizing: Use classes like "w-6 h-6", "w-8 h-8", "w-12 h-12" for different sizes
- Icon colors: Use "text-white", "text-purple-300", "text-cyan-300" etc. to match your color scheme
- Icon placement: Use flex containers with "items-center gap-3" to align icons with text
- Example: icon { content = "Brain"; classes = "w-8 h-8 text-purple-300 animate-zoom-in delay-100"; }
- For lists: Use icons before text items, e.g., div { classes = "flex items-center gap-3"; children = [ icon { content = "Target"; classes = "w-5 h-5 text-white"; }; p { content = "Item text"; ... } ] }

1. SLIDE TRANSITIONS:
   - Add data-transition attribute to each SLIDE: "slide", "fade", "zoom", "convex", "concave", "none"
   - Vary transitions for visual interest (don't use the same transition for all slides)
   - Add data-background-transition for background effects when using backgrounds
   - Example: SLIDE { data-transition = "fade"; data-background-transition = "zoom"; ... }

2. FRAGMENTS (Progressive Reveals):
   - Use fragments extensively for step-by-step reveals
   - Add "fragment" class to elements that should appear progressively
   - Use data-fragment-index for ordering (0, 1, 2, ...)
   - Fragment types: "fade-in", "fade-out", "fade-up", "fade-down", "fade-left", "fade-right", "zoom-in", "zoom-out", "highlight-red", "highlight-blue", "highlight-green"
   - Example: div { classes = "fragment fade-up"; data-fragment-index = "0"; ... }

3. CODE BLOCKS (ONLY for technical/programming topics):
   - ONLY include code examples if the topic is about programming, software development, algorithms, APIs, or technical implementation
   - DO NOT include code blocks for general topics like animals, nature, history, business, marketing, etc.
   - If the topic is technical/programming-related:
     - Wrap code in pre and code elements with language class
     - Add data-line-numbers for step-by-step highlighting
     - Use format: "3-5|8-10|13-15" to highlight lines in sequence
     - Example structure: pre { code { classes = "language-javascript"; data-line-numbers = "1-3|5-7"; content = "const x = 1;\\nconst y = 2;"; } }
     - Support languages: javascript, python, java, cpp, html, css, json, typescript, go, rust, php, ruby, etc.
     - Use fragments with code blocks to reveal code line-by-line
   - For non-technical topics, focus on images, text, and visual content instead

4. MATH EQUATIONS (Include when relevant):
   - Use LaTeX syntax for equations when presenting mathematical concepts, formulas, or data analysis
   - Inline math: $E = mc^2$ or block math: $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$
   - Wrap in proper math containers (span for inline, div for block)
   - Example: span { classes = "math"; content = "$E = mc^2$"; } or div { classes = "math"; content = "$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$"; }
   - Use MathJax-compatible LaTeX syntax
   - Include equations when explaining scientific, mathematical, or statistical concepts

5. AUTO-ANIMATE:
   - Use data-auto-animate on slides for smooth transitions
   - Match element IDs/classes between slides for auto-animation
   - Add data-auto-animate-id for matching elements across slides

6. SPEAKER NOTES:
   - Add aside elements with class "notes" for speaker notes when relevant
   - Include helpful talking points and explanations
   - Example: aside { classes = "notes"; content = "Speaker note text"; }

7. BACKGROUNDS & TEXT VISIBILITY (CRITICAL):
   - Use data-background attributes for slide backgrounds
   - data-background-color, data-background-image, data-background-video
   - data-background-size, data-background-position, data-background-repeat
   - Example: SLIDE { data-background-image = "url"; data-background-size = "cover"; ... }
   - CRITICAL: When using background images, ALWAYS add a semi-transparent overlay div behind text for readability
   - ALWAYS wrap text content in a container with: "bg-black/60" or "bg-white/80" or "bg-gray-900/70" for dark overlays, or "bg-white/90" for light overlays
   - ALWAYS use high-contrast text colors: "text-white" for dark backgrounds, "text-gray-900" for light backgrounds
   - ALWAYS add text shadows: "text-shadow-lg" or "drop-shadow-lg" or use Tailwind's shadow utilities
   - Use backdrop-blur-sm or backdrop-blur-md for better text readability over images
   - Example structure: div { classes = "bg-black/60 backdrop-blur-sm p-8 rounded-xl"; children = [ h1 { classes = "text-white text-shadow-lg"; ... } ] }
   - NEVER place text directly over background images without an overlay or high-contrast background

8. ANIMATION CLASSES & CSS ANIMATIONS:
   - Use Reveal.js fragment classes: "fragment fade-up", "fragment zoom-in", etc.
   - ADD CSS animation classes to ALL elements: "animate-slide-in-up", "animate-fade-in-scale", "animate-zoom-in"
   - Use animation delays for staggered effects: "delay-100", "delay-200", "delay-300"
   - Add auto-playing animations: "animate-pulse", "animate-float", "animate-glow" for visual interest
   - Combine fragments with CSS animations: "fragment fade-up animate-slide-in-up delay-100"
   - Example: h1 { classes = "text-7xl font-bold text-white animate-slide-in-up delay-100 fragment fade-up"; ... }

9. STRUCTURE:
   - Ensure fullscreen compatibility
   - Use semantic HTML (h1, h2, h3, p, ul, ol, etc.)
   - Proper heading hierarchy
   - Accessible markup

10. INTERACTIVE ELEMENTS:
    - Add data-state for custom states if needed
    - Use data-markdown for markdown content if applicable
    - Consider adding interactive elements where appropriate

You MUST create a presentation following the outline above. The presentation is about: ${prompt}

IMPORTANT: Follow the outline structure exactly. For each slide in the outline:
- Use the specified transition type
- Include the key points listed
- Add the visual elements described
- ${experimentalMode ? 'ONLY include code blocks if the outline says "needsCode: true" for that slide' : ''}
- ${experimentalMode ? 'ONLY include math equations if the outline says "needsMath: true" for that slide' : ''}
- Use fragments as planned in the outline
- Add speaker notes where specified

Please respond with a custom DSL format exactly like this:

        PRESENTATION {
   id = "presentation-id";
   title = "Presentation Title";
  slides = [
    SLIDE {
       data-transition = "fade";
      div {
        classes = "relative w-full h-screen overflow-hidden";
        children = [
          img {
             content = "Image URL";
            classes = "absolute inset-0 w-full h-full object-cover";
          };
          div {
            classes = "absolute inset-0 bg-gradient-to-br from-black/70 to-black/50";
          };
          div {
            classes = "absolute inset-0 flex flex-col items-center justify-center";
            children = [
              div {
                classes = "bg-black/70 backdrop-blur-md p-12 rounded-xl border border-white/20 max-w-5xl mx-auto text-center animate-fade-in-scale delay-100";
                children = [
                  h1 {
                    classes = "text-white text-7xl font-bold mb-6 drop-shadow-2xl fragment fade-up animate-slide-in-up delay-200";
                    data-fragment-index = "0";
                    content = "Title";
                  };
                  p {
                    classes = "text-white/90 text-xl font-normal leading-relaxed fragment fade-up animate-slide-in-up delay-300";
                    data-fragment-index = "1";
                    content = "Subtitle or description text";
                  };
                ];
              };
            ];
          };
        ];
      };
     }
   ];
};

CRITICAL STRUCTURE NOTES:
- Every slide MUST have: Root div with "relative w-full h-screen overflow-hidden"
- Then a content wrapper with "absolute inset-0 flex flex-col items-center justify-center" - this ensures centering
- Then inner content containers with "max-w-5xl mx-auto" for proper width and centering
- ALL slides must use the SAME color scheme (all dark with white text, OR all light with dark text)

DSL RULES:
1. Use standard Tailwind CSS classes for styling.
2. For images, use Unsplash URLs that match the content.
3. Structure keys (id, title, classes, content, data-transition, data-fragment-index, etc.) must be unquoted.
4. String values must be double-quoted.
5. Create 5-8 slides with engaging layouts and varied transitions.
6. Return ONLY the DSL string, starting with PRESENTATION {.
7. TYPOGRAPHY: Follow font size hierarchy - H1: text-7xl/text-6xl, H2: text-5xl/text-4xl, H3: text-3xl/text-2xl, Body: text-xl/text-lg
8. LAYOUT: Use proper spacing (p-8, p-12, p-16), max-widths (max-w-4xl, max-w-5xl), gaps (gap-4, gap-6, gap-8), and responsive padding
9. COLORS: Use gradient backgrounds, proper text colors (text-white on dark, text-gray-900 on light), accent colors for highlights
10. ANIMATIONS: Add entrance animations (animate-slide-in-up, animate-fade-in-scale, animate-zoom-in) to ALL elements with delays (delay-100, delay-200, delay-300)
11. CRITICAL TEXT VISIBILITY RULES:
   - ALWAYS wrap text in containers with semi-transparent backgrounds (bg-black/60, bg-white/90, etc.) when using background images
   - ALWAYS use high-contrast text colors: text-white for dark overlays, text-gray-900 for light overlays
   - ALWAYS add text shadows or drop shadows: drop-shadow-lg, drop-shadow-2xl, or text-shadow-lg
   - ALWAYS use backdrop-blur (backdrop-blur-sm, backdrop-blur-md) for better readability
   - NEVER place text directly over background images without an overlay container
   - Use rounded corners and borders for text containers: rounded-xl, border, border-white/20
   - Ensure text has sufficient padding: p-8, p-12, px-6, py-4
12. ICONS (MANDATORY - NO EMOJIS):
   - NEVER use emojis - they look unprofessional and inconsistent
   - ALWAYS use Lucide icons via: icon { content = "IconName"; classes = "w-8 h-8 text-white"; }
   - Common icons: Brain (for psychology/thinking), Target (for goals/focus), Users (for groups/people), Moon (for space/night), Rocket (for innovation), Satellite (for technology), Search (for discovery), Eye (for vision/awareness), Building (for institutions), Syringe (for health/medicine), Zap (for energy/power), AlertTriangle (for warnings), Check (for success/completion), Globe (for world/internet), Lightbulb (for ideas), Shield (for protection/security), Heart (for love/care), Star (for excellence/rating), Book (for knowledge/education)
   - Size icons appropriately: "w-5 h-5" for small, "w-6 h-6" for medium, "w-8 h-8" for large, "w-12 h-12" for extra large
   - Use icons in lists, feature cards, and as visual accents - they make presentations more professional
   - Example list item: div { classes = "flex items-center gap-3"; children = [ icon { content = "Check"; classes = "w-5 h-5 text-green-400"; }; p { content = "List item text"; ... } ] }
13. Use fragments extensively for progressive reveals combined with CSS animations.
13. Vary transitions between slides (slide, fade, zoom, etc.).
14. Include code blocks with syntax highlighting when explaining technical concepts.
15. Add speaker notes where helpful.
16. Make presentations engaging with entrance animations, auto-playing animations, and interactive elements.
17. ALWAYS add animations to elements - mix animate-slide-in-up, animate-fade-in-scale, animate-zoom-in with appropriate delays.

CRITICAL GENERATION RULES:
- COLOR CONSISTENCY IS MANDATORY: Choose ONE color scheme (dark OR light) and use it for ALL slides. DO NOT mix themes.
- CENTERING IS MANDATORY: Every slide MUST use "absolute inset-0 flex flex-col items-center justify-center" wrapper to ensure proper centering
- NO EMOJIS - NEVER use emojis (🌙, 🎯, 👽, 💉, 📡, 🧠, ⚡, ⚠️, ✓, 🌍, 🔍, 🕵️, 🏛️, etc.) - they look unprofessional and inconsistent
- ALWAYS use Lucide icons instead: icon { content = "IconName"; classes = "w-6 h-6 text-white"; }
- TEXT VISIBILITY IS MANDATORY: Every slide with a background image MUST have text wrapped in a semi-transparent overlay container (bg-black/60, bg-white/90, etc.) with backdrop-blur and text shadows
- ALWAYS ensure text contrast: Use text-white on dark overlays, text-gray-900 on light overlays - and maintain this consistently across ALL slides
- ALWAYS add drop shadows to text: drop-shadow-lg or drop-shadow-2xl classes
- NEVER place text directly over background images - always use an overlay container
- ONLY include code blocks if the topic is explicitly about programming, software, or technical implementation
- DO NOT add code blocks to general topics (animals, nature, history, business, etc.) - use images and text instead
- When generating code examples (for technical topics only), use proper code blocks with syntax highlighting and data-line-numbers
- When showing step-by-step processes, use fragments extensively with proper data-fragment-index ordering
- Make presentations engaging with varied transitions and animations
- Include math equations ONLY when explaining mathematical, scientific, or statistical concepts (not for general topics)
- Use speaker notes (aside with class "notes") to provide additional context and talking points
- Vary slide transitions to keep the presentation visually interesting
- Use auto-animate for smooth transitions between similar slides
- Combine fragments with animations for maximum engagement
- For non-technical topics: Focus on beautiful images, engaging text, and visual storytelling
- NEVER use emojis - always use professional Lucide icons via the icon element

Remember: This is a Reveal.js presentation with ALL features enabled. Use the right features for the right content - code for technical topics, visuals for general topics! TEXT MUST ALWAYS BE READABLE! NO EMOJIS - USE ICONS INSTEAD! MAINTAIN COLOR CONSISTENCY ACROSS ALL SLIDES! ENSURE PROPER CENTERING ON EVERY SLIDE!`;
                    } else {
                        // Normal mode prompt, incorporating the outline
                        dslPrompt = `You are an expert presentation designer specializing in creating beautiful, engaging presentations using a custom Domain-Specific Language (DSL).

PRESENTATION OUTLINE:
Title: ${outline.title}
${outlineSummary}

You MUST create a presentation following the outline above. The presentation is about: ${prompt}

DESIGN SYSTEM - TYPOGRAPHY (CRITICAL):
- H1 (Main Titles): Use "text-7xl" or "text-6xl" (64-72px) with "font-bold" - for hero titles on title slides
- H2 (Section Titles): Use "text-5xl" or "text-4xl" (36-48px) with "font-bold" - for major section headings
- H3 (Subsection Titles): Use "text-3xl" or "text-2xl" (24-30px) with "font-semibold" - for subsections
- Body Text: Use "text-xl" or "text-lg" (18-20px) with "font-normal" - for paragraphs and descriptions
- Small Text: Use "text-sm" or "text-base" (14-16px) with "font-normal" - for captions and metadata
- ALWAYS maintain proper hierarchy: H1 > H2 > H3 > Body > Small
- Use "leading-relaxed" or "leading-loose" for better readability on body text

DESIGN SYSTEM - LAYOUT (CRITICAL):
- Container Spacing: Use "p-8", "p-12", or "p-16" for main containers, "px-6 py-4" for smaller elements
- Centered Content: MANDATORY STRUCTURE for centered content:
  * Root slide container: "relative w-full h-screen overflow-hidden"
  * Content wrapper: "absolute inset-0 flex flex-col items-center justify-center" - THIS IS REQUIRED for all slides
  * Inner content container: "max-w-5xl mx-auto text-center" or "max-w-4xl mx-auto" for text content
  * CRITICAL: Every slide MUST have the content wrapper with "flex flex-col items-center justify-center" to ensure proper centering
- Text Containers: Use "max-w-4xl" or "max-w-5xl" with "mx-auto" for readable text widths
- Element Gaps: Use "gap-4", "gap-6", or "gap-8" between related elements
- Grid Layouts: Use "grid grid-cols-2" or "grid grid-cols-3" with "gap-6" for multi-column content
- Alignment: Use "text-center" for titles, "text-left" for body text in containers
- Responsive: Use "px-4 md:px-8 lg:px-12" for responsive padding
- Vertical Spacing: Use "mb-4", "mb-6", "mb-8" for spacing between elements

DESIGN SYSTEM - COLORS (CRITICAL - CONSISTENCY REQUIRED):
- COLOR CONSISTENCY RULE: Choose ONE color scheme for the ENTIRE presentation and maintain it across ALL slides:
  * Option A (Dark Theme): Dark backgrounds (bg-gradient-to-br from-purple-900/90 to-indigo-900/90) with white text (text-white) - USE THIS FOR ALL SLIDES
  * Option B (Light Theme): Light backgrounds (bg-gradient-to-br from-blue-50 to-purple-50) with dark text (text-gray-900) - USE THIS FOR ALL SLIDES
  * DO NOT mix dark and light themes - pick one and stick with it throughout the presentation
- Background Gradients: Use consistent gradient direction and colors across slides (e.g., if slide 1 uses "from-purple-600 to-indigo-600", use similar purple/indigo gradients on all slides)
- Text Colors: MANDATORY - If using dark backgrounds, ALL text must be "text-white" or "text-white/90". If using light backgrounds, ALL text must be "text-gray-900" or "text-gray-800"
- Accent Colors: Use consistent accent colors (e.g., if slide 1 uses "text-purple-300", use purple accents throughout)
- Opacity Hierarchy: Use "text-white/90" for primary text, "text-white/80" for secondary, "text-white/60" for tertiary (on dark backgrounds)
- Contrast: ALWAYS ensure WCAG AA contrast (4.5:1 ratio)
- Overlay Colors: Use consistent overlay opacity (e.g., if slide 1 uses "bg-black/70", use similar opacity on all slides with overlays)

DESIGN SYSTEM - ANIMATIONS (CRITICAL):
- Entrance Animations: Add to ALL elements - "animate-slide-in-up", "animate-fade-in-scale", "animate-zoom-in"
- Staggered Delays: Use "delay-100", "delay-200", "delay-300" for sequential element appearances
- Auto-Playing: Add "animate-pulse", "animate-float", "animate-glow" to key elements for visual interest
- Animation Variety: Mix different entrance animations (slide-in-up, fade-in-scale, zoom-in) across elements

Please respond with a custom DSL format exactly like this (NOTE THE MANDATORY CENTERING STRUCTURE):

        PRESENTATION {
           id = "presentation-id";
           title = "Presentation Title";
  slides = [
    SLIDE {
      div {
        classes = "relative w-full h-screen overflow-hidden";
        children = [
          img {
            content = "Image URL";
            classes = "absolute inset-0 w-full h-full object-cover";
          };
          div {
            classes = "absolute inset-0 bg-gradient-to-br from-black/70 to-black/50";
          };
          div {
            classes = "absolute inset-0 flex flex-col items-center justify-center";
            children = [
              div {
                classes = "bg-black/70 backdrop-blur-md p-12 rounded-xl border border-white/20 max-w-5xl mx-auto text-center animate-fade-in-scale delay-100";
                children = [
                  h1 {
                    classes = "text-white text-7xl font-bold mb-6 drop-shadow-2xl animate-slide-in-up delay-200";
                    content = "Title";
                  };
                  p {
                    classes = "text-white/90 text-xl font-normal leading-relaxed animate-slide-in-up delay-300";
                    content = "Subtitle or description text";
                  };
                ];
              };
            ];
          };
        ];
      };
    }
  ];
};

CRITICAL STRUCTURE NOTES:
- Every slide MUST have: Root div with "relative w-full h-screen overflow-hidden"
- Then a content wrapper with "absolute inset-0 flex flex-col items-center justify-center" - this ensures centering
- Then inner content containers with "max-w-5xl mx-auto" for proper width and centering
- ALL slides must use the SAME color scheme (all dark with white text, OR all light with dark text)

Rules:
1. Use standard Tailwind CSS classes for styling.
2. For images, use Unsplash URLs that match the content.
3. Structure keys (id, title, classes, content) must be unquoted.
4. String values must be double-quoted.
5. Create 5-6 slides with engaging layouts.
6. Use appropriate padding and text colors so that presentation look good on all screens and all themes on device
6. Return ONLY the DSL string, starting with PRESENTATION {.
7. TYPOGRAPHY: Follow font size hierarchy - H1: text-7xl/text-6xl, H2: text-5xl/text-4xl, H3: text-3xl/text-2xl, Body: text-xl/text-lg
8. LAYOUT (MANDATORY): 
   - EVERY slide MUST use this structure: Root div "relative w-full h-screen overflow-hidden" → Content wrapper "absolute inset-0 flex flex-col items-center justify-center" → Inner container "max-w-5xl mx-auto"
   - This ensures ALL content is properly centered on every slide
   - Use proper spacing (p-8, p-12, p-16), max-widths (max-w-4xl, max-w-5xl), gaps (gap-4, gap-6, gap-8), and responsive padding
9. COLORS (MANDATORY CONSISTENCY):
   - Choose ONE color scheme for the ENTIRE presentation (all dark OR all light)
   - If dark theme: ALL slides use dark backgrounds (bg-gradient-to-br from-purple-900/90 to-indigo-900/90) with white text (text-white)
   - If light theme: ALL slides use light backgrounds (bg-gradient-to-br from-blue-50 to-purple-50) with dark text (text-gray-900)
   - DO NOT mix themes - maintain consistency across all slides
   - Use consistent accent colors throughout (e.g., if slide 1 uses purple accents, use purple on all slides)
10. ANIMATIONS: Add entrance animations (animate-slide-in-up, animate-fade-in-scale, animate-zoom-in) to ALL elements with delays (delay-100, delay-200, delay-300)
11. CRITICAL TEXT VISIBILITY RULES (MANDATORY):
   - ALWAYS wrap text in containers with semi-transparent backgrounds (bg-black/60, bg-white/90, etc.) when using background images
   - ALWAYS use high-contrast text colors: text-white for dark overlays, text-gray-900 for light overlays
   - ALWAYS add text shadows: drop-shadow-lg, drop-shadow-2xl, or text-shadow-lg
   - ALWAYS use backdrop-blur (backdrop-blur-sm, backdrop-blur-md) for better readability
   - NEVER place text directly over background images without an overlay container
   - Use rounded corners and borders for text containers: rounded-xl, border, border-white/20
   - Ensure text has sufficient padding: p-8, p-12, px-6, py-4
   - Text must ALWAYS be readable - if background is light, use dark text; if background is dark, use light text
12. ALWAYS add animations to elements - mix animate-slide-in-up, animate-fade-in-scale, animate-zoom-in with appropriate delays for professional feel
13. CENTERING RULE: Every slide's content wrapper MUST include "flex flex-col items-center justify-center" to ensure proper vertical and horizontal centering

`;
                    }

                    // Start streaming DSL generation from Gemini
                    console.log('🤖 [BACKEND] Calling Gemini API for DSL generation, prompt length:', dslPrompt.length);
                    console.log('🔑 [BACKEND] API Key present:', !!process.env.GOOGLE_GEMINI_API_KEY);
                    const result = await geminiModel.generateContentStream(dslPrompt);
                    console.log('✅ [BACKEND] Gemini stream started, result:', {
                        hasStream: !!result.stream,
                        streamType: typeof result.stream
                    });
                    
                    let chunkCount = 0;
                    let fullTextBuffer = '';
                    let inSlidesArray = false;
                    let slidesArrayContent = '';
                    let currentSlideDSL = '';
                    let slideIndex = -1;
                    let slideDepth = 0;
                    let lastSentLength = 0;
                    
                    // Process each chunk as it arrives
                    for await (const chunk of result.stream) {
                        chunkCount++;
                        console.log(`📦 [BACKEND] Chunk #${chunkCount} received:`, {
                            chunkType: typeof chunk,
                            hasText: typeof (chunk as any).text === 'function',
                            hasTextDelta: !!(chunk as any).textDelta,
                            hasCandidates: !!(chunk as any).candidates
                        });
                        // Extract text from chunk
                        // Gemini SDK chunks have a text() method or textDelta property
                        let chunkText = '';
                        try {
                            if (typeof chunk === 'string') {
                                chunkText = chunk;
                            } else if (typeof (chunk as any).text === 'function') {
                                chunkText = (chunk as any).text();
                            } else if ((chunk as any).textDelta) {
                                chunkText = (chunk as any).textDelta;
                            } else if ((chunk as any).candidates?.[0]?.content?.parts?.[0]?.text) {
                                chunkText = (chunk as any).candidates[0].content.parts[0].text;
                            }
                        } catch (e) {
                            console.error('❌ [BACKEND] Error extracting text from chunk:', e);
                            continue;
                        }
                        
                        if (!chunkText) {
                            console.log(`⚠️ [BACKEND] Chunk #${chunkCount} has no text, skipping`);
                            continue;
                        }
                        
                        console.log(`📝 [BACKEND] Chunk #${chunkCount} text length:`, chunkText.length, 'First 50 chars:', chunkText.substring(0, 50));
                        fullDSL += chunkText;
                        fullTextBuffer += chunkText;

                        // Find slides array start
                        if (!inSlidesArray) {
                            const slidesStart = fullTextBuffer.indexOf('slides = [');
                            if (slidesStart !== -1) {
                                inSlidesArray = true;
                                slidesArrayContent = fullTextBuffer.substring(slidesStart + 'slides = ['.length);
                                console.log('📋 [BACKEND] Found slides array start, remaining:', slidesArrayContent.substring(0, 100));
                            } else {
                                continue; // Still waiting for slides array
                            }
                        } else {
                            slidesArrayContent += chunkText;
                        }

                        // Process slides array content to track slides
                        if (inSlidesArray && slidesArrayContent) {
                            let i = lastSentLength;
                            while (i < slidesArrayContent.length) {
                                const char = slidesArrayContent[i];
                                const remaining = slidesArrayContent.substring(i);
                                
                                // Check for new slide
                                if (slideDepth === 0 && remaining.substring(0, 5) === 'SLIDE') {
                                    // If we had a previous slide, mark it as complete
                                    if (currentSlideDSL && slideIndex >= 0) {
                                        console.log(`✅ [BACKEND] Slide #${slideIndex} complete, sending final update`);
                                        sendEvent('dsl:update', {
                                            slideIndex: slideIndex,
                                            partialDsl: currentSlideDSL,
                                            isComplete: true,
                                        });
                                    }
                                    
                                    slideIndex++;
                                    currentSlideDSL = 'SLIDE';
                                    slideDepth = 0;
                                    i += 4; // Skip "SLIDE"
                                    console.log(`🆕 [BACKEND] Starting slide #${slideIndex}`);
                                    continue;
                                }
                                
                                if (currentSlideDSL) {
                                    currentSlideDSL += char;
                                    
                                    if (char === '{') {
                                        slideDepth++;
                                    } else if (char === '}') {
                                        slideDepth--;
                                        
                                        // If slide is complete
                                        if (slideDepth === 0) {
                                            console.log(`✅ [BACKEND] Slide #${slideIndex} complete, sending final update`);
                                            sendEvent('dsl:update', {
                                                slideIndex: slideIndex,
                                                partialDsl: currentSlideDSL,
                                                isComplete: true,
                                            });
                                            lastSentLength = i + 1;
                                            currentSlideDSL = '';
                                            i++;
                                            continue;
                                        }
                                    }
                                }
                                
                                i++;
                            }
                            
                            // Send incremental update with current partial DSL (if we have new content)
                            if (currentSlideDSL && slideIndex >= 0 && currentSlideDSL.length > lastSentLength) {
                                const newContent = currentSlideDSL.substring(lastSentLength);
                                if (newContent.length > 10) { // Only send if meaningful new content
                                    console.log(`🔄 [BACKEND] Sending incremental update for slide #${slideIndex}, new chars: ${newContent.length}`);
                                    sendEvent('dsl:update', {
                                        slideIndex: slideIndex,
                                        partialDsl: currentSlideDSL,
                                        isComplete: false,
                                    });
                                    lastSentLength = currentSlideDSL.length;
                                }
                            }
                        }
                    }
                    
                    // Send final update for any remaining slide
                    if (currentSlideDSL && slideIndex >= 0) {
                        console.log(`🏁 [BACKEND] Sending final update for slide #${slideIndex}`);
                        sendEvent('dsl:update', {
                            slideIndex: slideIndex,
                            partialDsl: currentSlideDSL,
                            isComplete: true,
                        });
                    }
                    
                    console.log(`🏁 [BACKEND] Stream ended. Total chunks: ${chunkCount}, Total DSL length: ${fullDSL.length}`);

                    // Extract the full DSL string
                    console.log('📋 [BACKEND] Extracting full DSL string, length:', fullDSL.length);
                    let dslString = '';
                    const dslMatch = fullDSL.match(/PRESENTATION\s*\{[\s\S]*\}$/);
            if (dslMatch) {
                dslString = dslMatch[0];
                        console.log('✅ [BACKEND] Found DSL via regex match');
            } else {
                        const start = fullDSL.indexOf("PRESENTATION {");
                if (start !== -1) {
                            dslString = fullDSL.substring(start);
                            console.log('✅ [BACKEND] Found DSL via indexOf, start position:', start);
                } else {
                            console.error('❌ [BACKEND] Failed to find PRESENTATION block in DSL');
                    throw new Error('Failed to parse presentation DSL');
                }
            }
                    console.log('📄 [BACKEND] Final DSL string length:', dslString.length);

                    // Process image fallbacks (validate and replace broken images)
                    console.log('🖼️ [BACKEND] Processing image fallbacks...');
                    sendEvent('progress', { message: 'Validating images...', stage: 'images' });
                    try {
                        dslString = await processImageFallback(dslString, outline);
                        console.log('✅ [BACKEND] Image fallback processing completed');
                    } catch (error) {
                        console.error('⚠️ [BACKEND] Image fallback processing failed, continuing with original DSL:', error);
                        // Don't block presentation generation if image fallback fails
                    }

                    // Add is_public flag logic determines strictly by tier/user choice handled above
                    const finalIsPublic = tierLimit.allowPrivate ? isPublic : true; // Enforce public if not allowed private
                    const presentationData = { dsl: dslString, is_public: finalIsPublic };

                    // Save to database
                    console.log('💾 [BACKEND] Saving to database...');
                    const titleMatch = dslString.match(/title\s*=\s*"([^"]*)"/);
                    const title = titleMatch ? titleMatch[1] : prompt;
                    console.log('📌 [BACKEND] Presentation title:', title);

                    const { data, error } = await supabase
                        .from('Presentation')
                        .insert([
                            {
                                presentation_data: presentationData,
                                prompts: [prompt],
                                owner_id: userId || '00000000-0000-0000-0000-000000000000',
                                is_public: finalIsPublic
                            }
                        ])
                        .select()
                        .single();

        if (error) {
                        console.error('❌ [BACKEND] Database error:', error);
                        sendEvent('error', { message: 'Failed to save presentation' });
                        controller.close();
                        return;
                    }

                    console.log('✅ [BACKEND] Presentation saved with ID:', data.presentation_id);

        // Create stats entry
        await supabase
            .from('PresentationStats')
            .insert([
                {
                    presentation_id: data.presentation_id,
                    likes: 0,
                }
            ]);
                    console.log('📊 [BACKEND] Stats entry created');

                    // Send completion event
                    console.log('🎉 [BACKEND] Sending completion event');
                    sendEvent('complete', {
                        presentation_id: data.presentation_id,
                        dsl: dslString,
                    });

                    console.log('✅ [BACKEND] Stream closed successfully');
                    controller.close();
                } catch (error) {
                    console.error('❌ [BACKEND] Error in streaming:', error);
                    console.error('❌ [BACKEND] Error details:', {
                        message: error instanceof Error ? error.message : 'Unknown error',
                        stack: error instanceof Error ? error.stack : undefined,
                        name: error instanceof Error ? error.name : undefined
                    });
                    sendEvent('error', { 
                        message: error instanceof Error ? error.message : 'Failed to generate presentation' 
                    });
                    controller.close();
                }
            },
        });

        // Return streaming response
        return new Response(stream, {
            headers: {
                'Content-Type': 'application/x-ndjson',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('❌ [BACKEND] Top-level error generating presentation:', error);
        console.error('❌ [BACKEND] Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        return NextResponse.json(
            { error: 'Failed to generate presentation' },
            { status: 500 }
        );
    }
}
