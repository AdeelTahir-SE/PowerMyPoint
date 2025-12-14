// app/page.tsx
'use client';

import React from 'react';

const dslString = `
PRESENTATION {
  id = "sports-pro-002";
  title = "Professional Sports Presentation";
  slides = [
    SLIDE {
      container { 
        classes = "w-[960px] h-[540px] mx-auto p-8 bg-white shadow-xl rounded-xl flex flex-col justify-center items-center space-y-4"; 
        h1 { 
          content = "Welcome to Sports World"; 
          classes = "text-5xl font-bold text-blue-700 text-center"; 
        };
        p { 
          content = "Sports improve your physical, mental, and social well-being."; 
          classes = "text-lg text-gray-700 text-center max-w-[800px]"; 
        };
        img { 
          content = "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=60"; 
          classes = "w-[800px] h-[300px] object-contain rounded-lg shadow-md"; 
        };
      };
    },
    SLIDE {
      container {
        classes = "w-[960px] h-[540px] mx-auto p-8 bg-white shadow-xl rounded-xl flex flex-col justify-start space-y-4";
        h2 { 
          content = "Physical Health Benefits"; 
          classes = "text-4xl font-semibold text-green-600"; 
        };
        ul {
          classes = "list-disc pl-6 text-gray-800 space-y-2 text-lg";
          children = [
            li { content = "Improves cardiovascular health"; classes = ""; };
            li { content = "Builds strength and flexibility"; classes = ""; };
            li { content = "Boosts immunity"; classes = ""; };
          ];
        };
        img { 
          content = "https://images.unsplash.com/photo-1571019613575-2c52d5b8e103?auto=format&fit=crop&w=800&q=60"; 
          classes = "w-[800px] h-[300px] object-contain rounded-lg shadow-md"; 
        };
      };
    }
  ];
};`;

function parseDSL(dsl: string) {
  dsl = dsl.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

  function parseBlock(str: string): any {
    const obj: Record<string, any> = {};
    const regex = /(\w+)\s*=\s*(\[.*?\]|".*?"|\w+)\s*;|(\w+)\s*{([^{}]*({[^{}]*})*[^{}]*)}/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(str)) !== null) {
      if (match[1]) {
        const key = match[1].toLowerCase();
        let value = match[2].trim();

        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).trim();
          const elements = [];
          const arrayRegex = /(\w+\s*{[^{}]*({[^{}]*})*[^{}]*})/g;
          let arrayMatch: RegExpExecArray | null;
          while ((arrayMatch = arrayRegex.exec(value)) !== null) {
            const block = arrayMatch[1];
            elements.push(parseBlock(block));
          }
          obj[key] = elements;
        } else {
          obj[key] = value.replace(/^"|"$/g, '');
        }
      } else if (match[3]) {
        const key = match[3].toLowerCase();
        const inner = match[4].trim();
        obj[key] = parseBlock(inner);
      }
    }

    return obj;
  }

  const topMatch = dsl.match(/(\w+)\s*{(.+)}/);
  if (!topMatch) throw new Error("Invalid DSL format");

  const topKey = topMatch[1].toLowerCase();
  const topContent = topMatch[2].trim();
  const result: Record<string, any> = {};
  result[topKey] = parseBlock(topContent);
  return result;
}

// Recursive renderer for JSON -> HTML
const JsonRenderer: React.FC<{ node: any }> = ({ node }) => {
  const tag = Object.keys(node)[0];
  const element = node[tag];

  // Self-closing tags
  const selfClosing = ['img', 'input', 'br', 'hr'];

  if (selfClosing.includes(tag)) {
    return <img className={element.classes} src={element.content} alt="" />;
  }

  let children: React.ReactNode = null;

  // If the element has children array, render recursively
  if (element.children) {
    children = element.children.map((child: any, idx: number) => (
      <JsonRenderer key={idx} node={child} />
    ));
  } else if (element.content) {
    children = element.content;
  }

  return React.createElement(tag, { className: element.classes }, children);
};

export default function Page() {
  const jsonData = parseDSL(dslString);
  const slides = jsonData.presentation.slides || [];

  return (
    <main className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {jsonData.presentation.title}
      </h1>

      {slides.map((slide: any, index: number) => (
        <div key={index} className="slide border-b border-gray-200 pb-6">
          {Object.keys(slide).map((key) => (
            <JsonRenderer key={key} node={{ [key]: slide[key] }} />
          ))}
        </div>
      ))}

      {/* Optional: main image */}
      {jsonData.presentation.img && (
        <img
          className={jsonData.presentation.img.classes}
          src={jsonData.presentation.img.content}
          alt=""
        />
      )}
    </main>
  );
}
