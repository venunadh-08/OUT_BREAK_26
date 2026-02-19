import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileWarning, Siren, Microscope } from 'lucide-react';

import { SmokeOverlay } from './SmokeOverlay';
import { FloatingElements } from './FloatingElements';

export const About = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Scroll Reveal Animation (Targeting the Wrapper)
            gsap.from(".reveal-wrapper", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                }
            });

            // 2. Continuous Floating Animation (Targeting the Card Content)
            gsap.to(".float-card", {
                y: -15,
                duration: 2.5,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                stagger: {
                    each: 0.5,
                    from: "random"
                }
            });

            // 3. Floating Particles Animation
            gsap.to(".about-particle", {
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
        <section id="about" ref={sectionRef} className="relative py-24 px-4 overflow-hidden bg-black">
            {/* ENHANCED ATMOSPHERE */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* 1. Base Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-[#100a05] to-black"></div>

                {/* 2. Unique Hexagonal Pattern */}
                <div
                    className="absolute inset-0 bg-hex-pattern opacity-30"
                ></div>

                {/* 3. Hazard Glow (Amber/Yellow) - Matched to Details.jsx */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-amber-600/20 rounded-full blur-[120px] mix-blend-screen opacity-60"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-600/30 rounded-full blur-[100px] mix-blend-screen opacity-50 animate-pulse"></div>

                {/* 4. Smoke Effect */}
                <SmokeOverlay />

                {/* 5. Floating Chemical Elements */}
                <FloatingElements />

                {/* 6. Floating Particles (Matched to Details.jsx) */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="about-particle absolute w-1 h-1 bg-yellow-500/40 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: Math.random() < 0.4 ? '3px' : '1px',
                            height: Math.random() < 0.4 ? '3px' : '1px',
                        }}
                    ></div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Mission Text */}
                    <div>
                        <div className="mb-8">
                            <span className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-xs mb-4 block flex items-center gap-2">
                                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                                Classified Intel
                            </span>
                            <h2 className="text-white font-black text-5xl md:text-7xl font-cinematic leading-[0.9]">
                                THE <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-600">OUTBREAK</span>
                            </h2>
                        </div>

                        <div className="reveal-wrapper bg-[#0a1f12]/60 backdrop-blur-md border border-neon-green/20 p-6 md:p-8 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                            {/* Decorative Top Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green/50 to-transparent opacity-50"></div>

                            <div className="space-y-8 text-lg text-gray-300 font-light leading-relaxed">
                                <p className="border-l-2 border-neon-green pl-6 py-1">
                                    <strong className="text-white block mb-2 font-bold uppercase tracking-wider font-mono text-sm text-neon-green">Protocol_Init:</strong>
                                    GFG Campus Body KARE, Department of CSE, initiates <span className="text-white font-bold font-cinematic text-xl">OUTBREAK'26</span>.
                                </p>
                                <p>
                                    This is a <span className="text-black font-bold bg-neon-green px-2 py-0.5 rounded shadow-[0_0_10px_rgba(26,255,125,0.4)]">24-Hour Hackathon</span> designed to isolate and amplify elite coding capabilities. Participants will be subjected to high-pressure scenarios in System Design, GenAI, and Cloud Computing.
                                </p>

                                <div className="flex gap-4 items-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg shadow-inner">
                                    <FileWarning className="text-yellow-500 shrink-0 drop-shadow-md" size={24} />
                                    <p className="text-sm text-yellow-500 font-mono">
                                        Warning: Projects evaluated by Industry Experts. <br /> Evaluation standards match real-world software production.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visual Cards (Floating) */}
                    <div className="grid gap-6">

                        {/* Card 1 */}
                        <div className="reveal-wrapper">
                            <div className="float-card p-6 bg-[#111] border-l-4 border-neon-green rounded-r-xl shadow-lg relative overflow-hidden group">
                                <div className="absolute right-0 top-0 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Siren size={100} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-neon-green transition-colors">System Design</h3>
                                <p className="text-gray-500 text-sm">Architect scalable solutions under extreme constraints.</p>
                            </div>
                        </div>

                        {/* Card 2 (Offset) */}
                        <div className="reveal-wrapper translate-x-4 md:translate-x-8">
                            <div className="float-card p-6 bg-[#111] border-l-4 border-yellow-500 rounded-r-xl shadow-lg relative overflow-hidden group">
                                <div className="absolute right-0 top-0 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Microscope size={100} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-500 transition-colors">GenAI Integration</h3>
                                <p className="text-gray-500 text-sm">Synthesize intelligence. Automate the unavailable.</p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="reveal-wrapper">
                            <div className="float-card p-6 bg-[#111] border-l-4 border-cyan-400 rounded-r-xl shadow-lg relative overflow-hidden group">
                                <div className="absolute right-0 top-0 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FileWarning size={100} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Industry Standard</h3>
                                <p className="text-gray-500 text-sm">Evaluation by real-world tech leads. No simulations.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section >
    );
};
