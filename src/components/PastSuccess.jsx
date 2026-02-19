import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import TiltCard from './TiltCard';
import { FloatingElements } from './FloatingElements';

const events = [
    {
        name: "ALGORITHMST 2.0",
        image: "/gfg.jpeg", // Using the confirmed local image
        year: "2025"
    },
    {
        name: "HACK OVERFLOW",
        image: "/gfg.jpeg",
        year: "2024"
    },
    {
        name: "CODE SPRINT",
        image: "/gfg.jpeg",
        year: "2023"
    },
    {
        name: "DEV HOST",
        image: "/gfg.jpeg",
        year: "2022"
    },
    {
        name: "WEB WIZARDS",
        image: "/image.png",
        year: "2024"
    }
];

export const PastSuccess = () => {
    const sectionRef = useRef(null);

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
            {/* Background Atmosphere - Breaking Bad */}
            <div className="absolute inset-0 z-0">
                {/* Background Atmosphere */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-amber-900/10 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"></div>

                {/* Floating Elements */}
                <FloatingElements />

                {/* Floating Particles */}
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="past-particle absolute w-1 h-1 bg-neon-green/30 rounded-full"
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
                    <span className="text-neon-green font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Archive Access</span>
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
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 opacity-60 transition-opacity group-hover:opacity-40"></div>
                                        <img
                                            src={event.image}
                                            alt={event.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-110"
                                        />
                                    </div>

                                    {/* Content - Professional Case File Look */}
                                    <div className="absolute bottom-0 left-0 w-full p-6 z-30 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-neon-green font-mono text-xs font-bold px-2 py-1 border border-neon-green/30 rounded bg-neon-green/10">YES_{event.year}</span>
                                            <div className="flex gap-1">
                                                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                                                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                                                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                                            </div>
                                        </div>
                                        <h3 className="text-white font-bold text-2xl font-cinematic tracking-wider drop-shadow-lg group-hover:text-neon-green transition-colors">
                                            {event.name}
                                        </h3>
                                        <div className="w-full h-[1px] bg-white/20 mt-4 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>
                                    </div>

                                    {/* Decoration Lines */}
                                    <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/30 z-30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/30 z-30 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                </div>
                            </TiltCard>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
