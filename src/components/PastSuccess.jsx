import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import TiltCard from './TiltCard';
import { FloatingElements } from './FloatingElements';

const events = [
    {
        name: "NATIONAL SKILL UP",
        image: "/image.png", // Using the confirmed local image
        year: "2025"
    },
    {
        name: "HACK HEIST",
        image: "/image1.png",
        year: "2025"
    },
    {
        name: "GEEKS FEST",
        image: "/image2.png",
        year: "2025"
    },
    {
        name: "ALGORITHMST 26",
        image: "/image3.png",
        year: "2026"
    }
];

export const PastSuccess = () => {
    const sectionRef = useRef(null);
    const [isMobile, setIsMobile] = React.useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Floating Particles Animation
            gsap.to(".past-particle", {
                y: "random(-100, 100)",
                x: "random(-50, 50)",
                opacity: "random(0.3, 0.8)",
                duration: "random(3, 6)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: {
                    amount: 2,
                    from: "random"
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="past-success" ref={sectionRef} className="py-24 relative overflow-hidden bg-black/20">
            {/* Background Atmosphere w/ Breaking Bad Theme - Matches Features */}
            <div className="absolute inset-0 z-0">
                {/* Hero-like Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-amber-400/10 via-amber-600/5 to-transparent"></div>
                <div
                    className="absolute inset-0 opacity-60 mix-blend-soft-light"
                    style={{
                        background: 'radial-gradient(circle at 50% 50%, #d17a22 0%, transparent 100%)'
                    }}
                ></div>

                {/* Floating Elements */}
                <FloatingElements />

                {/* Floating Particles (Amber) */}
                {[...Array(isMobile ? 5 : 15)].map((_, i) => (
                    <div
                        key={i}
                        className="past-particle absolute w-1 h-1 bg-amber-400/40 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: Math.random() < 0.5 ? '4px' : '2px',
                            height: Math.random() < 0.5 ? '4px' : '2px',
                        }}
                    ></div>
                ))}
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-amber-500 font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Archive Access</span>
                    <h2 className="text-white text-4xl md:text-5xl font-black font-cinematic mb-4">
                        PREVIOUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-500">OPERATIONS</span>
                    </h2>
                    <div className="h-1 w-24 bg-neon-green/30 mx-auto rounded-full"></div>
                </div>

                {/* Professional Grid Layout - Case Files */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {events.map((event, index) => (
                        <div key={index} className="h-[300px] group perspective-1000">
                            <TiltCard className="w-full h-full">
                                <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10 hover:border-neon-green/50 transition-all duration-500 shadow-lg hover:shadow-[0_0_30px_rgba(26,255,125,0.15)] bg-black/40 backdrop-blur-sm flex flex-col">

                                    {/* Image Container - Professional Clear View */}
                                    <div className="relative h-full w-full overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 opacity-90 transition-opacity group-hover:opacity-80"></div>
                                        <img
                                            src={event.image}
                                            alt={event.name}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-110"
                                        />
                                    </div>

                                    {/* Content - Professional Case File Look */}
                                    <div className="absolute bottom-0 left-0 w-full p-6 z-30 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-amber-400 font-mono text-xs font-bold px-2 py-1 border border-amber-500/30 rounded bg-amber-500/10 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">{event.year}</span>
                                            <div className="flex gap-1">
                                                <span className="w-1 h-1 bg-amber-200/50 rounded-full"></span>
                                                <span className="w-1 h-1 bg-amber-200/50 rounded-full"></span>
                                                <span className="w-1 h-1 bg-amber-200/50 rounded-full"></span>
                                            </div>
                                        </div>
                                        <h3 className="text-white font-bold text-2xl font-cinematic tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:text-amber-300 transition-colors">
                                            {event.name}
                                        </h3>
                                        <div className="w-full h-[1px] bg-gradient-to-r from-amber-500/50 to-transparent mt-4 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>
                                    </div>

                                    {/* Decoration Lines */}
                                    <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-amber-500/30 z-30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-amber-500/30 z-30 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                </div>
                            </TiltCard>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
