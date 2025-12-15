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

    // Split into individual SLIDE blocks
    const slideBlocks: string[] = [];
    let depth = 0;
    let currentSlide = "";
    let inSlide = false;

    for (let i = 0; i < slidesContent.length; i++) {
        const char = slidesContent[i];

        // Check if we're starting a SLIDE
        if (!inSlide && slidesContent.substring(i, i + 5) === "SLIDE") {
            inSlide = true;
            i += 4; // Skip "SLIDE"
            continue;
        }

        if (inSlide) {
            if (char === "{") depth++;
            if (char === "}") depth--;

            currentSlide += char;

            if (depth === 0 && char === "}") {
                slideBlocks.push(currentSlide.trim());
                currentSlide = "";
                inSlide = false;
            }
        }
    }

    // Parse each slide block into HTML
    return slideBlocks.map((block) => {
        const content = block.substring(block.indexOf("{") + 1, block.lastIndexOf("}"));
        return parseElement(content);
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

        // Parse tag name
        let tagStart = i;
        while (i < content.length && /[a-zA-Z0-9]/.test(content[i])) i++;
        const tag = content.substring(tagStart, i).toLowerCase();

        if (!tag) break;

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
        if (selfClosing.includes(tag)) {
            // Handle images specifically to ensure they span properly
            html += `<${tag} class="${attrs.classes || ""}" src="${attrs.content || ""}" />`;
        } else {
            // For other elements, recursively add children
            html += `<${tag} class="${attrs.classes || ""}" >${attrs.content || ""}${attrs.childrenHtml || ""}</${tag}>`;
        }
    };
    return html;
}

function parseAttributes(inner: string): { classes?: string; content?: string; childrenHtml?: string } {
    const attrs: { classes?: string; content?: string; childrenHtml?: string } = {};

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

    return attrs;
}
