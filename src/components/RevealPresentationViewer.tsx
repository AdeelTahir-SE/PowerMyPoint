'use client';

import { useEffect, useRef, useState } from 'react';
import { dslToRevealSlides } from '@/lib/reveal-converter';
import { dslToSlides } from '@/lib/dsl';
import { Presentation } from '@/types/types';

// Import Reveal.js CSS and highlight.js
if (typeof window !== 'undefined') {
    import('reveal.js/dist/reveal.css');
    import('reveal.js/dist/theme/black.css');
    import('highlight.js/styles/github-dark.css');
}

interface RevealPresentationViewerProps {
    presentation: Presentation;
    onClose?: () => void;
}

export default function RevealPresentationViewer({ presentation, onClose }: RevealPresentationViewerProps) {
    const revealRef = useRef<HTMLDivElement>(null);
    const revealInstanceRef = useRef<any>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!revealRef.current || isInitialized) return;

        // Dynamically import Reveal.js
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

                // Get slides from presentation
                let slides: string[] = [];
                if (presentation.dsl) {
                    slides = dslToSlides(presentation.dsl);
                } else if (presentation.slides) {
                    // Convert Slide objects to HTML if needed
                    slides = presentation.slides.map(slide => {
                        if (typeof slide === 'string') return slide;
                        return `<h1>${slide.title}</h1><p>${slide.content}</p>`;
                    });
                }

                if (slides.length === 0) {
                    console.warn('No slides found in presentation');
                    return;
                }

                // Convert slides to Reveal.js sections format
                // Extract data attributes from wrapper divs created by dsl.ts
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

                // Initialize Reveal.js with COMPLETE feature set
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
    }, [presentation, isInitialized]);

    return (
        <div className="relative w-full h-full">
            <div ref={revealRef} className="reveal-viewport w-full h-full" style={{ width: '100%', height: '100%' }} />
        </div>
    );
}

