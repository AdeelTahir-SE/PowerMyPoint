import React from 'react';
import { HoverEffect } from './ui/card-hover-effect';

export const TemplatesGallerySection: React.FC = () => {
  return (
    <section className="w-full bg-slate-50 dark:bg-black py-20 px-4">
      <div className="max-w-5xl mx-auto px-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Explore Our Template Gallery
        </h2>
        <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">
          Professionally designed templates for every occasion. Choose a style and let AI fill in the details.
        </p>
        <HoverEffect items={templates} />
      </div>
    </section>
  );
};

const templates = [
  {
    title: 'Business Strategy',
    description: 'Outline business strategies and goals effectively. Perfect for quarterly reviews and pitch decks.',
    link: '/templates/business',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAINx7bripsc6U3kZ5x_6xW0IwSAmE8Z6vyL0Mjz0x4yMGSlfmNqvT5D3CMNSHzwlANzyK3nsmEwzJ_Bqn_lUPUEmH8iqsPleggBPYkcwWiexYNkV-xNsseeUZGXH9q9FERbAisIn0pkHAK-6FQ9Gehr43m_s01-DmiWieK8gENQdkYbz4Ne2ibaq2XwBCHLA_-phX46I9YxZoua_Ea_lP0BnYp8YTXhXlYSQnQWIF1FipbDEMLMKg3rcT1pu43VTQzCtlTCLsfq58o',
  },
  {
    title: 'Product Launch',
    description: 'Introduce new products or services with style. Highlight features, pricing, and launch timelines.',
    link: '/templates/launch',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAMcU1vrkdLEqszKCrSzVQq6goyjrhXyg_8PUpyNXf3pmWPujJEp1jsw0J8rNgCXWjYmokq1-FDYSnld0bWqq9h6e93-wrmUUaKDPKSuR4olshG0va3YG-9MJwm72rciYDO0uHoBWz5N_gGLGgH0uXDSTphiipca89CsaddvWhQn7cAo5qHgDgj83P3egjejzRXJSD9BBTz13wcLAoDrqzhMSdgB3I45aP5SkvzdhS5MBDFUcQfNamYOHC_CPdYu2GzU7SpcTdZY4s',
  },
  {
    title: 'Conference Keynote',
    description: 'Deliver engaging keynote speeches that captivate. Big typography and bold visuals.',
    link: '/templates/conference',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChvbAGKleRDmOBbsbD82amNQkrPSGyGPLaPi9-dnnzJDO7x68LdBfDonlzUwxW6M8MbAgpbk_vxQiCU0pFO0u8dIule4FNQVfh5y7r1bW0A8xqd3rWZa80C3OmvL6yTsonqP0Fvk6ZRKqkj6-wwJMQZhgGlWEQutmr2QcI0FQJOs74KRSg7bR0o4ywhVwIw1veWWWnx6dI2srHp12WM1AF8YPVn_Hds-AQH8l17mJ2hR5XHXQLIpjSOrhyaDb3kkgUQ1JmxgTbExkR',
  },
  {
    title: 'Team Meeting',
    description: 'Facilitate productive team meetings. Agenda slides, data visualization, and action items.',
    link: '/templates/meeting',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtnR_SzEaMdChYl6sYqCkTGfJULD_RBNJDV0ng33wCW5Bv5kbTL8mHCO1_98ut_ZzpjPAmcK18B9VExIA6VyO3QfMVy2CJf7jKkkbwjQvQ_SPR5WPTmhJgf9cpeG7vfL0ylxanHm5HdO2hRi0Onkpv8AaSRqWNXGRBGvFs58GKsI9yw4QRN6uAAEuwxGEFeaDe8_JEuYIB3EiuGmx80eNI3RqkSmcgOScVQSYZgjp81TH9k1K1YaF-lRb1zAqGYJ2mHiZAeipDA4cv',
  },
  {
    title: 'Educational Lecture',
    description: 'Clean layouts for complex topics. Perfect for teachers, professors, and trainers.',
    link: '/templates/education',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2574&auto=format&fit=crop',
  },
  {
    title: 'Portfolio Showcase',
    description: 'Show off your best work with image-heavy slides and minimalist captions.',
    link: '/templates/portfolio',
    image: 'https://images.unsplash.com/photo-1481487484168-9b9308a0ade7?q=80&w=2670&auto=format&fit=crop',
  }
];
