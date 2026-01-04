'use client';

import { useEffect, useRef, useState } from 'react';

interface TurnstileProps {
    siteKey: string;
    onVerify: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
    theme?: 'light' | 'dark' | 'auto';
}

declare global {
    interface Window {
        turnstile?: {
            render: (container: HTMLElement, options: any) => string;
            reset: (widgetId: string) => void;
            remove: (widgetId: string) => void;
        };
        onloadTurnstileCallback?: () => void;
    }
}

export default function Turnstile({ siteKey, onVerify, onError, onExpire, theme = 'auto' }: TurnstileProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        if (scriptLoaded) return;

        // Check if script is already present
        const existingScript = document.querySelector('script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]');
        
        if (existingScript) {
            setScriptLoaded(true);
        } else {
            const script = document.createElement('script');
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
            script.onload = () => setScriptLoaded(true);
        }
    }, [scriptLoaded]);

    useEffect(() => {
        if (!scriptLoaded || !containerRef.current || !window.turnstile) return;

        // If widget already exists, don't re-render
        if (widgetId.current) return;

        const id = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => onVerify(token),
            'error-callback': () => onError?.(),
            'expired-callback': () => onExpire?.(),
            theme,
        });

        widgetId.current = id;

        return () => {
            if (widgetId.current && window.turnstile) {
                window.turnstile.remove(widgetId.current);
                widgetId.current = null;
            }
        };
    }, [scriptLoaded, siteKey, onVerify, onError, onExpire, theme]);

    return <div ref={containerRef} style={{ minHeight: '65px' }} />;
}
