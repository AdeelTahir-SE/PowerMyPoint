/**
 * Streaming DSL Parser
 * Parses incomplete DSL text chunks and detects complete elements and slides
 */

export interface CompleteElement {
    dsl: string;
    elementType: string;
    slideIndex: number;
    isSlideComplete: boolean;
}

export class StreamingDSLParser {
    private buffer: string = '';
    private inSlidesArray: boolean = false;
    private currentSlideBuffer: string = '';
    private slideIndex: number = -1;
    private inSlide: boolean = false;
    private slideDepth: number = 0;
    private elementDepth: number = 0;
    private inElement: boolean = false;
    private currentElement: string = '';
    private currentElementType: string = '';

    /**
     * Add a new chunk of text and process it
     * Returns array of newly completed elements
     */
    addChunk(chunk: string): CompleteElement[] {
        console.log(`🔍 [PARSER] Adding chunk, length: ${chunk.length}, buffer size before: ${this.buffer.length}`);
        this.buffer += chunk;
        const newCompleteElements: CompleteElement[] = [];

        // Find the start of slides array if we haven't already
        if (!this.inSlidesArray) {
            const slidesStart = this.buffer.indexOf('slides = [');
            if (slidesStart !== -1) {
                this.inSlidesArray = true;
                const afterSlidesStart = slidesStart + 'slides = ['.length;
                this.buffer = this.buffer.substring(afterSlidesStart);
            } else {
                return []; // Still waiting for slides array to start
            }
        }

        // Process the buffer to find complete elements and slides
        let processedUpTo = 0;
        let i = 0;
        
        while (i < this.buffer.length) {
            const char = this.buffer[i];
            const remaining = this.buffer.substring(i);

            // Check if we're starting a new SLIDE
            if (!this.inSlide && remaining.substring(0, 5) === 'SLIDE') {
                this.inSlide = true;
                this.slideIndex++;
                console.log(`🆕 [PARSER] Starting new slide #${this.slideIndex}`);
                this.currentSlideBuffer = 'SLIDE';
                this.slideDepth = 0;
                this.elementDepth = 0;
                i += 4; // Skip "SLIDE"
                continue;
            }

            if (this.inSlide) {
                this.currentSlideBuffer += char;

                // Track slide-level brace depth
                if (char === '{') {
                    this.slideDepth++;
                    
                    // Check if this might be the start of an element (not the SLIDE opening brace)
                    if (this.slideDepth > 1 && !this.inElement) {
                        // Look backwards to find element type (div, h1, p, img, etc.)
                        // We need to find the last word before this opening brace
                        const beforeBrace = this.currentSlideBuffer.substring(0, this.currentSlideBuffer.length - 1);
                        // Match element type followed by optional whitespace and optional previous brace
                        const elementMatch = beforeBrace.match(/([a-zA-Z0-9]+)\s*$/);
                        if (elementMatch) {
                            this.inElement = true;
                            this.currentElementType = elementMatch[1];
                            this.currentElement = this.currentElementType + '{';
                            this.elementDepth = 1;
                        }
                    } else if (this.inElement) {
                        // Nested brace inside element
                        this.elementDepth++;
                        this.currentElement += char;
                    }
                } else if (char === '}') {
                    this.slideDepth--;
                    
                    if (this.inElement) {
                        this.elementDepth--;
                        this.currentElement += char;
                        
                        // Check if element is complete (element depth back to 0)
                        if (this.elementDepth === 0) {
                            // Element is complete! Check for semicolon
                            let elementDsl = this.currentElement.trim();
                            
                            // Look ahead for semicolon (might be in next chunk, but try current buffer)
                            let j = i + 1;
                            while (j < this.buffer.length && /\s/.test(this.buffer[j])) {
                                j++; // Skip whitespace
                            }
                            if (j < this.buffer.length && this.buffer[j] === ';') {
                                elementDsl += ';';
                                i = j; // Skip to after semicolon
                            }
                            
                            if (elementDsl && this.currentElementType) {
                                console.log(`✅ [PARSER] Element complete: ${this.currentElementType} in slide #${this.slideIndex}, DSL length: ${elementDsl.length}`);
                                newCompleteElements.push({
                                    dsl: elementDsl,
                                    elementType: this.currentElementType,
                                    slideIndex: this.slideIndex,
                                    isSlideComplete: false,
                                });
                            } else {
                                console.log(`⚠️ [PARSER] Element complete but missing data:`, {
                                    hasDsl: !!elementDsl,
                                    hasType: !!this.currentElementType,
                                    dslLength: elementDsl?.length || 0
                                });
                            }
                            this.currentElement = '';
                            this.inElement = false;
                            this.currentElementType = '';
                        }
                    }
                    
                    // Check if slide is complete (slide depth back to 0)
                    if (this.slideDepth === 0) {
                        console.log(`🏁 [PARSER] Slide #${this.slideIndex} complete`);
                        // Mark the last element as slide-complete if we have one
                        if (newCompleteElements.length > 0) {
                            newCompleteElements[newCompleteElements.length - 1].isSlideComplete = true;
                            console.log(`✅ [PARSER] Marked last element as slide-complete`);
                        }
                        processedUpTo = i + 1;
                        this.currentSlideBuffer = '';
                        this.inSlide = false;
                        this.elementDepth = 0;
                        this.inElement = false;
                        this.currentElement = '';
                        this.currentElementType = '';
                    }
                } else if (this.inElement) {
                    this.currentElement += char;
                }
            }

            i++;
        }

        // Remove processed content from buffer
        if (this.inSlide) {
            // Keep the current incomplete slide in buffer
            const slideStart = this.buffer.lastIndexOf('SLIDE', processedUpTo);
            if (slideStart >= 0) {
                this.buffer = this.buffer.substring(slideStart);
            } else {
                this.buffer = this.currentSlideBuffer;
            }
        } else {
            this.buffer = this.buffer.substring(processedUpTo);
        }

        console.log(`📊 [PARSER] Chunk processed. Found ${newCompleteElements.length} elements. Buffer size after: ${this.buffer.length}, inSlide: ${this.inSlide}, inElement: ${this.inElement}`);
        return newCompleteElements;
    }

    /**
     * Get the remaining buffer (partial content still being built)
     */
    getRemainingBuffer(): string {
        return this.buffer;
    }

    /**
     * Check if we're currently inside a slide
     */
    isInSlide(): boolean {
        return this.inSlide;
    }

    /**
     * Get current slide index
     */
    getCurrentSlideIndex(): number {
        return this.slideIndex;
    }

    /**
     * Reset the parser (useful for new presentations)
     */
    reset(): void {
        this.buffer = '';
        this.inSlidesArray = false;
        this.currentSlideBuffer = '';
        this.slideIndex = -1;
        this.inSlide = false;
        this.slideDepth = 0;
        this.elementDepth = 0;
        this.inElement = false;
        this.currentElement = '';
        this.currentElementType = '';
    }
}
