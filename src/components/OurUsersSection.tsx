import React from 'react';
import { InfiniteMovingLogos } from './ui/infinite-moving-logos';

export const OurUsersSection: React.FC = () => {
    return (
        <section className="w-full bg-slate-50 dark:bg-black py-20 px-4">
            <div className="max-w-6xl mx-auto mb-10 text-center">
                <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium">
                    Trusted by innovative teams at
                </p>
            </div>
            <div className="h-20 rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
                <InfiniteMovingLogos
                    items={logos}
                    direction="right"
                    speed="slow"
                />
            </div>
        </section>
    );
};

const logos = [
    {
        name: "Google",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png",
    },
    {
        name: "Microsoft",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1280px-Microsoft_logo_%282012%29.svg.png",
    },
    {
        name: "Netflix",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png",
    },
    {
        name: "Airbnb",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png",
    },
    {
        name: "Amazon",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
    },
    {
        name: "Stripe",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png",
    }
];
