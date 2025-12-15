import React from 'react';
import { InfiniteMovingCards } from './ui/infinite-moving-cards';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <h2 className="text-3xl font-bold text-center mb-8 z-10 text-gray-900 dark:text-white">Loved by innovators everywhere</h2>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </section>
  );
};

const testimonials = [
  {
    quote:
      "PowerMyPoint has revolutionized my presentation workflow. I can now create stunning presentations in minutes, allowing me to focus on my content and delivery.",
    name: "Sophia Carter",
    title: "Marketing Director",
  },
  {
    quote:
      "The interactive features are a game-changer. My audience is more engaged than ever, and I receive valuable feedback in real-time.",
    name: "Ethan Bennett",
    title: "Educator",
  },
  {
    quote: "I love the variety of templates and the AI-driven design. My presentations always look professional and polished, no matter the topic.",
    name: "Olivia Hayes",
    title: "Startup Founder",
  },
  {
    quote:
      "The best presentation tool I have ever used. It is intuitive, powerful, and produces amazing results.",
    name: "Marcus Reid",
    title: "Product Manager",
  },
  {
    quote:
      "Finally, a tool that understands what I need. The AI generation is spot on and saves me hours of work.",
    name: "Jessica Chen",
    title: "Consultant",
  },
];
