/**
 * RevealPresentationViewer Component
 * 
 * DESIGN SPECIFICATION:
 * This component renders presentations using Reveal.js, a professional HTML presentation framework.
 * It provides a full-featured presentation experience with:
 * - Slide transitions and animations
 * - Keyboard and touch navigation
 * - Code syntax highlighting
 * - Mathematical notation support (MathJax)
 * - Speaker notes
 * - Search functionality
 * - Zoom capabilities
 * 
 * ARCHITECTURE:
 * - Dynamically loads Reveal.js and plugins only when needed
 * - Converts DSL to Reveal.js-compatible HTML structure
 * - Initializes once on mount to prevent re-initialization issues
 * - Properly cleans up on unmount to prevent memory leaks
 * 
 * PERFORMANCE OPTIMIZATION:
 * - Uses refs to maintain Reveal.js instance across renders
 * - Empty dependency array ensures single initialization
 * - Lazy loads all plugins asynchronously
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import { dslToRevealSlides } from '@/lib/reveal-converter';
import { dslToSlides } from '@/lib/dsl';
import { Presentation } from '@/types/types';

// DESIGN NOTE: Reveal.js theme CSS
// Loaded at module level for consistent styling across all presentations
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';

/**
 * INTERFACE: RevealPresentationViewerProps
 * Component props for controlling the presentation viewer
 * - presentation: Full presentation object with DSL or slide data
 * - onClose: Optional callback to close the viewer (for modal usage)
 */
interface RevealPresentationViewerProps {
    presentation: Presentation;
    onClose?: () => void;
}

