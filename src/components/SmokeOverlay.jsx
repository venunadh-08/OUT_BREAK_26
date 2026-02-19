import React, { useState, useEffect } from 'react';

export const SmokeOverlay = () => {
    const [isMobile, setIsMobile] = useState(true); // Default to true to prevent initial render spike

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile) return null;

    return (
        <div className="smoke-overlay">
            <svg width="0" height="0">
                <filter id="smoke">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="turbulence" />
                    <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="30" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </svg>
        </div>
    );
};
