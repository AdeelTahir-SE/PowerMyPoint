"use client";

import React from "react";

const dslString = `
PRESENTATION {
  id = "conspiracy-theories-001";
  title = "Understanding Conspiracy Theories";
  slides = [
    SLIDE {
      h1 { content = "Conspiracy Theories"; classes = "text-6xl font-bold text-red-600 mb-6 text-center"; };
      p { content = "Exploring the psychology, history, and impact of conspiratorial thinking in modern society."; classes = "text-xl text-gray-800 mb-6 text-center max-w-4xl mx-auto"; };
      img { content = "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1200&q=80"; classes = "mx-auto rounded-xl shadow-2xl mt-6 w-full max-w-2xl h-64 object-cover"; };
      div {
        classes = "mt-8 bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl shadow-lg";
        children = [
          p { content = "What We'll Explore:"; classes = "text-2xl font-bold mb-4 text-gray-800"; };
          ul {
            classes = "grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700";
            children = [
              li { content = "What defines a conspiracy theory"; classes = "text-lg flex items-start"; };
              li { content = "Famous historical examples"; classes = "text-lg flex items-start"; };
              li { content = "Psychological factors involved"; classes = "text-lg flex items-start"; };
              li { content = "Impact on society and culture"; classes = "text-lg flex items-start"; };
            ];
          };
        ];
      };
    },

    SLIDE {
      h2 { content = "What is a Conspiracy Theory?"; classes = "text-5xl font-bold text-blue-700 mb-6"; };
      div {
        classes = "bg-white p-6 rounded-xl shadow-lg mb-6";
        children = [
          p { content = "A conspiracy theory is an explanation of events or situations that invokes a conspiracy by sinister and powerful groups, often politically motivated, when other explanations are more probable."; classes = "text-xl text-gray-800 leading-relaxed mb-4"; };
        ];
      };
      ul {
        classes = "space-y-4";
        children = [
          li {
            content = "";
            classes = "bg-blue-50 p-5 rounded-lg";
            children = [
              p { content = "Key Characteristics:"; classes = "text-xl font-semibold text-blue-800 mb-3"; };
              ul {
                classes = "list-disc pl-6 text-gray-700 space-y-2";
                children = [
                  li { content = "Resistant to falsification"; classes = "text-lg"; };
                  li { content = "Pattern recognition in random events"; classes = "text-lg"; };
                  li { content = "Assumes hidden motives and secret plans"; classes = "text-lg"; };
                  li { content = "Often involves powerful entities"; classes = "text-lg"; };
                ];
              };
            ];
          };
        ];
      };
      img { content = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"; classes = "w-full max-w-xl mx-auto mt-6 rounded-xl shadow-md h-48 object-cover"; };
    },

    SLIDE {
      h2 { content = "Famous Conspiracy Theories"; classes = "text-5xl font-bold text-purple-700 mb-6"; };
      div {
        classes = "grid grid-cols-1 md:grid-cols-2 gap-6";
        children = [
          div {
            classes = "bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-lg";
            children = [
              h3 { content = "Historical Examples"; classes = "text-2xl font-bold text-purple-800 mb-4"; };
              ul {
                classes = "list-disc pl-6 text-gray-800 space-y-3";
                children = [
                  li { content = "Moon Landing Hoax (1969)"; classes = "text-lg"; };
                  li { content = "JFK Assassination (1963)"; classes = "text-lg"; };
                  li { content = "Area 51 and UFOs"; classes = "text-lg"; };
                  li { content = "Illuminati and New World Order"; classes = "text-lg"; };
                ];
              };
            ];
          };
          div {
            classes = "bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl shadow-lg";
            children = [
              h3 { content = "Modern Era"; classes = "text-2xl font-bold text-indigo-800 mb-4"; };
              ul {
                classes = "list-disc pl-6 text-gray-800 space-y-3";
                children = [
                  li { content = "Flat Earth Theory"; classes = "text-lg"; };
                  li { content = "5G Technology concerns"; classes = "text-lg"; };
                  li { content = "QAnon movement"; classes = "text-lg"; };
                  li { content = "Deep State narratives"; classes = "text-lg"; };
                ];
              };
            ];
          };
        ];
      };
      img { content = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"; classes = "w-full max-w-2xl mx-auto mt-6 rounded-xl shadow-md h-48 object-cover"; };
    },

    SLIDE {
      h2 { content = "Psychology Behind Conspiracies"; classes = "text-5xl font-bold text-green-700 mb-6"; };
      div {
        classes = "space-y-5";
        children = [
          div {
            classes = "bg-green-50 p-6 rounded-xl shadow-lg";
            children = [
              h3 { content = "Why Do People Believe?"; classes = "text-2xl font-bold text-green-800 mb-4"; };
              ul {
                classes = "space-y-4";
                children = [
                  li {
                    content = "";
                    classes = "";
                    children = [
                      p { content = "Pattern Recognition"; classes = "text-lg font-semibold text-gray-800 mb-2"; };
                      p { content = "Humans naturally seek patterns and connections, sometimes seeing them where none exist."; classes = "text-gray-700 pl-4"; };
                    ];
                  };
                  li {
                    content = "";
                    classes = "";
                    children = [
                      p { content = "Need for Control"; classes = "text-lg font-semibold text-gray-800 mb-2"; };
                      p { content = "Believing in conspiracies can provide a sense of understanding and control over complex events."; classes = "text-gray-700 pl-4"; };
                    ];
                  };
                  li {
                    content = "";
                    classes = "";
                    children = [
                      p { content = "Social Identity"; classes = "text-lg font-semibold text-gray-800 mb-2"; };
                      p { content = "Being part of a group with special knowledge can strengthen social bonds and identity."; classes = "text-gray-700 pl-4"; };
                    ];
                  };
                ];
              };
            ];
          };
        ];
      };
      img { content = "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1200&q=80"; classes = "w-full max-w-xl mx-auto mt-6 rounded-xl shadow-md h-48 object-cover"; };
    },

    SLIDE {
      h2 { content = "Cognitive Biases at Play"; classes = "text-5xl font-bold text-orange-700 mb-6"; };
      div {
        classes = "grid grid-cols-1 md:grid-cols-2 gap-5";
        children = [
          div {
            classes = "bg-orange-50 p-5 rounded-xl shadow-md";
            children = [
              h3 { content = "Confirmation Bias"; classes = "text-xl font-bold text-orange-800 mb-2"; };
              p { content = "Seeking information that confirms existing beliefs while ignoring contradictory evidence."; classes = "text-gray-700"; };
            ];
          };
          div {
            classes = "bg-red-50 p-5 rounded-xl shadow-md";
            children = [
              h3 { content = "Proportionality Bias"; classes = "text-xl font-bold text-red-800 mb-2"; };
              p { content = "Believing big events must have big causes, not simple explanations."; classes = "text-gray-700"; };
            ];
          };
          div {
            classes = "bg-yellow-50 p-5 rounded-xl shadow-md";
            children = [
              h3 { content = "Clustering Illusion"; classes = "text-xl font-bold text-yellow-800 mb-2"; };
              p { content = "Seeing patterns in random data or coincidences."; classes = "text-gray-700"; };
            ];
          };
          div {
            classes = "bg-amber-50 p-5 rounded-xl shadow-md";
            children = [
              h3 { content = "Fundamental Attribution Error"; classes = "text-xl font-bold text-amber-800 mb-2"; };
              p { content = "Attributing events to intentional actions rather than circumstances."; classes = "text-gray-700"; };
            ];
          };
        ];
      };
      img { content = "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=1200&q=80"; classes = "w-full max-w-2xl mx-auto mt-6 rounded-xl shadow-md h-48 object-cover"; };
    },

    SLIDE {
      h2 { content = "Societal Impact"; classes = "text-5xl font-bold text-red-700 mb-6"; };
      div {
        classes = "space-y-5";
        children = [
          div {
            classes = "bg-red-50 p-6 rounded-xl shadow-lg";
            children = [
              h3 { content = "Negative Consequences"; classes = "text-2xl font-bold text-red-800 mb-4"; };
              ul {
                classes = "list-disc pl-6 text-gray-800 space-y-3";
                children = [
                  li { content = "Erosion of trust in institutions and experts"; classes = "text-lg"; };
                  li { content = "Public health risks (vaccine hesitancy)"; classes = "text-lg"; };
                  li { content = "Political polarization and radicalization"; classes = "text-lg"; };
                  li { content = "Spread of misinformation online"; classes = "text-lg"; };
                  li { content = "Violence and harassment against perceived enemies"; classes = "text-lg"; };
                ];
              };
            ];
          };
          div {
            classes = "bg-blue-50 p-6 rounded-xl shadow-lg";
            children = [
              h3 { content = "Historical Context"; classes = "text-2xl font-bold text-blue-800 mb-3"; };
              p { content = "While some conspiracies have proven true (Watergate, MKUltra), the vast majority lack credible evidence and can cause real-world harm."; classes = "text-lg text-gray-700 leading-relaxed"; };
            ];
          };
        ];
      };
    },

    SLIDE {
      h2 { content = "Critical Thinking Tools"; classes = "text-5xl font-bold text-teal-700 mb-6"; };
      div {
        classes = "bg-gradient-to-r from-teal-50 to-cyan-50 p-8 rounded-xl shadow-lg";
        children = [
          p { content = "How to Evaluate Claims:"; classes = "text-2xl font-bold text-teal-800 mb-6"; };
          ul {
            classes = "space-y-4";
            children = [
              li {
                content = "";
                classes = "flex items-start gap-3";
                children = [
                  p { content = "1."; classes = "text-2xl font-bold text-teal-600"; };
                  p { content = "Check multiple credible sources"; classes = "text-lg text-gray-800"; };
                ];
              };
              li {
                content = "";
                classes = "flex items-start gap-3";
                children = [
                  p { content = "2."; classes = "text-2xl font-bold text-teal-600"; };
                  p { content = "Look for peer-reviewed research and expert consensus"; classes = "text-lg text-gray-800"; };
                ];
              };
              li {
                content = "";
                classes = "flex items-start gap-3";
                children = [
                  p { content = "3."; classes = "text-2xl font-bold text-teal-600"; };
                  p { content = "Ask: What evidence would disprove this claim?"; classes = "text-lg text-gray-800"; };
                ];
              };
              li {
                content = "";
                classes = "flex items-start gap-3";
                children = [
                  p { content = "4."; classes = "text-2xl font-bold text-teal-600"; };
                  p { content = "Consider Occam's Razor: simpler explanations are often correct"; classes = "text-lg text-gray-800"; };
                ];
              };
              li {
                content = "";
                classes = "flex items-start gap-3";
                children = [
                  p { content = "5."; classes = "text-2xl font-bold text-teal-600"; };
                  p { content = "Be aware of your own cognitive biases"; classes = "text-lg text-gray-800"; };
                ];
              };
            ];
          };
        ];
      };
      img { content = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"; classes = "w-full max-w-xl mx-auto mt-6 rounded-xl shadow-md h-48 object-cover"; };
    },

    SLIDE {
      h2 { content = "Conclusion"; classes = "text-5xl font-bold text-indigo-700 mb-6 text-center"; };
      div {
        classes = "bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl shadow-2xl";
        children = [
          p { content = "Understanding conspiracy theories helps us navigate information in the digital age. While healthy skepticism is important, critical thinking and evidence-based reasoning are essential tools for distinguishing fact from fiction."; classes = "text-xl text-gray-800 leading-relaxed mb-6 text-center"; };
          div {
            classes = "bg-white p-6 rounded-lg shadow-md mt-6";
            children = [
              p { content = "Key Takeaways:"; classes = "text-2xl font-bold text-indigo-800 mb-4"; };
              ul {
                classes = "list-disc pl-6 text-gray-700 space-y-3";
                children = [
                  li { content = "Question claims, but rely on credible evidence"; classes = "text-lg"; };
                  li { content = "Understand cognitive biases that affect judgment"; classes = "text-lg"; };
                  li { content = "Promote media literacy and critical thinking"; classes = "text-lg"; };
                  li { content = "Approach disagreements with empathy and patience"; classes = "text-lg"; };
                ];
              };
            ];
          };
        ];
      };
      img { content = "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"; classes = "w-full max-w-2xl mx-auto mt-6 rounded-xl shadow-md h-48 object-cover"; };
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
