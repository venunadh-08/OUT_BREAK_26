import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { FloatingElements } from './FloatingElements';

const IntroOverlay = ({ onComplete }) => {
    // Intro logic has been moved to separate Intro.jsx component
    // This component is kept to strictly avoid breaking imports/state
    // But ideally should be refactored out.
    // For now, it just calls onComplete immediately to hide itself if still used.
    useEffect(() => {
        onComplete();
    }, [onComplete]);
    return null;
};

export const Hero = ({ onRegister }) => {
    const heroRef = useRef(null);
    const [introFinished, setIntroFinished] = useState(false);

    useEffect(() => {
        // If Intro component is used in App.jsx, we might want to wait for it.
        // Assuming App.jsx handles the Intro visibility, we can just start animations.
        // Or if App.jsx passes a prop, that would be better. 
        // For now, let's trigger animations immediately or on mount.

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from(".logo-box", {
                scale: 0,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "back.out(1.7)"
            })
                .from(".title-text", {
                    x: -50,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power3.out"
                }, "-=0.4")
                .from(".subtitle", {
                    y: 20,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out"
                }, "-=0.5")
                .from(".cta-group", {
                    y: 20,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.3");

            // Floating particles effect
            gsap.to(".particle", {
                y: "-=100",
                opacity: 0,
                duration: "random(1, 2.5)",
                repeat: -1,
                stagger: 0.1,
                ease: "none",
                x: "random(-20, 20)"
            });

        }, heroRef);

        return () => ctx.revert();
    }, []);

    // Original LogoBox Component
    const LogoBox = ({ symbol, number, color = "#1a4d2e" }) => (
        <div
            className="logo-box shrink-0 flex flex-col justify-center items-center p-2 relative"
            style={{
                width: 'clamp(80px, 15vw, 120px)',
                height: 'clamp(80px, 15vw, 120px)',
                backgroundColor: color,
                border: 'clamp(4px, 1vw, 6px) solid white',
                boxShadow: '0 0 30px rgba(26, 77, 46, 0.4)'
            }}
        >
            <span className="absolute top-2 right-3 text-sm md:text-lg font-bold text-white font-serif">{number}</span>
            <span className="text-4xl md:text-6xl font-bold text-white leading-none font-serif mb-1">{symbol}</span>
        </div>
    );

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section id="hero" ref={heroRef} className="relative min-h-screen min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden py-20">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                {/* Image Layer */}
                {/* Image Layer */}
                <img
                    src="/breaking%20bad.png"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-contain md:object-cover opacity-20 mix-blend-overlay filter grayscale contrast-125 bg-black"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-amber-400/10 via-amber-600/5 to-transparent"></div>
                <div
                    className="absolute inset-0 opacity-60 mix-blend-soft-light"
                    style={{
                        background: 'radial-gradient(circle at 50% 50%, #d17a22 0%, transparent 100%)'
                    }}
                ></div>
                {/* Floating Elements (New) */}
                <FloatingElements />

                {/* Particle Overlay */}
                {[...Array(isMobile ? 8 : 20)].map((_, i) => (
                    <div
                        key={i}
                        className="particle absolute w-1 h-1 bg-amber-400/40 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${100 + Math.random() * 20}%`,
                            willChange: 'transform',
                            transform: 'translateZ(0)'
                        }}
                    ></div>
                ))}
            </div>

            {/* Hero Content */}
            <div className="relative z-20 text-center px-4 w-full">
                <div className="flex flex-col items-center mb-12">
                    {/* STACKED LAYOUT (Matching Intro.jsx) */}
                    <div className="flex flex-col items-start relative max-w-4xl">

                        {/* FIRST ROW: O-ut */}
                        <div className="flex items-end z-20">
                            <LogoBox symbol="O" number="8" />
                            <span className="title-text text-5xl md:text-[6rem] font-serif text-white tracking-tight ml-3 drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] leading-none">
                                ut
                            </span>
                        </div>

                        {/* SECOND ROW: Br-eak'26 */}
                        {/* ml-8 md:ml-12 lg:ml-16 to align Br to middle of O */}
                        {/* -mt-2 to make them touch vertically */}
                        <div
                            className="flex items-end z-10"
                            style={{ marginLeft: 'clamp(80px, 15vw, 120px)' }}
                        >
                            <LogoBox symbol="Br" number="35" />
                            <span className="title-text text-5xl md:text-[6rem] font-serif text-white tracking-tight ml-3 drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] leading-none">
                                eak'26
                            </span>
                        </div>

                    </div>

                    <p className="subtitle text-neon-green text-sm md:text-lg font-bold tracking-[0.4em] mt-12 flicker uppercase">
                        Breaking Code
                    </p>
                </div>

                <div className="max-w-2xl mx-auto">
                    <h2 className="subtitle text-text-secondary text-lg md:text-xl font-light leading-relaxed mb-12">
                        24-Hour Hackathon by <span className="text-white font-semibold">GFG Campus Body KARE</span><br />
                        Department of Computer Science and Engineering
                    </h2>

                    <div className="cta-group flex flex-wrap justify-center gap-4 md:gap-6">
                        <button onClick={onRegister} className="relative px-6 py-3 md:px-8 md:py-4 bg-neon-green text-black font-bold rounded-sm border border-neon-green hover:bg-yellow-500 hover:text-black transition-all duration-300 group shadow-[0_0_20px_rgba(26,255,125,0.6)] overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2 tracking-widest font-mono text-xs md:text-sm font-black">
                                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black rounded-full animate-pulse"></span>
                                COOK CRYSTAL_GLASS
                            </span>
                        </button>
                        <button
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 bg-transparent border border-white/10 text-gray-300 font-bold rounded-sm hover:border-yellow-500 hover:text-yellow-500 transition-all duration-300 tracking-widest font-mono text-sm group"
                        >
                            <span className="group-hover:drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]">VIEW_DATA</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Decorative Blur */}
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-neon-green/10 blur-[100px] rounded-full"></div>
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#1a4d2e]/5 blur-[100px] rounded-full"></div>
        </section>
    );
};
