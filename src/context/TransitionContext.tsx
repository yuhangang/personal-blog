'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type TransitionContextType = {
    shouldAnimate: boolean;
};

const TransitionContext = createContext<TransitionContextType>({ shouldAnimate: false });

export const useTransition = () => useContext(TransitionContext);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        // After initial mount, enable animations for subsequent navigations
        // We use a small timeout to ensure the first paint has happened without animation
        const timer = setTimeout(() => {
            setShouldAnimate(true);
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <TransitionContext.Provider value={{ shouldAnimate }}>
            {children}
        </TransitionContext.Provider>
    );
}
