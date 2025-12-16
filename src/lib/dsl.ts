import { getIconSvg } from './icons';

export function dslToSlides(dsl: string): string[] {
    // Extract slides array content
    const slidesMatch = dsl.match(/slides\s*=\s*\[([\s\S]*)\]\s*;?\s*}\s*;?\s*$/);
    if (!slidesMatch) {
        // If no slides array structure, might be just a single slide or malformed.
        // However, the prompt ensures the structure. 
        // Return empty array or throw error? 
        // Let's try to be robust. 
        console.warn("Invalid DSL: slides array not found");
        return [];
    }

    const slidesContent = slidesMatch[1];

    // Split into individual SLIDE blocks and extract their attributes
    const slideBlocks: Array<{ content: string; attributes: Record<string, string> }> = [];
    let depth = 0;
    let currentSlide = "";
    let inSlide = false;

    for (let i = 0; i < slidesContent.length; i++) {
        const char = slidesContent[i];

        // Check if we're starting a SLIDE
        if (!inSlide && slidesContent.substring(i, i + 5) === "SLIDE") {
            inSlide = true;
            currentSlide = "SLIDE";
            i += 4; // Skip "SLIDE"
            continue;
        }

        if (inSlide) {
            if (char === "{") depth++;
            if (char === "}") depth--;

            currentSlide += char;

            if (depth === 0 && char === "}") {
                // Extract SLIDE-level attributes
                const slideAttrs: Record<string, string> = {};
                const dataAttrPattern = /(data-[a-zA-Z0-9-]+)\s*=\s*"([^"]*)"/g;
                let match;
                while ((match = dataAttrPattern.exec(currentSlide)) !== null) {
                    slideAttrs[match[1]] = match[2];
                }
                
                slideBlocks.push({ 
                    content: currentSlide.trim(), 
                    attributes: slideAttrs 
                });
                currentSlide = "";
                inSlide = false;
            }
        }
    }

    // Parse each slide block into HTML
    return slideBlocks.map((block) => {
        const slideContent = block.content.substring(block.content.indexOf("{") + 1, block.content.lastIndexOf("}"));
        
        // parseElement now skips data attributes automatically, so we can parse the entire content
        let html = parseElement(slideContent);
        
        // If html is still empty, log a warning with more details
        if (!html || html.trim().length === 0) {
            console.warn(`⚠️ [DSL] Slide content is empty after parsing.`);
            console.warn(`📄 [DSL] Original slide content (first 300 chars):`, slideContent.substring(0, 300));
            // Try to find what elements are in the content
            const elementMatches = slideContent.match(/([a-zA-Z0-9]+)\s*\{/g);
            if (elementMatches) {
                console.warn(`🔍 [DSL] Found potential elements:`, elementMatches);
            }
        }
        
        // Add SLIDE-level data attributes as data attributes in a wrapper div
        // This allows reveal-converter to extract them
        if (Object.keys(block.attributes).length > 0) {
            const attrsString = Object.entries(block.attributes)
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ');
            // Wrap in a div with the attributes so reveal-converter can find them
            html = `<div ${attrsString}>${html}</div>`;
        }
        
        return html;
    });
}

