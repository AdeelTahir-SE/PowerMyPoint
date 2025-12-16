/**
 * Converts DSL slides to Reveal.js format
 * Handles all Reveal.js attributes: data-transition, data-fragment-index, data-line-numbers, etc.
 */

/**
 * Extracts Reveal.js attributes from HTML string
 */
function extractRevealAttributes(html: string): {
    transition?: string;
    backgroundTransition?: string;
    autoAnimate?: boolean;
    background?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundVideo?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    state?: string;
    [key: string]: any;
} {
    const attrs: any = {};
    
    // Extract data-transition
    const transitionMatch = html.match(/data-transition\s*=\s*"([^"]*)"/i);
    if (transitionMatch) attrs.transition = transitionMatch[1];
    
    // Extract data-background-transition
    const bgTransitionMatch = html.match(/data-background-transition\s*=\s*"([^"]*)"/i);
    if (bgTransitionMatch) attrs.backgroundTransition = bgTransitionMatch[1];
    
    // Extract data-auto-animate
    if (html.includes('data-auto-animate')) attrs.autoAnimate = true;
    
    // Extract data-background-*
    const bgColorMatch = html.match(/data-background-color\s*=\s*"([^"]*)"/i);
    if (bgColorMatch) attrs.backgroundColor = bgColorMatch[1];
    
    const bgImageMatch = html.match(/data-background-image\s*=\s*"([^"]*)"/i);
    if (bgImageMatch) attrs.backgroundImage = bgImageMatch[1];
    
    const bgVideoMatch = html.match(/data-background-video\s*=\s*"([^"]*)"/i);
    if (bgVideoMatch) attrs.backgroundVideo = bgVideoMatch[1];
    
    const bgSizeMatch = html.match(/data-background-size\s*=\s*"([^"]*)"/i);
    if (bgSizeMatch) attrs.backgroundSize = bgSizeMatch[1];
    
    const bgPositionMatch = html.match(/data-background-position\s*=\s*"([^"]*)"/i);
    if (bgPositionMatch) attrs.backgroundPosition = bgPositionMatch[1];
    
    const bgRepeatMatch = html.match(/data-background-repeat\s*=\s*"([^"]*)"/i);
    if (bgRepeatMatch) attrs.backgroundRepeat = bgRepeatMatch[1];
    
    // Extract data-state
    const stateMatch = html.match(/data-state\s*=\s*"([^"]*)"/i);
    if (stateMatch) attrs.state = stateMatch[1];
    
    return attrs;
}

/**
 * Builds section tag with all Reveal.js attributes
 */
function buildSectionTag(slideHtml: string, defaultTransition: string = 'slide'): string {
    const attrs = extractRevealAttributes(slideHtml);
    
    // Remove data attributes from HTML content (they'll be on the section tag)
    let cleanHtml = slideHtml
        .replace(/data-transition\s*=\s*"[^"]*"/gi, '')
        .replace(/data-background-transition\s*=\s*"[^"]*"/gi, '')
        .replace(/data-auto-animate\s*/gi, '')
        .replace(/data-background-color\s*=\s*"[^"]*"/gi, '')
        .replace(/data-background-image\s*=\s*"[^"]*"/gi, '')
        .replace(/data-background-video\s*=\s*"[^"]*"/gi, '')
        .replace(/data-background-size\s*=\s*"[^"]*"/gi, '')
        .replace(/data-background-position\s*=\s*"[^"]*"/gi, '')
        .replace(/data-background-repeat\s*=\s*"[^"]*"/gi, '')
        .replace(/data-state\s*=\s*"[^"]*"/gi, '');
    
    // Build section attributes
    const sectionAttrs: string[] = [];
    
    if (attrs.transition) {
        sectionAttrs.push(`data-transition="${attrs.transition}"`);
    } else {
        sectionAttrs.push(`data-transition="${defaultTransition}"`);
    }
    
    if (attrs.backgroundTransition) {
        sectionAttrs.push(`data-background-transition="${attrs.backgroundTransition}"`);
    }
    
    if (attrs.autoAnimate) {
        sectionAttrs.push('data-auto-animate');
    }
    
    if (attrs.backgroundColor) {
        sectionAttrs.push(`data-background-color="${attrs.backgroundColor}"`);
    }
    
    if (attrs.backgroundImage) {
        sectionAttrs.push(`data-background-image="${attrs.backgroundImage}"`);
    }
    
    if (attrs.backgroundVideo) {
        sectionAttrs.push(`data-background-video="${attrs.backgroundVideo}"`);
    }
    
    if (attrs.backgroundSize) {
        sectionAttrs.push(`data-background-size="${attrs.backgroundSize}"`);
    }
    
    if (attrs.backgroundPosition) {
        sectionAttrs.push(`data-background-position="${attrs.backgroundPosition}"`);
    }
    
    if (attrs.backgroundRepeat) {
        sectionAttrs.push(`data-background-repeat="${attrs.backgroundRepeat}"`);
    }
    
    if (attrs.state) {
        sectionAttrs.push(`data-state="${attrs.state}"`);
    }
    
    return `<section ${sectionAttrs.join(' ')}>${cleanHtml}</section>`;
}

/**
 * Converts an array of HTML slide strings to Reveal.js HTML structure
 * Preserves all Reveal.js data attributes from the DSL
 * @param slides Array of HTML strings (one per slide)
 * @returns Complete Reveal.js HTML structure as string
 */
export function dslToRevealSlides(slides: string[]): string {
    if (slides.length === 0) {
        return '<div class="reveal"><div class="slides"><section>No slides available</section></div></div>';
    }

    // Convert each slide to Reveal.js section format
    // Vary transitions if not specified
    const transitions = ['slide', 'fade', 'zoom', 'convex', 'concave'];
    const sections = slides.map((slide, index) => {
        // Check if slide already has a transition specified
        const hasTransition = /data-transition\s*=/i.test(slide);
        const defaultTransition = hasTransition ? 'slide' : transitions[index % transitions.length];
        
        return buildSectionTag(slide, defaultTransition);
    }).join('\n');

    // Return complete Reveal.js structure
    return `<div class="reveal"><div class="slides">${sections}</div></div>`;
}

/**
 * Converts a single slide HTML to Reveal.js section format
 * @param slideHtml HTML content of a single slide
 * @param transition Transition type (default: 'slide')
 * @returns Reveal.js section HTML
 */
export function slideToRevealSection(slideHtml: string, transition: string = 'slide'): string {
    return buildSectionTag(slideHtml, transition);
}

