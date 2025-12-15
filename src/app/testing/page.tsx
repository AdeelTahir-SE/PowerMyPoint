"use client";

import React from "react";

const dslString = `
PRESENTATION {
  id = "sports-demo-001";
  title = "Importance of Sports and Games";
  slides = [
    SLIDE {
      h1 { content = "Welcome to Sports World"; classes = "text-5xl font-bold text-blue-600 mb-6 text-center"; };
      p  { content = "Explore why sports and games are essential for physical, mental, and social well-being."; classes = "text-lg text-gray-800 mb-4 text-center"; };
      img { content = "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=60"; classes = "mx-auto rounded-lg shadow-lg mt-4"; };
      div {
        classes = "mt-6 bg-gray-100 p-4 rounded-lg";
        children = [
          p { content = "Key Highlights:"; classes = "text-lg font-semibold mb-2"; };
          ul {
            classes = "list-disc pl-6 text-gray-700 space-y-1";
            children = [
              li { content = "Engage in physical activities"; classes = "text-base"; };
              li { content = "Build teamwork skills"; classes = "text-base"; };
              li { content = "Boost overall well-being"; classes = "text-base"; };
              li {
                content = "";
                classes = "";
                children = [
                  p { content = "Sub-details:"; classes = "text-sm font-medium italic"; };
                  ul {
                    classes = "list-decimal pl-6 text-gray-600 space-y-1";
                    children = [
                      li { content = "Cardio improvement"; classes = "text-sm"; };
                      li { content = "Strength building"; classes = "text-sm"; };
                      li { content = "Stress reduction"; classes = "text-sm"; };
                    ];
                  };
                ];
              };
            ];
          };
        ];
      };
    },

    SLIDE {
      h2 { content = "Physical Health Benefits"; classes = "text-4xl font-semibold text-green-600 mb-4"; };
      ul {
        classes = "list-disc pl-6 text-gray-800 space-y-2";
        children = [
          li { content = "Improves cardiovascular health"; classes = "text-lg"; };
          li {
            content = "Builds strength and flexibility"; classes = "text-lg";
            children = [
              ul {
                classes = "list-circle pl-4 text-gray-600 space-y-1";
                children = [
                  li { content = "Muscle toning"; classes = "text-sm"; };
                  li { content = "Joint mobility"; classes = "text-sm"; };
                ];
              };
            ];
          };
          li { content = "Boosts immunity"; classes = "text-lg"; };
        ];
      };
      img { content = "https://images.unsplash.com/photo-1571019613575-2c52d5b8e103?auto=format&fit=crop&w=800&q=60"; classes = "w-2/3 mx-auto mt-4 rounded-lg shadow-md"; };
    },

    SLIDE {
      h2 { content = "Mental Health Benefits"; classes = "text-4xl font-semibold text-purple-600 mb-4"; };
      div {
        classes = "grid grid-cols-1 md:grid-cols-2 gap-4";
        children = [
          ul {
            classes = "list-disc pl-6 text-gray-800 space-y-2";
            children = [
              li { content = "Reduces stress and anxiety"; classes = "text-lg"; };
              li { content = "Improves focus and cognitive skills"; classes = "text-lg"; };
              li { content = "Boosts self-confidence and discipline"; classes = "text-lg"; };
            ];
          };
          div {
            classes = "flex flex-col gap-2";
            children = [
              img { content = "https://images.unsplash.com/photo-1554288246-6c81ef8d83b2?auto=format&fit=crop&w=800&q=60"; classes = "rounded-lg shadow-md"; };
              p { content = "Regular mental exercises through sports enhance brain function."; classes = "text-gray-700"; };
            ];
          };
        ];
      };
    },

    SLIDE {
      h2 { content = "Social Benefits"; classes = "text-4xl font-semibold text-yellow-600 mb-4"; };
      div {
        classes = "flex flex-col gap-4";
        children = [
          p { content = "Sports promote teamwork, leadership, and communication skills."; classes = "text-lg text-gray-800 mb-2"; };
          ul {
            classes = "list-disc pl-6 text-gray-800 space-y-2";
            children = [
              li { content = "Fosters team spirit"; classes = "text-lg"; };
              li { content = "Encourages healthy competition"; classes = "text-lg"; };
              li { content = "Strengthens community bonds"; classes = "text-lg"; };
            ];
          };
          div {
            classes = "flex gap-2 mt-2";
            children = [
              img { content = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; classes = "w-12 h-12"; };
              img { content = "https://cdn-icons-png.flaticon.com/512/3135/3135712.png"; classes = "w-12 h-12"; };
            ];
          };
        ];
      };
    }
  ];
};
`;

function dslToSlides(dsl: string): string[] {
  // Extract slides array content
  const slidesMatch = dsl.match(/slides\s*=\s*\[([\s\S]*)\]\s*;?\s*}\s*;?\s*$/);
  if (!slidesMatch) throw new Error("Invalid DSL: slides array not found");

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
  return slideBlocks.map(block => parseElement(block.substring(block.indexOf("{") + 1, block.lastIndexOf("}"))));
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
      html += `<${tag} class="${attrs.classes || ""}" src="${attrs.content || ""}" />`;
    } else {
      html += `<${tag} class="${attrs.classes || ""}">${attrs.content || ""}${attrs.childrenHtml || ""}</${tag}>`;
    }
  };
  return html;
}

function parseAttributes(inner: string): { classes?: string; content?: string; childrenHtml?: string } {
  const attrs: { classes?: string; content?: string; childrenHtml?: string } = {};

  // Extract classes
  const classesMatch = inner.match(/classes\s*=\s*"([^"]*)"/);
  if (classesMatch) attrs.classes = classesMatch[1];

  // Extract content
  const contentMatch = inner.match(/content\s*=\s*"([^"]*)"/);
  if (contentMatch) attrs.content = contentMatch[1];

  // Extract children array
  const childrenMatch = inner.match(/children\s*=\s*\[([\s\S]*)\]\s*;?\s*$/);
  if (childrenMatch) {
    const childrenContent = childrenMatch[1];
    console.log("the children count is: ", childrenContent);
    attrs.childrenHtml = parseElement(childrenContent);
    console.log("the children html is: ", attrs.childrenHtml);
  }

  return attrs;
}

export default function Page() {
  const slides = dslToSlides(dslString);
  const [current, setCurrent] = React.useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <main className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen py-12 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white text-center mb-8">
        Professional Sports Presentation
      </h1>

      <div className="bg-white rounded-lg shadow-2xl p-12 max-w-4xl w-full min-h-[500px]">
        <div dangerouslySetInnerHTML={{ __html: slides[current] }} />
      </div>

      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={prevSlide}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={current === 0}
        >
          ← Previous
        </button>

        <span className="text-white font-medium">
          {current + 1} / {slides.length}
        </span>

        <button
          onClick={nextSlide}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={current === slides.length - 1}
        >
          Next →
        </button>
      </div>
    </main>
  );
}
