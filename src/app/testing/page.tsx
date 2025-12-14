// app/page.tsx
'use client';

import React from 'react';

const dslString = `
PRESENTATION {
  id = "sports-advanced-001";
  title = "The Power of Sports and Games";
  slides = [

    SLIDE {
      div {
        classes = "relative h-screen w-full bg-cover bg-center flex flex-col justify-center items-center text-white";
        style = "background-image: url('https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1600&q=80');";
        children = [
          h1 { content = "Welcome to the World of Sports"; classes = "text-6xl font-extrabold mb-4 animate-fade-in"; };
          p  { content = "Discover how sports boost your body, mind, and community."; classes = "text-2xl text-gray-200 animate-fade-in delay-200"; };
          button { content = "Get Started"; classes = "mt-8 px-6 py-3 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition-all animate-bounce"; };
        ];
      };
    },

    SLIDE {
      h2 { content = "Physical Health Benefits"; classes = "text-5xl font-bold text-green-600 mb-6 text-center"; };
      div {
        classes = "grid grid-cols-1 md:grid-cols-3 gap-8";
        children = [
          div { content = "💓 Improves cardiovascular health"; classes = "bg-white p-6 rounded-xl shadow-lg text-center animate-pop"; };
          div { content = "💪 Builds strength and flexibility"; classes = "bg-white p-6 rounded-xl shadow-lg text-center animate-pop delay-100"; };
          div { content = "🛡 Boosts immunity"; classes = "bg-white p-6 rounded-xl shadow-lg text-center animate-pop delay-200"; };
        ];
      };
      img { content = "https://images.unsplash.com/photo-1571019613575-2c52d5b8e103?auto=format&fit=crop&w=800&q=60"; classes = "w-full md:w-2/3 mx-auto rounded-xl shadow-md mt-8"; };
    },

    SLIDE {
      h2 { content = "Mental Health Benefits"; classes = "text-5xl font-bold text-purple-600 mb-6 text-center"; };
      div {
        classes = "grid grid-cols-1 md:grid-cols-3 gap-8";
        children = [
          div { content = "🧘 Reduces stress and anxiety"; classes = "bg-white p-6 rounded-xl shadow-lg text-center animate-pop"; };
          div { content = "🧠 Improves focus and cognitive skills"; classes = "bg-white p-6 rounded-xl shadow-lg text-center animate-pop delay-100"; };
          div { content = "💎 Boosts self-confidence and discipline"; classes = "bg-white p-6 rounded-xl shadow-lg text-center animate-pop delay-200"; };
        ];
      };
      img { content = "https://images.unsplash.com/photo-1554288246-6c81ef8d83b2?auto=format&fit=crop&w=800&q=60"; classes = "w-full md:w-2/3 mx-auto rounded-xl shadow-md mt-8"; };
    },

    SLIDE {
      h2 { content = "Social & Team Benefits"; classes = "text-5xl font-bold text-yellow-600 mb-6 text-center"; };
      ul {
        classes = "list-disc pl-8 space-y-4 text-xl text-gray-700";
        children = [
          li { content = "🤝 Builds teamwork and collaboration"; classes = "animate-slide-left"; };
          li { content = "🏆 Encourages healthy competition"; classes = "animate-slide-left delay-100"; };
          li { content = "🌍 Strengthens community bonds"; classes = "animate-slide-left delay-200"; };
        ];
      };
      img { content = "https://images.unsplash.com/photo-1506812574058-fc75fa93fead?auto=format&fit=crop&w=800&q=60"; classes = "w-full md:w-2/3 mx-auto rounded-xl shadow-md mt-8"; };
    },

    SLIDE {
      h2 { content = "Icons & Achievements"; classes = "text-5xl font-bold text-red-600 mb-6 text-center"; };
      div {
        classes = "flex justify-around items-center mt-8";
        children = [
          img { content = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; classes = "w-20 h-20 animate-bounce"; };
          img { content = "https://cdn-icons-png.flaticon.com/512/3135/3135712.png"; classes = "w-20 h-20 animate-bounce delay-100"; };
          img { content = "https://cdn-icons-png.flaticon.com/512/3135/3135710.png"; classes = "w-20 h-20 animate-bounce delay-200"; };
          img { content = "https://cdn-icons-png.flaticon.com/512/3135/3135706.png"; classes = "w-20 h-20 animate-bounce delay-300"; };
        ];
      };
    },

    SLIDE {
      h2 { content = "Conclusion"; classes = "text-5xl font-extrabold text-indigo-600 mb-6 text-center"; };
      p  { content = "Sports are the key to holistic growth—body, mind, and soul."; classes = "text-2xl text-gray-800 mb-4 text-center"; };
      p  { content = "Engage, enjoy, and thrive!"; classes = "text-xl text-gray-700 font-semibold text-center"; };
      button { content = "Join a Team Today"; classes = "mt-6 px-6 py-3 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition-all mx-auto block"; };
      img { content = "https://images.unsplash.com/photo-1526403225070-7e1c7f052b46?auto=format&fit=crop&w=800&q=60"; classes = "w-full md:w-2/3 mx-auto rounded-xl shadow-lg mt-8"; };
    }

  ];
};
`
// DSL -> array of slides
function dslToSlides(dsl: string): string[][] {
    dsl = dsl.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim().replaceAll("SLIDE", "==");
    const slides = dsl?.split("slides = ")[1]

    function parseBlock(str: string): string[] {
        const slides: string[] = [];
        const regex = /(\w+)\s*=\s*(\[.*?\]|".*?"|\w+)\s*;|(\w+)\s*{([^{}]*({[^{}]*})*[^{}]*)}/g;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(str)) !== null) {
            if (match[1]) {
                // key = value;
                const key = match[1].toLowerCase();
                let value = match[2].trim();

                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.slice(1, -1).trim();
                    const arrayRegex = /(\w+\s*{[^{}]*({[^{}]*})*[^{}]*})/g;
                    let arrayMatch: RegExpExecArray | null;
                    while ((arrayMatch = arrayRegex.exec(value)) !== null) {
                        slides.push(...parseBlock(arrayMatch[1]));
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
                        childrenHtml += parseBlock(childMatch[1]).join('');
                    }
                }

                const selfClosing = ['img', 'input', 'br', 'hr'];
                let html = '';
                if (selfClosing.includes(tag)) {
                    html = `<${tag} class="${classes}" src="${content}" />`;
                } else {
                    html = `<${tag} class="${classes}">${content}${childrenHtml}</${tag}>`;
                }

                // Each top-level tag is treated as one slide if it is SLIDE
                if (tag === 'slide') {
                    slides.push(html);
                } else {
                    slides.push(html);
                }
            }
        }
        // console.log(slides?.join("===================\n\n"))
        return slides;
    }

    const topMatch = dsl.match(/PRESENTATION\s*{(.+)}/);
    if (!topMatch) throw new Error("Invalid DSL format");

    const topContent = topMatch[1].trim();
    const htmlArray = slides?.split("==").map(slide => parseBlock(slide));
    console.log("this is html array\n\n\n\n\n\n", htmlArray)
    return htmlArray;
}

export default function Page() {
    const slides = dslToSlides(dslString);
    const [current, setCurrent] = React.useState(0);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <main className="bg-black min-h-screen py-12 flex flex-col items-center space-y-12">
            <h1 className="text-4xl font-bold text-center mb-8">
                Professional Sports Presentation
            </h1>
            <div
                dangerouslySetInnerHTML={{ __html: slides[current] }}
            />
            <div>

            </div>
            <div className='flex flex-row  z-50 bottom-[40px] bg-green-500 w-[200px] h-[50px]'>
                <button onClick={prevSlide}>Previous</button>
                <button onClick={nextSlide}>Next</button>
            </div>
        </main>
    );
}