function parseElement(content: string): string {
    content = content.trim();
    let html = "";
    let i = 0;

    while (i < content.length) {
        // Skip whitespace
        while (i < content.length && /\s/.test(content[i])) i++;
        if (i >= content.length) break;

        // Check if this looks like a data attribute (data-xxx = "...")
        // If so, skip it - data attributes are handled separately at SLIDE level
        const remaining = content.substring(i);
        const dataAttrMatch = remaining.match(/^data-[a-zA-Z0-9-]+\s*=\s*"[^"]*"\s*;?\s*/);
        if (dataAttrMatch) {
            i += dataAttrMatch[0].length;
            continue;
        }

        // Parse tag name
        let tagStart = i;
        while (i < content.length && /[a-zA-Z0-9]/.test(content[i])) i++;
        const tag = content.substring(tagStart, i).toLowerCase();

        if (!tag) {
            i++;
            continue;
        }

        // Skip whitespace
        while (i < content.length && /\s/.test(content[i])) i++;

        // Expect opening brace
        if (content[i] !== "{") {
            i++;
            continue;
        }
        i++; // skip {

        // Find matching closing brace
        let braceDepth = 1;
        let innerStart = i;
        while (i < content.length && braceDepth > 0) {
            if (content[i] === "{") braceDepth++;
            if (content[i] === "}") braceDepth--;
            if (braceDepth > 0) i++;
        }

        const inner = content.substring(innerStart, i);
        i++; // skip }

        // Skip semicolon if present
        while (i < content.length && (content[i] === ";" || /\s/.test(content[i]))) i++;

        // Parse attributes from inner content
        const attrs = parseAttributes(inner);

        // Build HTML
        const selfClosing = ["img", "input", "br", "hr"];
        const classAttr = attrs.classes ? `class="${attrs.classes}"` : '';
        const dataAttrs = attrs.dataAttributes ? ` ${attrs.dataAttributes}` : '';
        
        // Handle icon element - convert to SVG
        if (tag === "icon") {
            const iconName = attrs.content || '';
            const iconSize = parseInt(attrs.dataAttributes?.match(/data-size="(\d+)"/)?.[1] || '24');
            const iconSvg = getIconSvg(iconName, attrs.classes || '', iconSize);
            html += iconSvg;
        } else if (selfClosing.includes(tag)) {
            // Handle images specifically to ensure they span properly
            const srcAttr = attrs.content ? `src="${attrs.content}"` : '';
            html += `<${tag} ${classAttr}${srcAttr}${dataAttrs} />`;
        } else {
            // For other elements, recursively add children
            html += `<${tag} ${classAttr}${dataAttrs}>${attrs.content || ""}${attrs.childrenHtml || ""}</${tag}>`;
        }
    };
    return html;
}

function parseAttributes(inner: string): { classes?: string; content?: string; childrenHtml?: string; dataAttributes?: string } {
    const attrs: { classes?: string; content?: string; childrenHtml?: string; dataAttributes?: string } = {};

    let attributeSearchSpace = inner;

    // Extract children array
    // We assume children is at the end of the block as per the DSL structure seen so far
    // and consistent with the previous regex anchor.
    // We extract it first and remove it to prevent 'content' regex from matching inside children.
    const childrenMatch = inner.match(/children\s*=\s*\[([\s\S]*)\]\s*;?\s*$/);
    if (childrenMatch) {
        const childrenContent = childrenMatch[1];
        attrs.childrenHtml = parseElement(childrenContent);

        // Remove the children block from the search space
        attributeSearchSpace = inner.replace(childrenMatch[0], "");
    }

    // Extract classes
    const classesMatch = attributeSearchSpace.match(/classes\s*=\s*"([^"]*)"/);
    if (classesMatch) attrs.classes = classesMatch[1];

    // Extract content
    const contentMatch = attributeSearchSpace.match(/content\s*=\s*"([^"]*)"/);
    if (contentMatch) attrs.content = contentMatch[1];

    // Extract all data-* attributes (for Reveal.js support)
    const dataAttributes: string[] = [];
    const dataAttrPattern = /(data-[a-zA-Z0-9-]+)\s*=\s*"([^"]*)"/g;
    let match;
    while ((match = dataAttrPattern.exec(attributeSearchSpace)) !== null) {
        dataAttributes.push(`${match[1]}="${match[2]}"`);
    }
    
    if (dataAttributes.length > 0) {
        attrs.dataAttributes = dataAttributes.join(' ');
    }

    return attrs;
}

/**
 * Parse a single element DSL to HTML
 * Used for streaming element-by-element rendering
 */
export function parseSingleElement(elementDsl: string): string {
    // Extract the element type and content
    const match = elementDsl.match(/^([a-zA-Z0-9]+)\s*\{([\s\S]*)\}\s*;?\s*$/);
    if (!match) return '';

    const elementType = match[1].toLowerCase();
    const inner = match[2].trim();
    const attrs = parseAttributes(inner);

    // Build HTML
    const selfClosing = ["img", "input", "br", "hr"];
    if (selfClosing.includes(elementType)) {
        return `<${elementType} class="${attrs.classes || ""}" src="${attrs.content || ""}" />`;
    } else {
        return `<${elementType} class="${attrs.classes || ""}" >${attrs.content || ""}${attrs.childrenHtml || ""}</${elementType}>`;
    }
}

