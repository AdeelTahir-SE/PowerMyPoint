import React from 'react';

interface Testimonial {
  name: string;
  role: string;
  imageUrl: string;
  quote: string;
}

interface TestimonialsSectionProps {
  className?: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sophia Carter',
    role: 'Marketing Director',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2IZxa_kGZp_4bLAvZbtEhob7PvH8IbEF6-Jey3d99KEdZWDO0Bnqiednp1KyOGj3ze9sA94IKbWZrlTWU1kLa5KIWnEukhxhu7KSyjck9nvIJwFAOwcUqjIFcJSENH39N9kfw8guUdrQBxRkEwL8rp6mFy0tldrsRlzdtXZqM3ZNQBH39aUVd75V8vT0dvlwQ6Slow5SqdcDF6FIpEjZwveMXPO0MyqbcsQCFvjfcVNfD8VgiXH8QYEGJHKPoVs1Ow7v5ws70TMRC',
    quote: 'PowerMyPoint has revolutionized my presentation workflow. I can now create stunning presentations in minutes, allowing me to focus on my content and delivery.',
  },
  {
    name: 'Ethan Bennett',
    role: 'Educator',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-ebMCdtp52_KyvrTfEmzqDS3VTNawJL_6BvEDae08UZ1Mrrxq_aUbzd1P3L4f126wXU0cVNoc7BCqULAYyndoZgCUb-dVlH9brg6m8tiI6Q_EX3dy8Gk1vRvH-SbaQDmsdPszBVetL4nUcB2-bB7LHspuWUqvkU_i9hfcX00ecAQ8hvSZbNvBkdEymSMn20J0Jc8xcr_N9k3l0HZCYEkSQr8HuakUHoFQxMtbRUuBIvoCAnqlJsXEHa6LReQTYImNcM_panDn1YGF',
    quote: 'The interactive features are a game-changer. My audience is more engaged than ever, and I receive valuable feedback in real-time.',
  },
  {
    name: 'Olivia Hayes',
    role: 'Startup Founder',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaKNpxzLVarYpk51TtYLt56MsDyz26pMmNGOWjnpNnoO6N4ab04J3tQn0bcxy699ho8UKJ7FIEnzwxirAmk6bMmUxB5RCHg4yKUJf8O5hiOO4dY4rBnZlpVw15wU08SF8Y4XOyNh7Kf57EmojkCPUEZ3cUH6WjK8i75HfLOk8FKHRzPLsuIKzkbM4s0JZLKUNp1k1s-FC5Cu5zXzFyA-LoQAT4gq1qcsdZy0lk72KE8ahVLNkEZWA2vz0VmNAzZft9O_XsfcpQnYgk',
    quote: 'I love the variety of templates and the AI-driven design. My presentations always look professional and polished, no matter the topic.',
  },
];

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ className = '' }) => {
  return (
    <section className={`w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24 xl:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12 md:mb-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-light dark:text-white md:text-4xl">
            Loved by innovators everywhere
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 sm:gap-6 rounded-xl border border-subtle-light/50 bg-white/50 p-5 sm:p-6 dark:bg-surface-dark/50 dark:border-subtle-dark/50 transition-all duration-300 hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/50"
            >
              {/* Author Info */}
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  alt={testimonial.name}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
                  src={testimonial.imageUrl}
                />
                <div>
                  <p className="text-sm sm:text-base font-bold text-text-light dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Quote */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};