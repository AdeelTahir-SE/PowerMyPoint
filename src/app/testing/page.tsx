// app/page.tsx
'use client';

import React from 'react';

const dslString = `
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

// DSL -> HTML string parser
function dslToHtml(dsl: string): string {
  dsl = dsl.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

  function parseBlock(str: string): string {
    let html = '';
    const regex = /(\w+)\s*=\s*(\[.*?\]|".*?"|\w+)\s*;|(\w+)\s*{([^{}]*({[^{}]*})*[^{}]*)}/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(str)) !== null) {
      if (match[1]) {
        // key = value; (arrays are handled recursively)
        const key = match[1].toLowerCase();
        let value = match[2].trim();

        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).trim();
          const arrayRegex = /(\w+\s*{[^{}]*({[^{}]*})*[^{}]*})/g;
          let arrayMatch: RegExpExecArray | null;
          while ((arrayMatch = arrayRegex.exec(value)) !== null) {
            html += parseBlock(arrayMatch[1]);
          }
        }
      } else if (match[3]) {
        // tag { ... }
        const tag = match[3].toLowerCase();
        const inner = match[4].trim();

        const classMatch = inner.match(/classes\s*=\s*"([^"]*)"/);
        const classes = classMatch ? classMatch[1] : '';

        const contentMatch = inner.match(/content\s*=\s*"([^"]*)"/);
        const content = contentMatch ? contentMatch[1] : '';

        const childrenMatch = inner.match(/children\s*=\s*\[(.*)\]/);
        let childrenHtml = '';
        if (childrenMatch) {
          const childrenStr = childrenMatch[1].trim();
          const childRegex = /(\w+\s*{[^{}]*({[^{}]*})*[^{}]*})/g;
          let childMatch: RegExpExecArray | null;
          while ((childMatch = childRegex.exec(childrenStr)) !== null) {
            childrenHtml += parseBlock(childMatch[1]);
          }
        }

        const selfClosing = ['img', 'input', 'br', 'hr'];
        if (selfClosing.includes(tag)) {
          html += `<${tag} class="${classes}" src="${content}" />`;
        } else {
          html += `<${tag} class="${classes}">${content}${childrenHtml}</${tag}>`;
        }
      }
    }

    return html;
  }

  const topMatch = dsl.match(/(\w+)\s*{(.+)}/);
  if (!topMatch) throw new Error("Invalid DSL format");
  const topContent = topMatch[2].trim();
  return parseBlock(topContent);
}

export default function Page() {
  const htmlString = dslToHtml(dslString);

  return (
    <main className="bg-gray-100 min-h-screen py-12 flex flex-col items-center space-y-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        Professional Sports Presentation
      </h1>
      <div
        dangerouslySetInnerHTML={{ __html: htmlString }}
      />
    </main>
  );
}