// Helper to escape quotes in content
function escapeQuotes(str: string): string {
    return str.replace(/"/g, '\\"');
}

export function htmlToDsl(html: string): string {
    if (typeof window === 'undefined') return ""; // Client-side only

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const root = doc.body.firstElementChild;

    if (!root) return "";

    function elementToDsl(el: Element): string {
        const tagName = el.tagName.toLowerCase();
        const classes = el.className;

        let properties = "";

        if (classes) {
            properties += `classes = "${classes}"; `;
        }

        // Handle Image
        if (tagName === 'img') {
            const src = el.getAttribute('src');
            if (src) {
                properties += `content = "${src}"; `;
            }
        } else {
            // Check if we have children (elements or significant text)
            // We need to look at childNodes to capture text mixed with elements
            const hasComplexChildren = Array.from(el.childNodes).some(node =>
                node.nodeType === 1 || (node.nodeType === 3 && node.textContent?.trim())
            );

            if (hasComplexChildren) {
                // Determine if it's purely a single text node (simple content) or mixed/multiple
                const isSimpleText = el.childNodes.length === 1 && el.childNodes[0].nodeType === 3;

                if (isSimpleText) {
                    const text = el.textContent || "";
                    if (text.trim()) {
                        properties += `content = "${escapeQuotes(text)}"; `;
                    }
                } else {
                    // Mixed or multiple children
                    const childrenDsl = Array.from(el.childNodes)
                        .map(node => {
                            if (node.nodeType === 1) { // Element
                                return elementToDsl(node as Element);
                            } else if (node.nodeType === 3) { // Text
                                const text = node.textContent || "";
                                if (!text.trim()) return ""; // Skip whitespace
                                // Represent text node as a span if it's loose text?
                                // DSL might not support raw text in array. 
                                // We wrap it in a generic span or div without classes?
                                // Let's use span for inline text.
                                return `span { content = "${escapeQuotes(text)}"; }`;
                            }
                            return "";
                        })
                        .filter(Boolean)
                        .join(' ');

                    if (childrenDsl) {
                        properties += `children = [ ${childrenDsl} ]; `;
                    } else {
                        properties += `children = []; `;
                    }
                }
            } else {
                // Empty
                properties += `children = []; `;
            }
        }

        return `${tagName} { ${properties}};`;
    }

    return elementToDsl(root);
}

export function updateSlideInDsl(dsl: string, index: number, newSlideHtml: string): string {
    const newSlideDsl = htmlToDsl(newSlideHtml);
    if (!newSlideDsl) {
        console.warn("Failed to convert HTML to DSL", newSlideHtml);
        return dsl;
    }

    // We need to locate the Nth SLIDE block and replace it.
    // We can reuse the parsing logic logic to find offsets.

    const slidesMatch = dsl.match(/slides\s*=\s*\[([\s\S]*)\]\s*;?\s*}\s*;?\s*$/);
    if (!slidesMatch) return dsl;

    const slidesContent = slidesMatch[1];
    const slidesArrayStart = dsl.indexOf(slidesContent);

    // Iterate to find the start and end of the target slide
    let depth = 0;
    let slideCount = 0;
    let startIndex = -1;
    let endIndex = -1;
    let inSlide = false;
    let currentSlideStart = -1;

    for (let i = 0; i < slidesContent.length; i++) {
        if (!inSlide && slidesContent.substring(i, i + 5) === "SLIDE") {
            inSlide = true;
            currentSlideStart = i;
            i += 4;
            continue;
        }

        if (inSlide) {
            if (slidesContent[i] === "{") depth++;
            if (slidesContent[i] === "}") depth--;

            if (depth === 0 && slidesContent[i] === "}") {
                // End of a slide
                if (slideCount === index) {
                    startIndex = currentSlideStart;
                    endIndex = i + 1; // Include the closing brace
                    break;
                }
                slideCount++;
                inSlide = false;
            }
        }
    }

    if (startIndex !== -1 && endIndex !== -1) {
        const pre = slidesContent.substring(0, startIndex);
        const post = slidesContent.substring(endIndex);
        const newSlidesContent = pre + `SLIDE { ${newSlideDsl} }` + post;

        // Reconstruct the full DSL
        // Careful with where slidesContent came from. 
        // It's safer to replace the range in the original string provided we have exact match.
        // Or simpler: replace the slidesContent in the dsl string.
        return dsl.replace(slidesContent, newSlidesContent);
    }

    return dsl;
}
