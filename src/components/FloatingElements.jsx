import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Beaker, FlaskConical, Flame, Skull, Atom, Zap } from 'lucide-react';

const elements = [
    { type: 'text', symbol: 'C', number: 6, top: '5%', left: '10%', size: 'md' },
    { type: 'icon', component: <Beaker size={24} />, top: '15%', left: '25%', size: 'lg' },
    { type: 'text', symbol: 'H', number: 1, top: '25%', left: '80%', size: 'lg' },
    { type: 'icon', component: <Flame size={24} />, top: '35%', left: '60%', size: 'md' },
    { type: 'text', symbol: 'N', number: 7, top: '80%', left: '15%', size: 'sm' },
    { type: 'icon', component: <Skull size={24} />, top: '65%', left: '40%', size: 'xl' },
    { type: 'text', symbol: 'O', number: 8, top: '70%', left: '85%', size: 'md' },
    { type: 'icon', component: <FlaskConical size={24} />, top: '50%', left: '5%', size: 'lg' },
    { type: 'text', symbol: 'Na', number: 11, top: '40%', left: '90%', size: 'sm' },
    { type: 'icon', component: <Atom size={24} />, top: '10%', left: '70%', size: 'md' },
    { type: 'text', symbol: 'Cl', number: 17, top: '90%', left: '50%', size: 'lg' },
    { type: 'icon', component: <Zap size={24} />, top: '20%', left: '40%', size: 'sm' },
    { type: 'text', symbol: 'Br', number: 35, top: '60%', left: '80%', size: 'xl' },
    { type: 'icon', component: <Flame size={24} />, top: '85%', left: '90%', size: 'md' },
    { type: 'text', symbol: 'Ba', number: 56, top: '30%', left: '10%', size: 'md' },
    { type: 'text', symbol: 'Li', number: 3, top: '15%', left: '45%', size: 'md' },
    { type: 'text', symbol: 'Ag', number: 47, top: '75%', left: '25%', size: 'lg' },
    { type: 'text', symbol: 'Au', number: 79, top: '55%', left: '75%', size: 'sm' },
    { type: 'text', symbol: 'Hg', number: 80, top: '85%', left: '60%', size: 'md' },
    { type: 'text', symbol: 'Pb', number: 82, top: '25%', left: '5%', size: 'lg' },
    { type: 'text', symbol: 'U', number: 92, top: '90%', left: '30%', size: 'sm' },
];

export const FloatingElements = () => {
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = React.useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Kill any existing tweens to prevent buildup
            gsap.killTweensOf(".chemical-element");

            // Initial fade in
            gsap.fromTo(".chemical-element",
                { opacity: 0 },
                { opacity: isMobile ? 0.2 : 0.25, duration: 1, ease: "power2.out" }
            );

            gsap.to(".chemical-element", {
                y: () => gsap.utils.random(isMobile ? -25 : -45, isMobile ? 25 : 45) + "vh",
                x: () => gsap.utils.random(isMobile ? -25 : -45, isMobile ? 25 : 45) + "vw",
                rotation: () => gsap.utils.random(-180, 180),
                duration: () => gsap.utils.random(isMobile ? 10 : 15, isMobile ? 25 : 30), // Increased duration for smoother, fluid movement
                repeat: -1,
                yoyo: true,
                repeatRefresh: true,
                ease: "sine.inOut",
                force3D: true,
                stagger: {
                    amount: 2,
                    from: "random"
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, [isMobile]); // Re-run animation setup when mobile state changes

    // Reduce element count significantly on mobile to improve performance
    const displayElements = isMobile ? elements.slice(0, 8) : elements;

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {displayElements.map((el, index) => (
                <div
                    key={index}
                    className={`chemical-element absolute flex flex-col justify-center items-center
                    ${el.size === 'sm' ? 'w-12 h-12' : el.size === 'md' ? 'w-16 h-16' : el.size === 'lg' ? 'w-20 h-20' : 'w-24 h-24'}
                    ${el.type === 'text' && !isMobile ? 'border border-white/20 bg-white/5 backdrop-blur-[1px]' : ''} 
                    ${el.type === 'text' && isMobile ? 'opacity-50' : ''}
                    ${el.type === 'icon' ? 'text-neon-green/80' : 'text-white'}
                    `}
                    style={{
                        top: el.top,
                        left: el.left,
                        opacity: isMobile ? 0.2 : 0.25,
                        willChange: 'transform', // Performance hint globally
                        transform: 'translate3d(0,0,0)', // GPU Activation globally
                        boxShadow: el.type === 'text' && !isMobile ? '0 0 15px rgba(26, 255, 125, 0.1)' : 'none'
                    }}
                >
                    {el.type === 'text' ? (
                        <>
                            <span className="absolute top-1 right-2 text-[10px] md:text-xs text-white/70 font-serif font-bold">{el.number}</span>
                            <span className={`font-bold font-serif ${el.size === 'sm' ? 'text-lg' : el.size === 'md' ? 'text-2xl' : 'text-3xl'}`}>
                                {el.symbol}
                            </span>
                        </>
                    ) : (
                        <div className={`opacity-80 ${el.size === 'xl' ? 'scale-150' : el.size === 'lg' ? 'scale-125' : 'scale-100'}`}>
                            {el.component}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
