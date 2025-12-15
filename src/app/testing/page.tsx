"use client";

import React from "react";
import { dslToSlides } from "@/lib/dsl";

const dslString = `
PRESENTATION {
  title = "Understanding Conspiracy Theories";
  slides = [
    SLIDE {
      div {
        classes = "absolute inset-0";
        children = [
          img {
            content = "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1920&q=80";
            classes = "absolute inset-0 w-full h-full object-cover";
          };
          div {
            classes = "absolute inset-0 bg-black/60";
            children = [
              div {
                classes = "h-full flex flex-col items-center justify-center text-center px-12 relative z-10";
                children = [
                  h1 { content = "CONSPIRACY THEORIES"; classes = "text-7xl font-black text-white mb-8 tracking-wider drop-shadow-2xl"; };
                  p { content = "Understanding the Psychology, History, and Impact"; classes = "text-3xl text-white/90 mb-12 font-light drop-shadow-lg"; };
                  div {
                    classes = "w-32 h-1 bg-red-500 mx-auto mb-8";
                    children = [];
                  };
                  p { content = "A Deep Dive into Conspiratorial Thinking"; classes = "text-xl text-white/80 font-light"; };
                ];
              };
            ];
          };
        ];
      };
    },

    SLIDE {
      div {
        classes = "absolute inset-0";
        children = [
          img {
            content = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80";
            classes = "absolute inset-0 w-full h-full object-cover";
          };
          div {
            classes = "absolute inset-0 bg-gradient-to-br from-blue-900/85 to-purple-900/85";
            children = [
              div {
                classes = "h-full flex flex-col justify-center px-16 py-12 relative z-10";
                children = [
                  h2 { content = "What is a Conspiracy Theory?"; classes = "text-6xl font-bold text-white mb-12 drop-shadow-lg"; };
                  div {
                    classes = "bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 shadow-2xl";
                    children = [
                      p { content = "An explanation of events that invokes a conspiracy by sinister and powerful groups, often when other explanations are more probable."; classes = "text-2xl text-white mb-8 leading-relaxed font-light"; };
                      div {
                        classes = "grid grid-cols-2 gap-6 mt-8";
                        children = [
                          div {
                            classes = "bg-blue-500/20 p-6 rounded-2xl border border-white/30";
                            children = [
                              p { content = "Resistant to Falsification"; classes = "text-xl font-semibold text-white mb-2"; };
                              p { content = "Cannot be disproven"; classes = "text-white/80"; };
                            ];
                          };
                          div {
                            classes = "bg-purple-500/20 p-6 rounded-2xl border border-white/30";
                            children = [
                              p { content = "Pattern Recognition"; classes = "text-xl font-semibold text-white mb-2"; };
                              p { content = "Sees connections in randomness"; classes = "text-white/80"; };
                            ];
                          };
                          div {
                            classes = "bg-pink-500/20 p-6 rounded-2xl border border-white/30";
                            children = [
                              p { content = "Hidden Motives"; classes = "text-xl font-semibold text-white mb-2"; };
                              p { content = "Assumes secret plans"; classes = "text-white/80"; };
                            ];
                          };
                          div {
                            classes = "bg-indigo-500/20 p-6 rounded-2xl border border-white/30";
                            children = [
                              p { content = "Powerful Entities"; classes = "text-xl font-semibold text-white mb-2"; };
                              p { content = "Blames shadowy groups"; classes = "text-white/80"; };
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
    },

    SLIDE {
      div {
        classes = "absolute inset-0";
        children = [
          img {
            content = "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=1920&q=80";
            classes = "absolute inset-0 w-full h-full object-cover";
          };
          div {
            classes = "absolute inset-0 bg-gradient-to-r from-purple-900/90 to-pink-900/90";
            children = [
              div {
                classes = "h-full flex flex-col justify-center px-16 py-12 relative z-10";
                children = [
                  h2 { content = "Famous Conspiracy Theories"; classes = "text-6xl font-bold text-white mb-10 drop-shadow-lg"; };
                  div {
                    classes = "grid grid-cols-2 gap-8";
                    children = [
                      div {
                        classes = "bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-2xl";
                        children = [
                          h3 { content = "Historical"; classes = "text-3xl font-bold text-yellow-300 mb-6 border-b border-white/30 pb-4"; };
                          ul {
                            classes = "space-y-4";
                            children = [
                              li { content = "🌙 Moon Landing Hoax"; classes = "text-xl text-white flex items-center gap-3"; };
                              li { content = "🎯 JFK Assassination"; classes = "text-xl text-white flex items-center gap-3"; };
                              li { content = "👽 Area 51 & UFOs"; classes = "text-xl text-white flex items-center gap-3"; };
                              li { content = "👁️ Illuminati"; classes = "text-xl text-white flex items-center gap-3"; };
                              li { content = "🏛️ New World Order"; classes = "text-xl text-white flex items-center gap-3"; };
                            ];
                          };
                        ];
                      };
                      div {
                        classes = "bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-2xl";
                        children = [
                          h3 { content = "Modern Era"; classes = "text-3xl font-bold text-cyan-300 mb-6 border-b border-white/30 pb-4"; };
                          ul {
                            classes = "space-y-4";
                            children = [
                              li { content = "🌍 Flat Earth Theory"; classes = "text-xl text-white flex items-center gap-3"; };
                              li { content = "📡 5G Technology"; classes = "text-xl text-white flex items-center gap-3"; };
                              li { content = "🔍 QAnon Movement"; classes = "text-xl text-white flex items-center gap-3"; };
                              li { content = "🕵️ Deep State"; classes = "text-xl text-white flex items-center gap-3"; };
                              li { content = "💉 Vaccine Misinformation"; classes = "text-xl text-white flex items-center gap-3"; };
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
    },

    SLIDE {
      div {
        classes = "absolute inset-0";
        children = [
          img {
            content = "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1920&q=80";
            classes = "absolute inset-0 w-full h-full object-cover";
          };
          div {
            classes = "absolute inset-0 bg-gradient-to-bl from-green-900/85 to-teal-900/85";
            children = [
              div {
                classes = "h-full flex flex-col justify-center px-16 py-12 relative z-10";
                children = [
                  h2 { content = "Psychology Behind Conspiracies"; classes = "text-6xl font-bold text-white mb-10 drop-shadow-lg text-center"; };
                  div {
                    classes = "grid grid-cols-3 gap-6";
                    children = [
                      div {
                        classes = "bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-2xl transform hover:scale-105 transition-transform";
                        children = [
                          div {
                            classes = "text-5xl mb-4 text-center";
                            children = [
                              p { content = "🧠"; classes = ""; };
                            ];
                          };
                          h3 { content = "Pattern Recognition"; classes = "text-2xl font-bold text-white mb-4 text-center"; };
                          p { content = "Humans naturally seek patterns and connections, sometimes seeing them where none exist."; classes = "text-white/90 text-center leading-relaxed"; };
                        ];
                      };
                      div {
                        classes = "bg-gradient-to-br from-teal-500/20 to-cyan-500/20 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-2xl transform hover:scale-105 transition-transform";
                        children = [
                          div {
                            classes = "text-5xl mb-4 text-center";
                            children = [
                              p { content = "🎯"; classes = ""; };
                            ];
                          };
                          h3 { content = "Need for Control"; classes = "text-2xl font-bold text-white mb-4 text-center"; };
                          p { content = "Believing in conspiracies provides a sense of understanding and control over complex events."; classes = "text-white/90 text-center leading-relaxed"; };
                        ];
                      };
                      div {
                        classes = "bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-2xl transform hover:scale-105 transition-transform";
                        children = [
                          div {
                            classes = "text-5xl mb-4 text-center";
                            children = [
                              p { content = "👥"; classes = ""; };
                            ];
                          };
                          h3 { content = "Social Identity"; classes = "text-2xl font-bold text-white mb-4 text-center"; };
                          p { content = "Being part of a group with special knowledge strengthens social bonds and identity."; classes = "text-white/90 text-center leading-relaxed"; };
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
    },

    SLIDE {
      div {
        classes = "absolute inset-0";
        children = [
          img {
            content = "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=1920&q=80";
            classes = "absolute inset-0 w-full h-full object-cover";
          };
          div {
            classes = "absolute inset-0 bg-gradient-to-tr from-orange-900/90 to-red-900/90";
            children = [
              div {
                classes = "h-full flex flex-col justify-center px-16 py-12 relative z-10";
                children = [
                  h2 { content = "Cognitive Biases at Play"; classes = "text-6xl font-bold text-white mb-12 drop-shadow-lg"; };
                  div {
                    classes = "grid grid-cols-2 gap-8";
                    children = [
                      div {
                        classes = "bg-white/10 backdrop-blur-md rounded-2xl p-8 border-l-8 border-orange-400 shadow-xl";
                        children = [
                          h3 { content = "Confirmation Bias"; classes = "text-3xl font-bold text-orange-300 mb-4"; };
                          p { content = "Seeking information that confirms existing beliefs while ignoring contradictory evidence."; classes = "text-xl text-white/90 leading-relaxed"; };
                        ];
                      };
                      div {
                        classes = "bg-white/10 backdrop-blur-md rounded-2xl p-8 border-l-8 border-red-400 shadow-xl";
                        children = [
                          h3 { content = "Proportionality Bias"; classes = "text-3xl font-bold text-red-300 mb-4"; };
                          p { content = "Believing big events must have big causes, not simple explanations or coincidences."; classes = "text-xl text-white/90 leading-relaxed"; };
                        ];
                      };
                      div {
                        classes = "bg-white/10 backdrop-blur-md rounded-2xl p-8 border-l-8 border-yellow-400 shadow-xl";
                        children = [
                          h3 { content = "Clustering Illusion"; classes = "text-3xl font-bold text-yellow-300 mb-4"; };
                          p { content = "Seeing meaningful patterns in random data, events, or coincidences."; classes = "text-xl text-white/90 leading-relaxed"; };
                        ];
                      };
                      div {
                        classes = "bg-white/10 backdrop-blur-md rounded-2xl p-8 border-l-8 border-pink-400 shadow-xl";
                        children = [
                          h3 { content = "Attribution Error"; classes = "text-3xl font-bold text-pink-300 mb-4"; };
                          p { content = "Attributing events to intentional actions rather than circumstances or chance."; classes = "text-xl text-white/90 leading-relaxed"; };
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
    },

    SLIDE {
      div {
        classes = "absolute inset-0";
        children = [
          img {
            content = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1920&q=80";
            classes = "absolute inset-0 w-full h-full object-cover";
          };
          div {
            classes = "absolute inset-0 bg-gradient-to-br from-red-900/90 to-rose-900/90";
            children = [
              div {
                classes = "h-full flex flex-col justify-center px-16 py-12 relative z-10";
                children = [
                  h2 { content = "Societal Impact"; classes = "text-6xl font-bold text-white mb-10 drop-shadow-lg text-center"; };
                  div {
                    classes = "bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-white/30 shadow-2xl";
                    children = [
                      h3 { content = "Negative Consequences"; classes = "text-3xl font-bold text-red-300 mb-8 text-center"; };
                      ul {
                        classes = "space-y-5";
                        children = [
                          li {
                            classes = "bg-red-500/20 rounded-2xl p-5 border border-red-300/30";
                            children = [
                              p { content = "🏛️ Erosion of Trust"; classes = "text-2xl font-semibold text-white mb-2"; };
                              p { content = "Declining trust in institutions, experts, and democratic processes"; classes = "text-white/80 text-lg"; };
                            ];
                          };
                          li {
                            classes = "bg-red-500/20 rounded-2xl p-5 border border-red-300/30";
                            children = [
                              p { content = "💉 Public Health Risks"; classes = "text-2xl font-semibold text-white mb-2"; };
                              p { content = "Vaccine hesitancy and rejection of medical science"; classes = "text-white/80 text-lg"; };
                            ];
                          };
                          li {
                            classes = "bg-red-500/20 rounded-2xl p-5 border border-red-300/30";
                            children = [
                              p { content = "⚡ Political Polarization"; classes = "text-2xl font-semibold text-white mb-2"; };
                              p { content = "Increased radicalization and extremist ideologies"; classes = "text-white/80 text-lg"; };
                            ];
                          };
                          li {
                            classes = "bg-red-500/20 rounded-2xl p-5 border border-red-300/30";
                            children = [
                              p { content = "⚠️ Real-World Violence"; classes = "text-2xl font-semibold text-white mb-2"; };
                              p { content = "Harassment and violence against perceived enemies"; classes = "text-white/80 text-lg"; };
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
    },

    SLIDE {
      div {
        classes = "absolute inset-0";
        children = [
          img {
            content = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80";
            classes = "absolute inset-0 w-full h-full object-cover";
          };
          div {
            classes = "absolute inset-0 bg-gradient-to-tl from-teal-900/90 to-cyan-900/90";
            children = [
              div {
                classes = "h-full flex flex-col justify-center px-16 py-12 relative z-10";
                children = [
                  h2 { content = "Critical Thinking Tools"; classes = "text-6xl font-bold text-white mb-10 drop-shadow-lg text-center"; };
                  div {
                    classes = "bg-white/15 backdrop-blur-lg rounded-3xl p-10 border border-white/30 shadow-2xl";
                    children = [
                      h3 { content = "How to Evaluate Claims"; classes = "text-3xl font-bold text-cyan-300 mb-8 text-center"; };
                      div {
                        classes = "space-y-5";
                        children = [
                          div {
                            classes = "flex items-start gap-6 bg-teal-500/20 rounded-2xl p-6 border border-teal-300/30";
                            children = [
                              p { content = "1"; classes = "text-4xl font-black text-cyan-300 min-w-12"; };
                              p { content = "Check multiple credible sources before accepting claims"; classes = "text-xl text-white/90 leading-relaxed"; };
                            ];
                          };
                          div {
                            classes = "flex items-start gap-6 bg-teal-500/20 rounded-2xl p-6 border border-teal-300/30";
                            children = [
                              p { content = "2"; classes = "text-4xl font-black text-cyan-300 min-w-12"; };
                              p { content = "Look for peer-reviewed research and expert consensus"; classes = "text-xl text-white/90 leading-relaxed"; };
                            ];
                          };
                          div {
                            classes = "flex items-start gap-6 bg-teal-500/20 rounded-2xl p-6 border border-teal-300/30";
                            children = [
                              p { content = "3"; classes = "text-4xl font-black text-cyan-300 min-w-12"; };
                              p { content = "Ask: What evidence would disprove this claim?"; classes = "text-xl text-white/90 leading-relaxed"; };
                            ];
                          };
                          div {
                            classes = "flex items-start gap-6 bg-teal-500/20 rounded-2xl p-6 border border-teal-300/30";
                            children = [
                              p { content = "4"; classes = "text-4xl font-black text-cyan-300 min-w-12"; };
                              p { content = "Apply Occam's Razor: simpler explanations are often correct"; classes = "text-xl text-white/90 leading-relaxed"; };
                            ];
                          };
                          div {
                            classes = "flex items-start gap-6 bg-teal-500/20 rounded-2xl p-6 border border-teal-300/30";
                            children = [
                              p { content = "5"; classes = "text-4xl font-black text-cyan-300 min-w-12"; };
                              p { content = "Be aware of your own cognitive biases and assumptions"; classes = "text-xl text-white/90 leading-relaxed"; };
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
    },

    SLIDE {
      div {
        classes = "relative inset-0 border-2 ";
        children = [
          img {
            content = "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80";
            classes = "absolute inset-0 w-full h-auto object-cover";
          };
          div {
            classes = "w-full h-auto absolute inset-0 bg-gradient-to-br from-indigo-900/85 to-purple-900/85";
            children = [
              div {
                classes = "h-full flex flex-col items-center justify-center text-center px-12 relative z-10";
                children = [
                  h2 { content = "Key Takeaways"; classes = "text-6xl font-bold text-white mb-12 drop-shadow-lg"; };
                  div {
                    classes = "bg-white/15 backdrop-blur-lg rounded-3xl p-12 border border-white/30 shadow-2xl max-w-5xl";
                    children = [
                      p { content = "Understanding conspiracy theories helps us navigate information in the digital age. Critical thinking and evidence-based reasoning are essential for distinguishing fact from fiction."; classes = "text-2xl text-white/90 mb-10 leading-relaxed font-light"; };
                      div {
                        classes = "grid grid-cols-2 gap-6 mt-8";
                        children = [
                          div {
                            classes = "bg-indigo-500/30 rounded-2xl p-6 border border-indigo-300/40";
                            children = [
                              p { content = "✓ Question claims with evidence"; classes = "text-xl text-white font-semibold"; };
                            ];
                          };
                          div {
                            classes = "bg-purple-500/30 rounded-2xl p-6 border border-purple-300/40";
                            children = [
                              p { content = "✓ Understand cognitive biases"; classes = "text-xl text-white font-semibold"; };
                            ];
                          };
                          div {
                            classes = "bg-pink-500/30 rounded-2xl p-6 border border-pink-300/40";
                            children = [
                              p { content = "✓ Promote media literacy"; classes = "text-xl text-white font-semibold"; };
                            ];
                          };
                          div {
                            classes = "bg-blue-500/30 rounded-2xl p-6 border border-blue-300/40";
                            children = [
                              p { content = "✓ Engage with empathy"; classes = "text-xl text-white font-semibold"; };
                            ];
                          };
                        ];
                      };
                    ];
                  };
                  div {
                    classes = "mt-12";
                    children = [
                      p { content = "Thank You"; classes = "text-4xl font-light text-white/80"; };
                    ];
                  };
                ];
              };
            ];
          };
        ];
      };
    }
  ];
};
`;

export default function Page() {
  const slides = dslToSlides(dslString);
  const [current, setCurrent] = React.useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="w-full">
      <button className="absolute bottom-[40px] left-[40px] z-50 text-white bg-black/50 p-2 rounded" onClick={prevSlide}>Previous</button>
      <button className="absolute bottom-[40px] right-[40px] z-50 text-white bg-black/50 p-2 rounded" onClick={nextSlide}>Next</button>
      <div
        className="w-full h-full "
        dangerouslySetInnerHTML={{ __html: slides[current] }}
      />
    </div>)
}
