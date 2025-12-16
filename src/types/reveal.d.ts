/**
 * Type declarations for Reveal.js plugins
 * 
 * Create this file at: src/types/reveal.d.ts
 * 
 * This file tells TypeScript about the Reveal.js plugin modules
 * that don't have built-in type definitions.
 */

declare module 'reveal.js' {
  export default class Reveal {
    constructor(container: HTMLElement, config?: any);
    initialize(): Promise<void>;
    destroy(): void;
    slide(h: number, v?: number, f?: number): void;
    next(): void;
    prev(): void;
    // Add other Reveal.js methods as needed
  }
}

declare module 'reveal.js/plugin/markdown/markdown.esm.js' {
  const RevealMarkdown: any;
  export default RevealMarkdown;
}

declare module 'reveal.js/plugin/highlight/highlight.esm.js' {
  const RevealHighlight: any;
  export default RevealHighlight;
}

declare module 'reveal.js/plugin/notes/notes.esm.js' {
  const RevealNotes: any;
  export default RevealNotes;
}

declare module 'reveal.js/plugin/math/math.esm.js' {
  const RevealMath: any;
  export default RevealMath;
}

declare module 'reveal.js/plugin/search/search.esm.js' {
  const RevealSearch: any;
  export default RevealSearch;
}

declare module 'reveal.js/plugin/zoom/zoom.esm.js' {
  const RevealZoom: any;
  export default RevealZoom;
}

declare module 'highlight.js' {
  const hljs: {
    default?: {
      highlightAll(): void;
      highlight(code: string, options: { language: string }): { value: string };
    };
    highlightAll(): void;
    highlight(code: string, options: { language: string }): { value: string };
  };
  export default hljs;
}