export default function RevealPresentationViewer({ presentation, onClose }: RevealPresentationViewerProps) {
    // STATE MANAGEMENT:
    // - revealRef: DOM reference to the container element for Reveal.js
    // - revealInstanceRef: Persistent reference to Reveal.js instance (survives re-renders)
    // - isInitialized: Flag to track initialization status (prevents double initialization)
    const revealRef = useRef<HTMLDivElement>(null);
    const revealInstanceRef = useRef<any>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    /**
     * REVEAL.JS INITIALIZATION EFFECT
     * 
     * CRITICAL DESIGN DECISION:
     * - Empty dependency array [] ensures this runs ONLY ONCE on mount
     * - Prevents infinite re-initialization loops
     * - Uses isInitialized guard for extra safety
     * 
     * PLUGIN LOADING STRATEGY:
     * - All plugins loaded with .esm.js extension (ES module format)
     * - Graceful degradation: continues if plugins fail to load
     * - Comprehensive plugin suite for full presentation features
     * 
     * ERROR HANDLING:
     * - Try-catch blocks for each plugin prevent cascade failures
     * - Console warnings for missing plugins aid debugging
     * - Main initialization wrapped in try-catch for robustness
     */
    useEffect(() => {
        if (!revealRef.current || isInitialized) return;

        // ASYNC INITIALIZATION: Dynamically import Reveal.js to reduce initial bundle size
        const initReveal = async () => {
            try {
                const Reveal = (await import('reveal.js')).default;

                // Try to load ALL available plugins
                let plugins: any[] = [];

                // Markdown plugin - using .esm.js as per official docs
                try {
                    const RevealMarkdown = (await import('reveal.js/plugin/markdown/markdown.esm.js')).default;
                    plugins.push(RevealMarkdown);
                    console.log('✅ [REVEAL] Markdown plugin loaded');
                } catch (e) {
                    console.warn('⚠️ [REVEAL] Markdown plugin not available', e);
                }

                // Highlight plugin (code syntax highlighting) - using .esm.js
                try {
                    const RevealHighlight = (await import('reveal.js/plugin/highlight/highlight.esm.js')).default;
                    plugins.push(RevealHighlight);
                    // Initialize highlight.js if available
                    if (typeof window !== 'undefined') {
                        try {
                            const hljs = await import('highlight.js');
                            if (hljs.default) {
                                hljs.default.highlightAll();
                            }
                        } catch (e) {
                            console.warn('⚠️ [REVEAL] highlight.js library not available');
                        }
                    }
                    console.log('✅ [REVEAL] Highlight plugin loaded');
                } catch (e) {
                    console.warn('⚠️ [REVEAL] Highlight plugin not available', e);
                }

                // Notes plugin (speaker notes) - using .esm.js
                try {
                    const RevealNotes = (await import('reveal.js/plugin/notes/notes.esm.js')).default;
                    plugins.push(RevealNotes);
                    console.log('✅ [REVEAL] Notes plugin loaded');
                } catch (e) {
                    console.warn('⚠️ [REVEAL] Notes plugin not available', e);
                }

                // Math plugin (MathJax) - using .esm.js
                try {
                    const RevealMath = (await import('reveal.js/plugin/math/math.esm.js')).default;
                    plugins.push(RevealMath);
                    console.log('✅ [REVEAL] Math plugin loaded');
                } catch (e) {
                    console.warn('⚠️ [REVEAL] Math plugin not available', e);
                }

                // Search plugin - using .esm.js
                try {
                    const RevealSearch = (await import('reveal.js/plugin/search/search.esm.js')).default;
                    plugins.push(RevealSearch);
                    console.log('✅ [REVEAL] Search plugin loaded');
                } catch (e) {
                    console.warn('⚠️ [REVEAL] Search plugin not available', e);
                }

                // Zoom plugin - using .esm.js
                try {
                    const RevealZoom = (await import('reveal.js/plugin/zoom/zoom.esm.js')).default;
                    plugins.push(RevealZoom);
                    console.log('✅ [REVEAL] Zoom plugin loaded');
                } catch (e) {
                    console.warn('⚠️ [REVEAL] Zoom plugin not available', e);
                }

                // Note: Auto-animate is built-in to Reveal.js (enabled via config.autoAnimate)
                // Menu and Anything plugins are not part of the standard reveal.js package

                // SLIDE EXTRACTION:
                // Supports two presentation formats:
                // 1. DSL format (preferred) - parsed using dslToSlides
                // 2. Legacy slide objects - converted to basic HTML
                let slides: string[] = [];
                if (presentation.dsl) {
                    slides = dslToSlides(presentation.dsl);
                } else if (presentation.slides) {
                    // Fallback: Convert Slide objects to HTML if needed
                    slides = presentation.slides.map(slide => {
                        if (typeof slide === 'string') return slide;
                        return `<h1>${slide.title}</h1><p>${slide.content}</p>`;
                    });
                }

                if (slides.length === 0) {
                    console.warn('No slides found in presentation');
                    return;
                }

                /**
                 * SLIDE PROCESSING:
                 * Converts HTML slides to Reveal.js <section> format
                 * 
                 * ATTRIBUTE EXTRACTION:
                 * - Uses DOMParser to safely parse HTML
                 * - Extracts data-* attributes for Reveal.js features:
                 *   - data-transition: Custom slide transitions
                 *   - data-background: Background colors/images
                 *   - data-auto-animate: Auto-animation between slides
                 * - Preserves inner content while extracting wrapper attributes
                 * 
                 * ERROR RECOVERY:
                 * - Multiple fallback strategies if innerHTML is empty
                 * - Reconstructs content from child nodes if needed
                 * - Logs warnings for debugging
                 */
                const revealSections = slides.map((slide, index) => {
                    console.log(`🔍 [REVEAL] Processing slide ${index + 1}, original length: ${slide.length}`);
                    console.log(`📄 [REVEAL] Slide ${index + 1} HTML preview:`, slide.substring(0, 200));

                    // Use DOMParser to properly extract wrapper div attributes and inner content
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(slide, 'text/html');
                    const wrapperDiv = doc.body.firstElementChild;

                    const sectionAttrs: string[] = [];
                    let cleanSlide = slide;

                    if (wrapperDiv && wrapperDiv.tagName.toLowerCase() === 'div') {
                        // Extract all data-* attributes from the wrapper div
                        Array.from(wrapperDiv.attributes).forEach(attr => {
                            if (attr.name.startsWith('data-')) {
                                sectionAttrs.push(`${attr.name}="${attr.value}"`);
                            }
                        });

                        // Get the inner HTML content (all children of the wrapper div)
                        cleanSlide = wrapperDiv.innerHTML;

                        // If innerHTML is empty, try to get textContent or use the original slide
                        if (!cleanSlide || cleanSlide.trim().length === 0) {
                            console.warn(`⚠️ [REVEAL] Slide ${index + 1}: Wrapper div innerHTML is empty, checking children...`);
                            // Check if there are child nodes
                            if (wrapperDiv.childNodes.length > 0) {
                                // Reconstruct HTML from child nodes
                                cleanSlide = Array.from(wrapperDiv.childNodes)
                                    .map(node => {
                                        if (node.nodeType === Node.ELEMENT_NODE) {
                                            return (node as Element).outerHTML;
                                        } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
                                            return node.textContent;
                                        }
                                        return '';
                                    })
                                    .filter(Boolean)
                                    .join('');
                            }

                            // If still empty, use the original slide but remove the wrapper div
                            if (!cleanSlide || cleanSlide.trim().length === 0) {
                                console.warn(`⚠️ [REVEAL] Slide ${index + 1}: Still empty, using original slide without wrapper`);
                                // Remove the wrapper div tags but keep content
                                cleanSlide = slide.replace(/^<div[^>]*>/, '').replace(/<\/div>\s*$/, '');
                            }
                        }

                        console.log(`✅ [REVEAL] Slide ${index + 1}: Extracted ${sectionAttrs.length} data attributes, content length: ${cleanSlide.length}`);
                        console.log(`📝 [REVEAL] Slide ${index + 1} extracted content preview:`, cleanSlide.substring(0, 200));
                    } else {
                        // No wrapper div or not a div - use slide as-is
                        console.log(`⚠️ [REVEAL] Slide ${index + 1}: No wrapper div found (found: ${wrapperDiv?.tagName || 'none'}), using slide as-is`);
                        // Still try to extract data attributes if they exist in the HTML
                        const dataAttrPattern = /data-([a-zA-Z0-9-]+)\s*=\s*"([^"]*)"/gi;
                        let match;
                        const foundAttrs = new Set<string>();

                        while ((match = dataAttrPattern.exec(slide)) !== null) {
                            const attrName = match[1];
                            const attrValue = match[2];
                            if (!foundAttrs.has(attrName)) {
                                sectionAttrs.push(`data-${attrName}="${attrValue}"`);
                                foundAttrs.add(attrName);
                            }
                        }
                    }

                    // Final check - if cleanSlide is still empty, log a warning
                    if (!cleanSlide || cleanSlide.trim().length === 0) {
                        console.error(`❌ [REVEAL] Slide ${index + 1}: FINAL CONTENT IS EMPTY! Original slide:`, slide);
                    }

                    return `<section ${sectionAttrs.join(' ')}>${cleanSlide}</section>`;
                }).join('\n');

                console.log(`✅ [REVEAL] Created ${revealSections.split('</section>').length - 1} sections`);
                console.log(`📋 [REVEAL] First section preview:`, revealSections.substring(0, 500));

                // Set the HTML content - Reveal.js expects the container to have class "reveal" with a child div with class "slides"
                if (revealRef.current) {
                    revealRef.current.className = 'reveal';
                    revealRef.current.innerHTML = `<div class="slides">${revealSections}</div>`;
                }

                /**
                 * REVEAL.JS CONFIGURATION:
                 * Comprehensive configuration enabling all features
                 * 
                 * NAVIGATION:
                 * - controls: Show navigation arrows
                 * - keyboard: Enable keyboard shortcuts
                 * - touch: Enable touch/swipe navigation
                 * - overview: Enable slide overview mode (ESC key)
                 * 
                 * VISUAL EFFECTS:
                 * - transition: Slide transition style
                 * - backgroundTransition: Background transition effect
                 * - autoAnimate: Automatic element animations
                 * - fragments: Step-by-step content reveal
                 * 
                 * LAYOUT:
                 * - center: Center slides vertically
                 * - width/height: Default slide dimensions
                 * - margin: Space around slides
                 * - minScale/maxScale: Zoom limits
                 */
                const config: any = {
                    hash: true,
                    controls: true,
                    progress: true,
                    center: true,
                    touch: true,
                    keyboard: true,
                    overview: true,
                    transition: 'slide',
                    transitionSpeed: 'default',
                    backgroundTransition: 'fade',
                    fragments: true,
                    fragmentInURL: false,
                    embedded: false,
                    autoAnimate: true,
                    autoAnimateMatcher: null,
                    autoAnimateEasing: 'ease',
                    autoAnimateDuration: 1.0,
                    autoAnimateUnmatched: true,
                    autoSlide: 0,
                    autoSlideStoppable: true,
                    autoSlideMethod: null,
                    defaultTiming: null,
                    mouseWheel: false,
                    previewLinks: false,
                    postMessage: true,
                    postMessageEvents: false,
                    focusBodyOnPageVisibilityChange: true,
                    viewDistance: 3,
                    mobileViewDistance: 2,
                    parallaxBackgroundImage: '',
                    parallaxBackgroundSize: '',
                    parallaxBackgroundRepeat: '',
                    parallaxBackgroundPosition: '',
                    parallaxBackgroundOpacity: null,
                    view: null,
                    disableLayout: false,
                    hideInactiveCursor: true,
                    hideCursorTime: 5000,
                    loop: false,
                    rtl: false,
                    navigationMode: 'default',
                    shuffle: false,
                    help: true,
                    pause: true,
                    showNotes: false,
                    autoPlayMedia: null,
                    preloadIframes: null,
                    width: 960,
                    height: 700,
                    margin: 0.1,
                    minScale: 0.2,
                    maxScale: 1.5
                };

                if (plugins.length > 0) {
                    config.plugins = plugins;
                }

                // Configure Math plugin if available (simplified config - let plugin handle MathJax)
                const mathPlugin = plugins.find((p: any) => p && p.id === 'math');
                if (mathPlugin) {
                    config.math = {
                        mathjax: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
                    };
                }

                // Initialize Reveal.js on the container element
                if (!revealRef.current) {
                    console.error('Reveal.js container not found');
                    return;
                }
                const revealInstance = new Reveal(revealRef.current, config);

                revealInstance.initialize().then(() => {
                    revealInstanceRef.current = revealInstance;
                    setIsInitialized(true);
                });
            } catch (error) {
                console.error('Error initializing Reveal.js:', error);
            }
        };

        initReveal();

        // Cleanup on unmount
        return () => {
            if (revealInstanceRef.current) {
                try {
                    revealInstanceRef.current.destroy();
                } catch (e) {
                    console.error('Error destroying Reveal.js instance:', e);
                }
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    return (
        <div className="relative w-full h-full">
            <div ref={revealRef} className="reveal-viewport w-full h-full" style={{ width: '100%', height: '100%' }} />
        </div>
    );
}

