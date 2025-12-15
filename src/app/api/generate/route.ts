import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/database/connect';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
    try {
        const { prompt, userId } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        //         // Generate presentation using Claude
        //         const message = await anthropic.messages.create({
        //             model: 'claude-3-5-sonnet-20241022',
        //             max_tokens: 4096,
        //             messages: [
        //                 {
        //                     role: 'user',
        //                     content: `Create a presentation about: ${prompt}

        // Please respond with a custom DSL format exactly like this:

        // PRESENTATION {
        //   id = "presentation-id";
        //   title = "Presentation Title";
        //   slides = [
        //     SLIDE {
        //       div {
        //         classes = "relative w-full min-h-screen overflow-hidden";
        //         children = [
        //           img {
        //             content = "https://images.unsplash.com/photo-example?auto=format&fit=crop&w=1920&q=80";
        //             classes = "absolute inset-0 w-full h-full object-cover";
        //           };
        //           div {
        //             classes = "absolute inset-0 bg-black/60";
        //             children = [];
        //           };
        //           div {
        //             classes = "relative z-10 flex flex-col items-center justify-center text-center h-full px-12";
        //             children = [
        //               h1 { content = "Slide Title DO NOT ADD QUOTES INSIDE CONTENT"; classes = "text-7xl font-black text-white mb-8"; };
        //               p { content = "Slide subtitle or content"; classes = "text-3xl text-white/90"; };
        //             ];
        //           };
        //         ];
        //       };
        //     }
        //   ];
        // };

        // Rules:
        // 1. Use standard Tailwind CSS classes for styling.
        // 2. For images, use Unsplash URLs that match the content.
        // 3. Structure keys (id, title, classes, content) must be unquoted.
        // 4. String values must be double-quoted.
        // 5. Create 5-7 slides with engaging layouts.
        // 6. Return ONLY the DSL string, starting with PRESENTATION {.`,
        //                 },
        //             ],
        //         });

        // Parse Claude's response
        // const content = message.content[0];
        const content = `
        PRESENTATION {
  id = "calculus-basics-presentation";
  title = "The Basics of Calculus";
  slides = [
    SLIDE {
      div {
        classes = "relative w-full min-h-screen overflow-hidden";
        children = [
          img {
            content = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1920&q=80";
            classes = "absolute inset-0 w-full h-full object-cover";
          };
          div {
            classes = "absolute inset-0 bg-gradient-to-br from-blue-900/95 via-indigo-900/90 to-purple-900/95";
            children = [];
          };
          div {
            classes = "relative z-10 flex flex-col items-center justify-center text-center h-full px-12";
            children = [
              h1 { content = "The Basics of Calculus"; classes = "text-7xl font-black text-white mb-8 tracking-tight"; };
              p { content = "A Foundation for First-Year University Students"; classes = "text-3xl text-white/90 mb-4"; };
              p { content = "Understanding Change Through Mathematics"; classes = "text-xl text-white/70"; };
            ];
          };
        ];
      };
    };
    SLIDE {
      div {
        classes = "relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50";
        children = [
          div {
            classes = "absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600";
            children = [];
          };
          div {
            classes = "relative z-10 flex flex-col h-full px-16 py-12";
            children = [
              h1 { content = "What is Calculus?"; classes = "text-6xl font-bold text-gray-900 mb-12"; };
              div {
                classes = "grid grid-cols-2 gap-8 flex-1";
                children = [
                  div {
                    classes = "bg-white rounded-2xl shadow-xl p-8 border-l-8 border-blue-600";
                    children = [
                      h2 { content = "The Study of Change"; classes = "text-3xl font-bold text-gray-900 mb-6"; };
                      p { content = "Calculus is the mathematical study of continuous change. It provides tools to analyze how quantities vary and accumulate over time or space."; classes = "text-xl text-gray-700 leading-relaxed mb-4"; };
                      p { content = "Think of it as the mathematics of motion, growth, and optimization."; classes = "text-lg text-gray-600 italic"; };
                    ];
                  };
                  div {
                    classes = "bg-white rounded-2xl shadow-xl p-8 border-l-8 border-indigo-600";
                    children = [
                      h2 { content = "Two Main Branches"; classes = "text-3xl font-bold text-gray-900 mb-6"; };
                      div {
                        classes = "space-y-4";
                        children = [
                          div {
                            classes = "bg-blue-50 rounded-xl p-5";
                            children = [
                              p { content = "Differential Calculus"; classes = "text-xl font-semibold text-blue-900 mb-2"; };
                              p { content = "Studies rates of change and slopes of curves"; classes = "text-lg text-gray-700"; };
                            ];
                          };
                          div {
                            classes = "bg-indigo-50 rounded-xl p-5";
                            children = [
                              p { content = "Integral Calculus"; classes = "text-xl font-semibold text-indigo-900 mb-2"; };
                              p { content = "Studies accumulation and areas under curves"; classes = "text-lg text-gray-700"; };
                            ];
                          };
                        ];
                      };
                    ];
                  };
                ];
              };
            ];
          };
        ];
      };
    };
    SLIDE {
      div {
        classes = "relative w-full min-h-screen overflow-hidden";
        children = [
          img {
            content = "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1920&q=80";
            classes = "absolute inset-0 w-full h-full object-cover";
          };
          div {
            classes = "absolute inset-0 bg-blue-900/90";
            children = [];
          };
          div {
            classes = "relative z-10 flex flex-col h-full px-16 py-12";
            children = [
              h1 { content = "Understanding Derivatives"; classes = "text-6xl font-bold text-white mb-8"; };
              div {
                classes = "bg-white/95 rounded-2xl p-10 shadow-2xl max-w-5xl";
                children = [
                  div {
                    classes = "mb-8";
                    children = [
                      h2 { content = "The Derivative: Instantaneous Rate of Change"; classes = "text-4xl font-bold text-gray-900 mb-6"; };
                      p { content = "A derivative measures how a function changes at a specific point. It represents the slope of the tangent line to a curve."; classes = "text-2xl text-gray-700 leading-relaxed"; };
                    ];
                  };
                  div {
                    classes = "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-6";
                    children = [
                      p { content = "Notation:"; classes = "text-xl font-semibold text-gray-900 mb-3"; };
                      p { content = "f'(x) or dy/dx or df/dx"; classes = "text-3xl font-mono text-indigo-900 mb-4"; };
                      p { content = "Read as: the derivative of f with respect to x"; classes = "text-lg text-gray-600 italic"; };
                    ];
                  };
                  div {
                    classes = "grid grid-cols-3 gap-6";
                    children = [
                      div {
                        classes = "text-center bg-blue-100 rounded-xl p-6";
                        children = [
                          p { content = "Position → Velocity"; classes = "text-lg font-semibold text-blue-900 mb-2"; };
                          p { content = "How position changes over time"; classes = "text-sm text-gray-700"; };
                        ];
                      };
                      div {
                        classes = "text-center bg-indigo-100 rounded-xl p-6";
                        children = [
                          p { content = "Velocity → Acceleration"; classes = "text-lg font-semibold text-indigo-900 mb-2"; };
                          p { content = "How velocity changes over time"; classes = "text-sm text-gray-700"; };
                        ];
                      };
                      div {
                        classes = "text-center bg-purple-100 rounded-xl p-6";
                        children = [
                          p { content = "Cost → Marginal Cost"; classes = "text-lg font-semibold text-purple-900 mb-2"; };
                          p { content = "How cost changes with production"; classes = "text-sm text-gray-700"; };
                        ];
                      };
                    ];
                  };
                ];
              };
            ];
          };
        ];
      };
    };
    SLIDE {
      div {
        classes = "relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-white to-blue-50";
        children = [
          div {
            classes = "absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600";
            children = [];
          };
          div {
            classes = "relative z-10 flex flex-col h-full px-16 py-12";
            children = [
              h1 { content = "Derivative Rules"; classes = "text-6xl font-bold text-gray-900 mb-10"; };
              div {
                classes = "grid grid-cols-2 gap-8";
                children = [
                  div {
                    classes = "bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-600";
                    children = [
                      h3 { content = "Power Rule"; classes = "text-2xl font-bold text-blue-900 mb-4"; };
                      p { content = "If f(x) = xⁿ, then f'(x) = n·xⁿ⁻¹"; classes = "text-xl font-mono text-gray-800 mb-3 bg-blue-50 p-4 rounded-lg"; };
                      p { content = "Example: f(x) = x³"; classes = "text-lg text-gray-700 mb-2"; };
                      p { content = "f'(x) = 3x²"; classes = "text-xl font-semibold text-blue-700"; };
                    ];
                  };
                  div {
                    classes = "bg-white rounded-2xl shadow-lg p-8 border-t-4 border-indigo-600";
                    children = [
                      h3 { content = "Product Rule"; classes = "text-2xl font-bold text-indigo-900 mb-4"; };
                      p { content = "If f(x) = g(x)·h(x)"; classes = "text-lg text-gray-700 mb-2"; };
                      p { content = "f'(x) = g'(x)·h(x) + g(x)·h'(x)"; classes = "text-xl font-mono text-gray-800 mb-3 bg-indigo-50 p-4 rounded-lg"; };
                      p { content = "Derivative of a product"; classes = "text-lg text-gray-600 italic"; };
                    ];
                  };
                  div {
                    classes = "bg-white rounded-2xl shadow-lg p-8 border-t-4 border-purple-600";
                    children = [
                      h3 { content = "Chain Rule"; classes = "text-2xl font-bold text-purple-900 mb-4"; };
                      p { content = "If f(x) = g(h(x))"; classes = "text-lg text-gray-700 mb-2"; };
                      p { content = "f'(x) = g'(h(x))·h'(x)"; classes = "text-xl font-mono text-gray-800 mb-3 bg-purple-50 p-4 rounded-lg"; };
                      p { content = "Derivative of composite functions"; classes = "text-lg text-gray-600 italic"; };
                    ];
                  };
                  div {
                    classes = "bg-white rounded-2xl shadow-lg p-8 border-t-4 border-pink-600";
                    children = [
                      h3 { content = "Quotient Rule"; classes = "text-2xl font-bold text-pink-900 mb-4"; };
                      p { content = "If f(x) = g(x)/h(x)"; classes = "text-lg text-gray-700 mb-2"; };
                      p { content = "f'(x) = [g'(x)·h(x) - g(x)·h'(x)] / [h(x)]²"; classes = "text-lg font-mono text-gray-800 mb-2 bg-pink-50 p-4 rounded-lg"; };
                      p { content = "Derivative of a quotient"; classes = "text-lg text-gray-600 italic"; };
                    ];
                  };
                ];
              };
            ];
          };
        ];
      };
    };
    SLIDE {
      div {
        classes = "relative w-full min-h-screen overflow-hidden";
        children = [
          img {
            content = "https://images.unsplash.com/photo-1596496050755-c923e73e42e1?auto=format&fit=crop&w=1920&q=80";
            classes = "absolute inset-0 w-full h-full object-cover";
          };
          div {
            classes = "absolute inset-0 bg-gradient-to-br from-indigo-900/95 to-purple-900/90";
            children = [];
          };
          div {
            classes = "relative z-10 flex flex-col h-full px-16 py-12";
            children = [
              h1 { content = "Understanding Integrals"; classes = "text-6xl font-bold text-white mb-8"; };
              div {
                classes = "bg-white/95 rounded-2xl p-10 shadow-2xl";
                children = [
                  div {
                    classes = "mb-8";
                    children = [
                      h2 { content = "The Integral: Accumulation and Area"; classes = "text-4xl font-bold text-gray-900 mb-6"; };
                      p { content = "An integral measures the total accumulation of a quantity. Geometrically, it represents the area under a curve."; classes = "text-2xl text-gray-700 leading-relaxed"; };
                    ];
                  };
                  div {
                    classes = "grid grid-cols-2 gap-8 mb-6";
                    children = [
                      div {
                        classes = "bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8";
                        children = [
                          h3 { content = "Definite Integral"; classes = "text-2xl font-bold text-blue-900 mb-4"; };
                          p { content = "∫[a to b] f(x)dx"; classes = "text-3xl font-mono text-indigo-900 mb-4"; };
                          p { content = "Calculates the exact area between x = a and x = b"; classes = "text-lg text-gray-700 mb-2"; };
                          p { content = "Results in a specific number"; classes = "text-base text-gray-600 italic"; };
                        ];
                      };
                      div {
                        classes = "bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8";
                        children = [
                          h3 { content = "Indefinite Integral"; classes = "text-2xl font-bold text-purple-900 mb-4"; };
                          p { content = "∫ f(x)dx"; classes = "text-3xl font-mono text-purple-900 mb-4"; };
                          p { content = "Finds the antiderivative (reverse of derivative)"; classes = "text-lg text-gray-700 mb-2"; };
                          p { content = "Results in a function + C"; classes = "text-base text-gray-600 italic"; };
                        ];
                      };
                    ];
                  };
                  div {
                    classes = "bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl";
                    children = [
                      p { content = "Key Insight: Integration is the reverse process of differentiation"; classes = "text-xl font-semibold text-gray-900"; };
                    ];
                  };
                ];
              };
            ];
          };
        ];
      };
    };
    SLIDE {
      div {
        classes = "relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-indigo-50";
        children = [
          div {
            classes = "absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-purple-600";
            children = [];
          };
          div {
            classes = "relative z-10 flex flex-col h-full px-16 py-12";
            children = [
              h1 { content = "Integration Techniques"; classes = "text-6xl font-bold text-gray-900 mb-10"; };
              div {
                classes = "space-y-6";
                children = [
                  div {
                    classes = "bg-white rounded-2xl shadow-lg p-8 border-l-8 border-blue-600";
                    children = [
                      h3 { content = "Basic Power Rule for Integration"; classes = "text-3xl font-bold text-blue-900 mb-4"; };
                      p { content = "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C  (where n ≠ -1)"; classes = "text-2xl font-mono text-gray-800 bg-blue-50 p-4 rounded-lg mb-3"; };
                      p { content = "Example: ∫ x² dx = x³/3 + C"; classes = "text-xl text-gray-700"; };
                    ];
                  };
                  div {
                    classes = "bg-white rounded-2xl shadow-lg p-8 border-l-8 border-indigo-600";
                    children = [
                      h3 { content = "Substitution Method"; classes = "text-3xl font-bold text-indigo-900 mb-4"; };
                      p { content = "Used when you can identify an inner function and its derivative"; classes = "text-xl text-gray-700 mb-3"; };
                      p { content = "Let u = g(x), then du = g'(x)dx"; classes = "text-xl font-mono text-gray-800 bg-indigo-50 p-4 rounded-lg mb-2"; };
                      p { content = "Transform the integral in terms of u, integrate, then substitute back"; classes = "text-lg text-gray-600 italic"; };
                    ];
                  };
                  div {
                    classes = "grid grid-cols-2 gap-6";
                    children = [
                      div {
                        classes = "bg-white rounded-2xl shadow-lg p-6 border-l-8 border-purple-600";
                        children = [
                          h3 { content = "Integration by Parts"; classes = "text-2xl font-bold text-purple-900 mb-3"; };
                          p { content = "∫ u dv = uv - ∫ v du"; classes = "text-xl font-mono text-gray-800 bg-purple-50 p-3 rounded-lg"; };
                        ];
                      };
                      div {
                        classes = "bg-white rounded-2xl shadow-lg p-6 border-l-8 border-pink-600";
                        children = [
                          h3 { content = "Partial Fractions"; classes = "text-2xl font-bold text-pink-900 mb-3"; };
                          p { content = "Breaking complex fractions into simpler ones"; classes = "text-lg text-gray-700"; };
                        ];
                      };
                    ];
                  };
                ];
              };
            ];
          };
        ];
      };
    };
    SLIDE {
      div {
        classes = "relative w-full min-h-screen overflow-hidden";
        children = [
          img {
            content = "https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?auto=format&fit=crop&w=1920&q=80";
            classes = "absolute inset-0 w-full h-full object-cover";
          };
          div {
            classes = "absolute inset-0 bg-blue-900/92";
            children = [];
          };
          div {
            classes = "relative z-10 flex flex-col h-full px-16 py-12";
            children = [
              h1 { content = "Real-World Applications"; classes = "text-6xl font-bold text-white mb-10"; };
              div {
                classes = "grid grid-cols-3 gap-6";
                children = [
                  div {
                    classes = "bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform";
                    children = [
                      div {
                        classes = "w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto";
                        children = [
                          p { content = "📊"; classes = "text-3xl"; };
                        ];
                      };
                      h3 { content = "Physics"; classes = "text-2xl font-bold text-gray-900 mb-4 text-center"; };
                      p { content = "Motion, velocity, acceleration"; classes = "text-lg text-gray-700 mb-2"; };
                      p { content = "Electromagnetic fields"; classes = "text-lg text-gray-700 mb-2"; };
                      p { content = "Quantum mechanics"; classes = "text-lg text-gray-700"; };
                    ];
                  };
                  div {
                    classes = "bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform";
                    children = [
                      div {
                        classes = "w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-6 mx-auto";
                        children = [
                          p { content = "💹"; classes = "text-3xl"; };
                        ];
                      };
                      h3 { content = "Economics"; classes = "text-2xl font-bold text-gray-900 mb-4 text-center"; };
                      p { content = "Marginal cost and revenue"; classes = "text-lg text-gray-700 mb-2"; };
                      p { content = "Optimization of profit"; classes = "text-lg text-gray-700 mb-2"; };
                      p { content = "Consumer surplus"; classes = "text-lg text-gray-700"; };
                    ];
                  };
                  div {
                    classes = "bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform";
                    children = [
                      div {
                        classes = "w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto";
                        children = [
                          p { content = "🏗️"; classes = "text-3xl"; };
                        ];
                      };
                      h3 { content = "Engineering"; classes = "text-2xl font-bold text-gray-900 mb-4 text-center"; };
                      p { content = "Structural analysis"; classes = "text-lg text-gray-700 mb-2"; };
                      p { content = "Circuit design"; classes = "text-lg text-gray-700 mb-2"; };
                      p { content = "Signal processing"; classes = "text-lg text-gray-700"; };
                    ];
                  };
                  div {
                    classes = "bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform";
                    children = [
                      div {
                        classes = "w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mb-6 mx-auto";
                        children = [
                          p { content = "🧬"; classes = "text-3xl"; };
                        ];
                      };
                      h3 { content = "Biology"; classes = "text-2xl font-bold text-gray-900 mb-4 text-center"; };
                      p { content = "Population growth models"; classes = "text-lg text-gray-700 mb-2"; };
                      p { content = "Pharmacokinetics"; classes = "text-lg text-gray-700 mb-2"; };
                      p { content = "Disease spread"; classes = "text-lg text-gray-700"; };
                    ];
                  };
                  div {
                    classes = "bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform";
                    children = [
                      div {
                        classes = "w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6 mx-auto";
                        children = [
                          p { content = "🖥️"; classes = "text-3xl"; };
                        ];
                      };
                      h3 { content = "Computer Science"; classes = "text-2xl font-bold text-gray-900 mb-4 text-center"; };
                      p { content = "Machine learning optimization"; classes = "text-lg text-gray-700 mb-2"; };
                      p { content = "Algorithm analysis"; classes = "text-lg text-gray-700 mb-2"; };
                      p { content = "Computer graphics"; classes = "text-lg text-gray-700"; };
                    ];
                  };
                  div {
                    classes = "bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform";
                    children = [
                      div {
                        classes = "w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mb-6 mx-auto";
                        children = [
                          p { content = "📈"; classes = "text-3xl"; };
                        ];
                      };
                      h3 { content = "Statistics"; classes = "text-2xl font-bold text-gray-900 mb-4 text-center"; };
                      p { content = "Probability distributions"; classes = "text-lg text-gray-700 mb-2"; };
                      p { content = "Expected values"; classes = "text-lg text-gray-700 mb-2"; };
                      p { content = "Data analysis"; classes = "text-lg text-gray-700"; };
                    ];
                  };
                ];
              };
            ];
          };
        ];
      };
    };
    SLIDE {
      div {
        classes = "relative w-full min-h-screen overflow-hidden";
        children = [
          img {
            content = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80";
            classes = "absolute inset-0 w-full h-full object-cover";
          };
          div {
            classes = "absolute inset-0 bg-gradient-to-br from-indigo-900/95 via-blue-900/95 to-purple-900/95";
            children = [];
          };
          div {
            classes = "relative z-10 flex flex-col items-center justify-center text-center h-full px-16 py-12";
            children = [
              h1 { content = "Key Takeaways"; classes = "text-6xl font-black text-white mb-12"; };
              div {
                classes = "bg-white/95 rounded-3xl p-12 shadow-2xl max-w-5xl";
                children = [
                  div {
                    classes = "space-y-6";
                    children = [
                      div {
                        classes = "flex items-start gap-6 text-left";
                        children = [
                          div {
                            classes = "w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold text-white";
                            children = [
                              p { content = "1"; classes = ""; };
                            ];
                          };
                          div {
                            classes = "flex-1";
                            children = [
                              p { content = "Calculus is the mathematics of change and accumulation, divided into derivatives and integrals"; classes = "text-2xl text-gray-800 leading-relaxed"; };
                            ];
                          };
                        ];
                      };
                      div {
                        classes = "flex items-start gap-6 text-left";
                        children = [
                          div {
                            classes = "w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold text-white";
                            children = [
                              p { content = "2"; classes = ""; };
                            ];
                          };
                          div {
                            classes = "flex-1";
                            children = [
                              p { content = "Derivatives measure instantaneous rates of change and are essential for optimization problems"; classes = "text-2xl text-gray-800 leading-relaxed"; };
                            ];
                          };
                        ];
                      };
                      div {
                        classes = "flex items-start gap-6 text-left";
                        children = [
                          div {
                            classes = "w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold text-white";
                            children = [
                              p { content = "3"; classes = ""; };
                            ];
                          };
                          div {
                            classes = "flex-1";
                            children = [
                              p { content = "Integrals calculate total accumulation and area, serving as the reverse operation of differentiation"; classes = "text-2xl text-gray-800 leading-relaxed"; };
                            ];
                          };
                        ];
                      };
                      div {
                        classes = "flex items-start gap-6 text-left";
                        children = [
                          div {
                            classes = "w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold text-white";
                            children = [
                              p { content = "4"; classes = ""; };
                            ];
                          };
                          div {
                            classes = "flex-1";
                            children = [
                              p { content = "Applications span physics, engineering, economics, biology, and computer science"; classes = "text-2xl text-gray-800 leading-relaxed"; };
                            ];
                          };
                        ];
                      };
                    ];
                  };
                  div {
                    classes = "mt-10 pt-8 border-t-2 border-gray-200";
                    children = [
                      p { content = "Master these fundamentals and you'll unlock powerful tools for analyzing the world around you"; classes = "text-2xl font-semibold text-blue-900 italic"; };
                    ];
                  };
                ];
              };
            ];
          };
        ];
      };
    };
  ];
};`
        let dslString = "";

        // if (content.type === 'text') {
        if (typeof content === 'string') {
            // const dslMatch = content.text.match(/PRESENTATION\s*\{[\s\S]*\}$/);
            const dslMatch = content.match(/PRESENTATION\s*\{[\s\S]*\}$/);

            if (dslMatch) {
                dslString = dslMatch[0];
            } else {
                // Fallback if there is extra text but PRESENTATION starts somewhere
                const start = content.indexOf("PRESENTATION {");
                // const start = content.text.indexOf("PRESENTATION {");
                if (start !== -1) {
                    // dslString = content.text.substring(start);
                    dslString = content.substring(start);
                    // Ideally we should find the matching closing brace, but simplistic for now
                } else {
                    throw new Error('Failed to parse presentation DSL');
                }
            }
        }

        // Add is_public flag logic if needed, but here we store raw data
        const presentationData = { dsl: dslString, is_public: true };

        // We should extract title for accessibility/searching if possible
        const titleMatch = dslString.match(/title\s*=\s*"([^"]*)"/);
        const title = titleMatch ? titleMatch[1] : prompt;

        // Save to database
        const { data, error } = await supabase
            .from('Presentation')
            .insert([
                {
                    presentation_data: presentationData,
                    prompts: [prompt],
                    owner_id: userId || '00000000-0000-0000-0000-000000000000', // Default UUID if no user
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                { error: 'Failed to save presentation' },
                { status: 500 }
            );
        }

        // Create stats entry
        await supabase
            .from('PresentationStats')
            .insert([
                {
                    presentation_id: data.presentation_id,
                    likes: 0,
                }
            ]);

        // Return the DSL string to the client immediately so they can view it
        // The client might be expecting { data: { ... }, message }
        return NextResponse.json({
            data: { ...data, dsl: dslString },
            message: 'Presentation generated successfully',
        });
    } catch (error) {
        console.error('Error generating presentation:', error);
        return NextResponse.json(
            { error: 'Failed to generate presentation' },
            { status: 500 }
        );
    }
}
