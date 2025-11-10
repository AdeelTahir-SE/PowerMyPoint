import React from 'react';

interface Template {
  title: string;
  description: string;
  imageUrl: string;
}

interface TemplatesGallerySectionProps {
  className?: string;
}

const templates: Template[] = [
  {
    title: 'Business Strategy',
    description: 'Outline business strategies and goals.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAINx7bripsc6U3kZ5x_6xW0IwSAmE8Z6vyL0Mjz0x4yMGSlfmNqvT5D3CMNSHzwlANzyK3nsmEwzJ_Bqn_lUPUEmH8iqsPleggBPYkcwWiexYNkV-xNsseeUZGXH9q9FERbAisIn0pkHAK-6FQ9Gehr43m_s01-DmiWieK8gENQdkYbz4Ne2ibaq2XwBCHLA_-phX46I9YxZoua_Ea_lP0BnYp8YTXhXlYSQnQWIF1FipbDEMLMKg3rcT1pu43VTQzCtlTCLsfq58o',
  },
  {
    title: 'Product Launch',
    description: 'Introduce new products or services.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAMcU1vrkdLEqszKCrSzVQq6goyjrhXyg_8PUpyNXf3pmWPujJEp1jsw0J8rNgCXWjYmokq1-FDYSnld0bWqq9h6e93-wrmUUaKDPKSuR4olshG0va3YG-9MJwm72rciYDO0uHoBWz5N_gGLGgH0uXDSTphiipca89CsaddvWhQn7cAo5qHgDgj83P3egjejzRXJSD9BBTz13wcLAoDrqzhMSdgB3I45aP5SkvzdhS5MBDFUcQfNamYOHC_CPdYu2GzU7SpcTdZY4s',
  },
  {
    title: 'Conference Keynote',
    description: 'Deliver engaging keynote speeches.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChvbAGKleRDmOBbsbD82amNQkrPSGyGPLaPi9-dnnzJDO7x68LdBfDonlzUwxW6M8MbAgpbk_vxQiCU0pFO0u8dIule4FNQVfh5y7r1bW0A8xqd3rWZa80C3OmvL6yTsonqP0Fvk6ZRKqkj6-wwJMQZhgGlWEQutmr2QcI0FQJOs74KRSg7bR0o4ywhVwIw1veWWWnx6dI2srHp12WM1AF8YPVn_Hds-AQH8l17mJ2hR5XHXQLIpjSOrhyaDb3kkgUQ1JmxgTbExkR',
  },
  {
    title: 'Team Meeting',
    description: 'Facilitate productive team meetings.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtnR_SzEaMdChYl6sYqCkTGfJULD_RBNJDV0ng33wCW5Bv5kbTL8mHCO1_98ut_ZzpjPAmcK18B9VExIA6VyO3QfMVy2CJf7jKkkbwjQvQ_SPR5WPTmhJgf9cpeG7vfL0ylxanHm5HdO2hRi0Onkpv8AaSRqWNXGRBGvFs58GKsI9yw4QRN6uAAEuwxGEFeaDe8_JEuYIB3EiuGmx80eNI3RqkSmcgOScVQSYZgjp81TH9k1K1YaF-lRb1zAqGYJ2mHiZAeipDA4cv',
  },
];

export const TemplatesGallerySection: React.FC<TemplatesGallerySectionProps> = ({ className = '' }) => {
  return (
    <section className={`w-full bg-background-light px-4 py-12 dark:bg-surface-dark sm:px-6 sm:py-16 md:py-20 lg:py-24 xl:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12 md:mb-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-light dark:text-white md:text-4xl">
            Explore Our Template Gallery
          </h2>
          <p className="mt-3 sm:mt-4 max-w-3xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 px-4">
            Professionally designed templates for every occasion.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template, index) => (
            <div
              key={index}
              className="group flex flex-col gap-3 sm:gap-4 overflow-hidden rounded-xl border border-subtle-light/50 bg-white dark:border-subtle-dark/50 dark:bg-background-dark transition-all duration-300 hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/50"
            >
              {/* Template Image */}
              <div className="aspect-video w-full overflow-hidden">
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundImage: `url("${template.imageUrl}")` }}
                ></div>
              </div>

              {/* Template Info */}
              <div className="p-4 pt-0">
                <h3 className="text-base sm:text-lg font-bold text-text-light dark:text-white">
                  {template.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {template.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};