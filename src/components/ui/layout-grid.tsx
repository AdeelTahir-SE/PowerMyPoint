"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

type Card = {
    id: number;
    content: React.ReactNode | string;
    className: string;
    thumbnail: string;
    title?: string;
};

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
    const [selected, setSelected] = useState<Card | null>(null);
    const [lastSelected, setLastSelected] = useState<Card | null>(null);

    const handleMouseEnter = (card: Card) => {
        setLastSelected(selected);
        setSelected(card);
    };

    const handleMouseLeave = () => {
        setLastSelected(selected);
        setSelected(null);
    };

    return (
        <div className="w-full h-full p-10 grid grid-cols-1 md:grid-cols-3  max-w-7xl mx-auto gap-4 relative">
            {cards.map((card, i) => (
                <div key={i} className={cn(card.className, "")}>
                    <motion.div
                        onMouseEnter={() => handleMouseEnter(card)}
                        onMouseLeave={handleMouseLeave}
                        className={cn(
                            card.className,
                            "relative overflow-hidden",
                            "bg-white rounded-xl h-full w-full"
                        )}
                        layout
                    >
                        {selected?.id === card.id && <SelectedCard selected={selected} />}
                        <BlurImage card={card} />
                        {selected?.id !== card.id && card.title && (
                            <div className="absolute bottom-4 left-4 z-20">
                                <h3 className="text-white text-xl font-bold drop-shadow-md">{card.title}</h3>
                            </div>
                        )}
                        {selected?.id !== card.id && (
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
                        )}
                    </motion.div>
                </div>
            ))}
        </div>
    );
};

const BlurImage = ({ card }: { card: Card }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <img
            src={card.thumbnail}
            height="500"
            width="500"
            onLoad={() => setLoaded(true)}
            className={cn(
                "object-cover object-top absolute inset-0 h-full w-full transition duration-200",
                loaded ? "blur-none" : "blur-md"
            )}
            alt="thumbnail"
        />
    );
};

const SelectedCard = ({ selected }: { selected: Card | null }) => {
    return (
        <div className="bg-transparent h-full w-full flex flex-col justify-end rounded-lg shadow-2xl relative z-[60]">
            <motion.div
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 0.6,
                }}
                className="absolute inset-0 h-full w-full bg-black opacity-60 z-10"
            />
            <motion.div
                initial={{
                    opacity: 0,
                    y: 100,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                }}
                className="relative px-8 pb-4 z-[70]"
            >
                {selected?.content}
            </motion.div>
        </div>
    );
};
