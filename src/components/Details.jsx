import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Calendar, Users, MapPin, Wallet, LockKeyhole, Trophy, Target, Zap } from 'lucide-react';
import TiltCard from './TiltCard';

import { SmokeOverlay } from './SmokeOverlay';
import { FloatingElements } from './FloatingElements';

const details = [
    {
        id: 1,
        title: "Registration Opens",
        value: "February 14, 2026",
        desc: "The portal opens. Secure your spot before the grid locks.",
        icon: <LockKeyhole size={24} />,
        date: "FEB 14",
        colSpan: "md:col-span-1"
    },
    {
        id: 2,
        title: "Event Date",
        value: "28th & 29th March 2026",
        desc: "48 hours of intense coding and logic.",
        icon: <Calendar size={24} />,
        date: "MAR 28-29",
        colSpan: "md:col-span-1"
    },
    {
        id: 3,
        title: "Squad Size",
        value: "4 Members",
        desc: "Gather your team. Collaboration is key.",
        icon: <Users size={24} />,
        date: "TEAM",
        colSpan: "md:col-span-1"
    },
    {
        id: 4,
        title: "Registration Fee",
        value: "₹350 / Participant",
        desc: "Small investment for massive return.",
        icon: <Wallet size={24} />,
        date: "ENTRY",
        colSpan: "md:col-span-1"
    },
    {
        id: 5,
        title: "Venue",
        value: "8th Block Seminar Hall",
        desc: "The arena where legends will be forged.",
        icon: <MapPin size={24} />,
        date: "LOC",
        colSpan: "md:col-span-2"
    }
];

export const Details = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Floating Particles Animation
            gsap.to(".details-particle", {
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
        <section id="details" ref={sectionRef} className="py-24 relative overflow-hidden bg-black">
            {/* ENHANCED ATMOSPHERE */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* 1. Base Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-[#100a05] to-black"></div>

                {/* 2. Unique Hexagonal Pattern */}
                <div
                    className="absolute inset-0 bg-hex-pattern opacity-30"
                ></div>

                {/* 3. Hazard Glow (Amber/Yellow) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-amber-600/20 rounded-full blur-[120px] mix-blend-screen opacity-60"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-600/30 rounded-full blur-[100px] mix-blend-screen opacity-50 animate-pulse"></div>

                {/* 4. Smoke Effect */}
                <SmokeOverlay />

                {/* 5. Floating Chemical Elements */}
                <FloatingElements />

                {/* 6. Floating Particles (Existing -> Updated) */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="details-particle absolute w-1 h-1 bg-yellow-500/40 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: Math.random() < 0.4 ? '3px' : '1px',
                            height: Math.random() < 0.4 ? '3px' : '1px',
                        }}
                    ></div>
                ))}
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Batch Specs</span>
                        <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-white font-cinematic">
                            OPERATION <span className="text-neon-green">DETAILS</span>
                        </h2>
                    </motion.div>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {details.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`${item.colSpan || ''} h-full`}
                        >
                            <TiltCard className="h-full">
                                <div className="h-full p-6 md:p-8 rounded-xl border border-white/10 shadow-lg hover:shadow-[0_0_30px_rgba(26,255,125,0.15)] hover:border-neon-green/50 transition-all bg-black/40 backdrop-blur-md relative overflow-hidden group flex flex-col justify-between">

                                    {/* Professional Header - Technical Label */}
                                    <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                                        <div>
                                            <h3 className="text-neon-green text-sm font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse"></span>
                                                {item.title}
                                            </h3>
                                        </div>
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/80 border border-white/10 group-hover:bg-neon-green/20 group-hover:text-neon-green group-hover:border-neon-green/50 transition-all duration-300">
                                            {item.icon}
                                        </div>
                                    </div>

                                    {/* Main Value - Thematic Cinematic Type */}
                                    <div className="mb-6">
                                        <h4 className="text-3xl md:text-3xl font-black text-white font-cinematic leading-none tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neon-green transition-all duration-500">
                                            {item.value}
                                        </h4>
                                    </div>

                                    {/* Description - Standard Readable */}
                                    <div className="relative pl-4 border-l-2 border-white/10 group-hover:border-neon-green/50 transition-colors mt-auto">
                                        <p className="text-gray-300 text-sm leading-relaxed font-medium">
                                            {item.desc}
                                        </p>
                                    </div>


                                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/20 group-hover:border-neon-green/50 transition-colors"></div>
                                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/20 group-hover:border-neon-green/50 transition-colors"></div>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
