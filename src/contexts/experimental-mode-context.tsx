'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ExperimentalModeContextType {
    experimentalMode: boolean;
    toggleExperimentalMode: () => void;
}

const ExperimentalModeContext = createContext<ExperimentalModeContextType | undefined>(undefined);

const EXPERIMENTAL_MODE_KEY = 'presentation-experimental-mode';

export function ExperimentalModeProvider({ children }: { children: React.ReactNode }) {
    const [experimentalMode, setExperimentalMode] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(EXPERIMENTAL_MODE_KEY);
        if (saved !== null) {
            setExperimentalMode(saved === 'true');
        }
        setIsInitialized(true);
    }, []);

    // Save to localStorage when it changes
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(EXPERIMENTAL_MODE_KEY, experimentalMode.toString());
        }
    }, [experimentalMode, isInitialized]);

    const toggleExperimentalMode = () => {
        setExperimentalMode(prev => !prev);
    };

    const value = {
        experimentalMode,
        toggleExperimentalMode,
    };

    return (
        <ExperimentalModeContext.Provider value={value}>
            {children}
        </ExperimentalModeContext.Provider>
    );
}

export function useExperimentalMode() {
    const context = useContext(ExperimentalModeContext);
    if (context === undefined) {
        throw new Error('useExperimentalMode must be used within an ExperimentalModeProvider');
    }
    return context;
}

