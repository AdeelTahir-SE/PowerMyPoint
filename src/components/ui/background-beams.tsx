"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    const beams = [
        {
            initial: {
                x: 0,
                y: 0,
                rotate: 0,
            },
            animate: {
                x: [0, 40, -40, 0],
                y: [0, 60, -60, 0],
                rotate: [0, 10, -10, 0],
            },
            transition: {
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse" as const,
            },
        },
        {
            initial: {
                x: 600,
                y: 0,
                rotate: 0,
            },
            animate: {
                x: [600, 640, 560, 600],
                y: [0, 60, -60, 0],
                rotate: [0, 10, -10, 0],
            },
            transition: {
                duration: 25,
                repeat: Infinity,
                repeatType: "reverse" as const,
            },
        },
        // Add more beams effectively
    ];

    return (
        <div
            className={cn(
                "absolute inset-0 w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden",
                className
            )}
        >
            <div className="absolute h-full w-full bg-slate-950">
                {/* Custom SVG Drawing Beam Effects */}
                <motion.div
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-sky-500/20 blur-[120px] rounded-full"
                />
                <motion.div
                    initial={{ opacity: 0.1 }}
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[100px] rounded-full"
                />
            </div>
            <div className="absolute inset-0 bg-slate-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        </div>
    );
};
