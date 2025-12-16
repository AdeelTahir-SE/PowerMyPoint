import React from 'react';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';
import { Rocket, GraduationCap, Briefcase } from 'lucide-react';

export const TemplatesGallerySection: React.FC = () => {
  return (
    <section className="w-full bg-slate-50 dark:bg-black py-24 px-4">
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
          Empowering Every Storyteller
        </h2>
        <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto">
          Experience the future of presentations with depth and interactivity.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-10 max-w-7xl mx-auto">
        {/* Card 1: Startups */}
        <CardContainer className="inter-var">
          <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              Startups & Founders
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
            >
              Pitch decks that pop. Secure funding with memorable visuals.
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
              <div className="w-full h-60 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl group-hover/card:shadow-xl flex items-center justify-center">
                <Rocket className="text-white w-20 h-20" />
              </div>
            </CardItem>
            <CardItem
              translateZ={20}
              className="mt-10 px-4"
            >
              <ul className="list-disc text-neutral-500 text-sm dark:text-neutral-300 space-y-2">
                <li>Investor-ready visuals in seconds</li>
                <li>Rapid iteration for A/B testing</li>
                <li>Data-driven storytelling components</li>
              </ul>
            </CardItem>
          </CardBody>
        </CardContainer>

        {/* Card 2: Enterprise */}
        <CardContainer className="inter-var">
          <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              Enterprise Teams
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
            >
              Standardize quarterly reports. Consistent branding instantly.
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
              <div className="w-full h-60 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl group-hover/card:shadow-xl flex items-center justify-center">
                <Briefcase className="text-white w-20 h-20" />
              </div>
            </CardItem>
            <CardItem
              translateZ={20}
              className="mt-10 px-4"
            >
              <ul className="list-disc text-neutral-500 text-sm dark:text-neutral-300 space-y-2">
                <li>Strict brand guideline enforcement</li>
                <li>Secure team collaboration</li>
                <li>Automated quarterly reporting</li>
              </ul>
            </CardItem>
          </CardBody>
        </CardContainer>

        {/* Card 3: Education */}
        <CardContainer className="inter-var">
          <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-orange-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              Educators
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
            >
              Engage students with 3D concepts. Simplify the complex.
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
              <div className="w-full h-60 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl group-hover/card:shadow-xl flex items-center justify-center">
                <GraduationCap className="text-white w-20 h-20" />
              </div>
            </CardItem>
            <CardItem
              translateZ={20}
              className="mt-10 px-4"
            >
              <ul className="list-disc text-neutral-500 text-sm dark:text-neutral-300 space-y-2">
                <li>Visual learning aids</li>
                <li>Instant lesson plan conversion</li>
                <li>Student engagement analytics</li>
              </ul>
            </CardItem>
          </CardBody>
        </CardContainer>
      </div>
    </section>
  );
};
