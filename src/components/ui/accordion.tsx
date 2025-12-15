"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";

export const Accordion = ({
    items,
    className,
}: {
    items: {
        question: string;
        answer: string;
    }[];
    className?: string;
}) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <div className={cn("max-w-3xl mx-auto space-y-4", className)}>
            {items.map((item, index) => {
                const isOpen = activeIndex === index;
                return (
                    <div
                        key={index}
                        className="overflow-hidden bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl"
                    >
                        <button
                            onClick={() => setActiveIndex(isOpen ? null : index)}
                            className="flex justify-between items-center w-full p-4 md:p-6 text-left"
                        >
                            <h3 className="text-base md:text-lg font-medium text-neutral-800 dark:text-neutral-200">
                                {item.question}
                            </h3>
                            <div
                                className={cn(
                                    "p-1 rounded-full bg-neutral-100 dark:bg-zinc-800 transition-colors",
                                    isOpen ? "bg-indigo-100 dark:bg-indigo-900/30" : ""
                                )}
                            >
                                {isOpen ? (
                                    <Minus className="w-5 h-5 text-indigo-500" />
                                ) : (
                                    <Plus className="w-5 h-5 text-neutral-500" />
                                )}
                            </div>
                        </button>
                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <p className="p-4 md:p-6 pt-0 text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                        {item.answer}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
};
