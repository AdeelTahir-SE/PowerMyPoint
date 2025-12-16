'use client';

import { useEffect, useRef } from 'react';
import { Presentation } from '@/types/types';
import { dslToSlides } from '@/lib/dsl';

// Styles
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css'; // Or your preferred theme

interface RevealPresentationViewerProps {
    presentation: Presentation;
    onClose?: () => void;
}

export default function RevealPresentationViewer({ presentation, onClose }: RevealPresentationViewerProps) {
    const revealRef = useRef<HTMLDivElement>(null);
    const revealInstanceRef = useRef<any>(null);

    useEffect(() => {
        let revealInstance: any = null;

        const initReveal = async () => {
            if (!revealRef.current) return;

            // 1. Cleanup previous instance
            if (revealInstanceRef.current) {
                try {
                    revealInstanceRef.current.destroy();
                } catch (e) {
                    console.warn('Reveal destroy error', e);
                }
                revealInstanceRef.current = null;
            }

            // 2. Load Reveal and Plugins
            const Reveal = (await import('reveal.js')).default;
            const RevealMarkdown = (await import('reveal.js/plugin/markdown/markdown.esm.js')).default;
            const RevealHighlight = (await import('reveal.js/plugin/highlight/highlight.esm.js')).default;
            const RevealNotes = (await import('reveal.js/plugin/notes/notes.esm.js')).default;
            const RevealMath = (await import('reveal.js/plugin/math/math.esm.js')).default;
            const RevealZoom = (await import('reveal.js/plugin/zoom/zoom.esm.js')).default;

            // 3. Prepare Slides
            // We do the parsing here to inject into the DOM before Reveal initializes
            let slides: string[] = [];
            if (presentation.dsl) {
                slides = dslToSlides(presentation.dsl);
            } else if (presentation.slides) {
                slides = presentation.slides.map(slide => {
                    if (typeof slide === 'string') return slide;
                    // Inject basic structure if it's an object
                    return `
                        <h2>${slide.title}</h2>
                        <div style="font-size: 0.8em; text-align: left;">
                            ${slide.content}
                        </div>
                        ${slide.imageUrl ? `<img src="${slide.imageUrl}" style="max-height: 40vh; margin: 0 auto;" />` : ''}
                    `;
                });
            }

            // 4. Inject Slides into DOM
            // We wrap them in <section> tags manually here to ensure Reveal picks them up
            const slidesHTML = slides.map(content => {
                // If the content is already a section, leave it, otherwise wrap it
                if (content.trim().startsWith('<section')) return content;
                return `<section>${content}</section>`;
            }).join('');

            const deckContainer = revealRef.current;
            deckContainer.innerHTML = `<div class="slides">${slidesHTML}</div>`;
            deckContainer.classList.add('reveal');

            // 5. Initialize Reveal with EMBEDDED settings
            revealInstance = new Reveal(revealRef.current, {
                // CRITICAL FOR COMPONENT VIEW
                embedded: true, // Tells Reveal it is inside a div, not the body
                
                // DIMENSIONS & SCALING
                width: 960,
                height: 700,
                margin: 0.04, // Small margin to maximize space
                minScale: 0.1, // Allow it to shrink very small
                maxScale: 2.0,

                // UX
                controls: true,
                progress: true,
                center: true,
                hash: false, // Disable hash so it doesn't mess with Next.js router
                mouseWheel: false, // Prevent scrolling page from changing slides unintentionally
                
                // TRANSITIONS
                transition: 'slide',
                backgroundTransition: 'fade',

                // PLUGINS
                plugins: [RevealMarkdown, RevealHighlight, RevealNotes, RevealMath, RevealZoom]
            });

            await revealInstance.initialize();
            revealInstanceRef.current = revealInstance;
        };

        initReveal();

        // 6. Handle Window Resize
        // Embedded Reveal needs to be told to recalculate layout when browser resizes
        const handleResize = () => {
            if (revealInstanceRef.current) {
                revealInstanceRef.current.layout();
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (revealInstanceRef.current) {
                try {
                    revealInstanceRef.current.destroy();
                } catch (e) { }
                revealInstanceRef.current = null;
            }
        };
    }, [presentation]);

    return (
        <div className="w-full h-full relative bg-slate-900 overflow-hidden">
            {/* 7. CSS Override Block 
                This forces the styles to fit the component logic, overriding Reveal's 
                default "Fullscreen" assumptions.
            */}
            <style jsx global>{`
                /* Ensure the container takes up space */
                .reveal-viewport {
                    background: transparent !important;
                }
                
                /* Normalize Text Sizes for Component View */
                .reveal h1 { font-size: 2.5rem !important; margin-bottom: 0.5em !important; }
                .reveal h2 { font-size: 2rem !important; margin-bottom: 0.5em !important; }
                .reveal h3 { font-size: 1.5rem !important; }
                .reveal p, .reveal li { font-size: 1.1rem !important; line-height: 1.5 !important; }
                
                /* Prevent Images from overflowing */
                .reveal img {
                    max-height: 100% !important;
                    max-width: 100% !important;
                    object-fit: contain;
                }
                
                /* Fix code block sizing */
                .reveal pre {
                    width: 90% !important;
                    margin: 0 auto !important;
                    box-shadow: none !important;
                }
                .reveal pre code {
                    max-height: 400px !important;
                    font-size: 0.9rem !important;
                    line-height: 1.3 !important;
                }
            `}</style>

            <div ref={revealRef} className="reveal w-full h-full absolute inset-0">
                {/* Slides are injected via JS */}
            </div>
        </div>
    );
}