"use client"
// pages/sports-presentation.js
import React from "react";

// ----------------------------
// TailSlideLang DSL as string
// ----------------------------
const dslText = `
PRESENTATION {
  id = "sports-demo-001";
  title = "Importance of Sports and Games";
  slides = [
    SLIDE {
      h1 { content = "Welcome to Sports World"; classes = "text-5xl font-bold text-blue-600 mb-6 text-center"; };
      p  { content = "Explore why sports and games are essential for physical, mental, and social well-being."; classes = "text-lg text-gray-800 mb-4 text-center"; };
      img { content = "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=60"; classes = "mx-auto rounded-lg shadow-lg mt-4"; };
    },
    SLIDE {
      h2 { content = "Physical Health Benefits"; classes = "text-4xl font-semibold text-green-600 mb-4"; };
      ul {
        classes = "list-disc pl-6 text-gray-800 space-y-2";
        children = [
          li { content = "Improves cardiovascular health"; classes = "text-lg"; };
          li { content = "Builds strength and flexibility"; classes = "text-lg"; };
          li { content = "Boosts immunity"; classes = "text-lg"; };
        ];
      };
      img { content = "https://images.unsplash.com/photo-1571019613575-2c52d5b8e103?auto=format&fit=crop&w=800&q=60"; classes = "w-2/3 mx-auto mt-4 rounded-lg shadow-md"; };
    },
    SLIDE {
      h2 { content = "Mental Health Benefits"; classes = "text-4xl font-semibold text-purple-600 mb-4"; };
      ul {
        classes = "list-disc pl-6 text-gray-800 space-y-2";
        children = [
          li { content = "Reduces stress and anxiety"; classes = "text-lg"; };
          li { content = "Improves focus and cognitive skills"; classes = "text-lg"; };
          li { content = "Boosts self-confidence and discipline"; classes = "text-lg"; };
        ];
      };
      img { content = "https://images.unsplash.com/photo-1554288246-6c81ef8d83b2?auto=format&fit=crop&w=800&q=60"; classes = "w-2/3 mx-auto mt-4 rounded-lg shadow-md"; };
    },
    SLIDE {
      h2 { content = "Social Benefits"; classes = "text-4xl font-semibold text-yellow-600 mb-4"; };
      p  { content = "Sports promote teamwork, leadership, and communication skills."; classes = "text-lg text-gray-800 mb-2"; };
      ul {
        classes = "list-disc pl-6 text-gray-800 space-y-2";
        children = [
          li { content = "Fosters team spirit"; classes = "text-lg"; };
          li { content = "Encourages healthy competition"; classes = "text-lg"; };
          li { content = "Strengthens community bonds"; classes = "text-lg"; };
        ];
      };
      img { content = "https://images.unsplash.com/photo-1506812574058-fc75fa93fead?auto=format&fit=crop&w=800&q=60"; classes = "w-2/3 mx-auto mt-4 rounded-lg shadow-md"; };
    },
    SLIDE {
      h2 { content = "Icons & Symbols"; classes = "text-4xl font-semibold text-red-600 mb-4"; };
      div {
        content = "";
        classes = "flex justify-around mt-4";
        children = [
          img { content = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; classes = "w-16 h-16"; };
          img { content = "https://cdn-icons-png.flaticon.com/512/3135/3135712.png"; classes = "w-16 h-16"; };
          img { content = "https://cdn-icons-png.flaticon.com/512/3135/3135710.png"; classes = "w-16 h-16"; };
          img { content = "https://cdn-icons-png.flaticon.com/512/3135/3135706.png"; classes = "w-16 h-16"; };
        ];
      };
    },
    SLIDE {
      h2 { content = "Conclusion"; classes = "text-4xl font-bold text-indigo-600 mb-4"; };
      p  { content = "Sports and games are essential for holistic development—physically, mentally, and socially."; classes = "text-lg text-gray-800 mb-2"; };
      p  { content = "Participate actively, enjoy, and stay healthy!"; classes = "text-lg text-gray-700 font-semibold"; };
      img { content = "https://images.unsplash.com/photo-1526403225070-7e1c7f052b46?auto=format&fit=crop&w=800&q=60"; classes = "w-2/3 mx-auto mt-4 rounded-lg shadow-lg"; };
    }
  ];
};
`;
function parsePresentationDSL(dslText: string): PresentationData {
    const titleMatch = dslText.match(/title\s*=\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : "Untitled";

    const slidesMatch = dslText.match(/slides\s*=\s*\[([\s\S]*?)\];/);
    if (!slidesMatch) return { title, slides: [] };

    let slidesText = slidesMatch[1];

    slidesText = slidesText
        .replace(/(\w+)\s*\{/g, '"$1":{')
        .replace(/content\s*=\s*"([^"]*)"/g, '"content":"$1"')
        .replace(/classes\s*=\s*"([^"]*)"/g, '"classes":"$1"')
        .replace(/children\s*=\s*\[/g, '"children":[')
        .replace(/;/g, ',')
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');

    slidesText = `[${slidesText}]`;

    let slides: SlideElement[] = [];
    try {
        console.log(slidesText.replace("\"SLIDE\":", ""))
        slides = JSON.parse(slidesText.replace("\"SLIDE\":", ""));
    } catch (err) {
        console.error("Failed to parse slides:", err);
    }
    console.log(title, slides)
    return { title, slides };
}

// ----------------------------
// Recursive Slide Renderer
// ----------------------------
function SlideElementRenderer({ element }: { element: SlideElement }) {
    const tagName = Object.keys(element)[0];
    const { content = "", classes = "", children = [] } = element[tagName];

    const Tag = tagName as keyof JSX.IntrinsicElements;

    if (tagName === "img") return <img src={content} className={classes} alt="" />;

    return (
        <Tag className={classes}>
            {content}
            {Array.isArray(children) &&
                children.map((child, idx) => <SlideElementRenderer key={idx} element={child} />)}
        </Tag>
    );
}

function Slide({ slide }: { slide: SlideElement }) {
    return (
        <div className="p-6 border border-gray-300 rounded-lg mb-6 shadow-lg bg-white">
            {Object.keys(slide).map((key, idx) => (
                <SlideElementRenderer key={idx} element={{ [key]: slide[key] }} />
            ))}
        </div>
    );
}

// ----------------------------
// Page Component
// ----------------------------
export default function Page() {
    const { title, slides } = parsePresentationDSL(dslText);

    return (
        <div className="space-y-12 max-w-5xl mx-auto p-4 bg-gray-50 min-h-screen">
            <h1 className="text-6xl font-extrabold text-center text-indigo-600 mb-12">
                {title}
            </h1>

            {slides.map((slide, idx) => (
                <Slide key={idx} slide={slide} />
            ))}
        </div>
    );
}