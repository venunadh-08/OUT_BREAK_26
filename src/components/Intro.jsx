import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { Play, VolumeX } from 'lucide-react';

gsap.registerPlugin(TextPlugin);

export const Intro = ({ onComplete }) => {
    const introRef = useRef(null);
    const [started, setStarted] = useState(false); // Wait for audio to be ready
    const audioRef = useRef(null);

    const handleStart = () => {
        if (audioRef.current) {
            audioRef.current.play()
                .then(() => {
                    setStarted(true);
                })
                .catch(e => console.error("Manual play failed:", e));
        }
    };

    useEffect(() => {
        // Initialize Audio
        const audio = new Audio('/bb audio.mp3');
        // If user provides MP3, we can fallback or replace here.
        // For now, let's stick to the file we know exists, but add error handling.
        audio.volume = 0.5;
        audioRef.current = audio;

        // 1. Attempt Autoplay (Best Effort)
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Autoplay successful! Sync start.
                    setStarted(true);
                })
                .catch(error => {
                    // Autoplay prevented.
                    // Do NOT start animation yet. Wait for user interaction.
                    console.log("Autoplay prevented. Waiting for user interaction.", error);
                });
        }

        return () => {
            audio.pause();
            audio.src = "";
        };
    }, []);

    useEffect(() => {
        if (!started) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    // Fade out audio and visual
                    if (audioRef.current) {
                        gsap.to(audioRef.current, { volume: 0, duration: 1 });
                    }
                    gsap.to(introRef.current, {
                        opacity: 0,
                        duration: 1,
                        onComplete: () => {
                            if (audioRef.current) audioRef.current.pause();
                            if (onComplete) onComplete();
                        }
                    });
                }
            });

            // --- ANIMATION SEQUENCE ---

            // 1. "Say my name" (Dramatic Reveal with Walter BG)
            tl.set([".intro-quote-container", ".intro-walter-bg"], { autoAlpha: 1 })

                // Walter BG Fade In (Slow Burn)
                .fromTo(".intro-walter-bg",
                    { opacity: 0, scale: 1.2, filter: "grayscale(100%) brightness(0.5)" },
                    { opacity: 0.4, scale: 1, duration: 4, ease: "power2.out" }
                )

                // "SAY MY" - Glitch Decode Effect
                .to(".intro-text-1", {
                    duration: 1.5,
                    text: {
                        value: "SAY MY",
                        delimiter: ""
                    },
                    ease: "none",
                }, "<+0.5")

                // "NAME" - IMPACT SLAM
                .fromTo(".intro-text-2",
                    { scale: 5, opacity: 0, textShadow: "0 0 50px rgba(255,255,255,0.8)" },
                    {
                        scale: 1,
                        opacity: 1,
                        textShadow: "0 0 20px rgba(26,255,125,0.8)",
                        color: "#1a4d2e",
                        duration: 0.2,
                        ease: "power4.in"
                    },
                    "-=0.2"
                )

                // IMPACT FLASH & SHAKE
                .to(".intro-walter-bg", { opacity: 0.8, duration: 0.1, yoyo: true, repeat: 1 }, "<")
                .to(".intro-quote-container", { x: 10, y: -10, duration: 0.05, yoyo: true, repeat: 5 }, "<")

                .to({}, { duration: 1.5 }) // Hold for impact

                // Fade out Walter + Quote with dissolve
                .to([".intro-quote-container", ".intro-walter-bg"], {
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.8,
                    ease: "power2.in"
                });

            // 2. "GFG CAMPUS BODY KARE PRESENTS"
            tl.set(".intro-present-container", { autoAlpha: 1 })
                .fromTo(".intro-present",
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
                );

            // 3. EXPLOSIVE REVEAL
            tl.set(".intro-main-container", { autoAlpha: 1 })

                // A. Background Slam (Fade in)
                .to(".intro-bg-img", {
                    opacity: 0.5,
                    duration: 0.2,
                    ease: "power4.out"
                }, "+=0.2")

                // B. Logo Elements (O & Br) - Match Hero Font/Style
                .fromTo(".intro-logo-box",
                    { scale: 3, opacity: 0, rotation: -20 },
                    { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: "elastic.out(1, 0.5)", stagger: 0.1 },
                    "<"
                )

                // C. Text Parts ("ut", "eak") - Match Hero Font/Style
                .fromTo(".intro-text-part",
                    { x: 30, opacity: 0, filter: "blur(5px)" },
                    { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power2.out", stagger: 0.05 },
                    "<0.1"
                )

                // D. '26 Reveal
                .fromTo(".intro-year",
                    { scale: 0, rotation: 180 },
                    { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2)" },
                    "-=0.4"
                );

            // 4. HOLD
            tl.to({}, { duration: 2.5 });

        }, introRef);

        return () => ctx.revert();
    }, [started, onComplete]);

    // Reusable LogoBox Component (Identical to Hero)
    const LogoBox = ({ symbol, number }) => (
        <div className="relative flex flex-col justify-center items-center p-2 bg-[#1a4d2e] border-2 md:border-4 border-white shadow-[0_0_20px_rgba(26,255,125,0.4)] w-16 h-16 md:w-28 md:h-28 lg:w-32 lg:h-32">
            <span className="absolute top-1 right-2 text-[10px] md:text-sm font-bold text-white font-serif opacity-80">{number}</span>
            <span className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-none font-serif">{symbol}</span>
        </div>
    );

    return (
        <div
            ref={introRef}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden select-none"
            style={{ opacity: 1 }} // Force visibility
        >
            {!started ? (
                // START SCREEN - Only shows if Autoplay fails
                <div className="absolute inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-pointer transition-colors duration-500 hover:bg-black/80" onClick={handleStart}>
                    <div className="group relative px-6 py-3 border border-neon-green/30 bg-black/50 overflow-hidden transition-all duration-300 hover:border-neon-green/80 hover:shadow-[0_0_30px_rgba(26,255,125,0.3)]">
                        <div className="flex flex-col items-center gap-1 relative z-10">
                            <span className="text-neon-green font-mono text-sm md:text-base font-bold tracking-[0.2em] group-hover:tracking-[0.3em] transition-all duration-500">
                                TAP TO COOK
                            </span>
                        </div>

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-neon-green transition-all duration-300 group-hover:w-3 group-hover:h-3 opacity-50"></div>
                        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-neon-green transition-all duration-300 group-hover:w-3 group-hover:h-3 opacity-50"></div>
                    </div>
                </div>
            ) : (
                // INTRO ANIMATION CONTENT
                <>
                    {/* SKIP BUTTON */}
                    <button
                        onClick={() => {
                            if (audioRef.current) audioRef.current.pause();
                            if (introRef.current) gsap.killTweensOf(introRef.current);
                            if (onComplete) onComplete();
                        }}
                        className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-[10001] px-4 py-2 bg-transparent border border-white/20 text-white/50 hover:text-neon-green hover:border-neon-green/50 active:scale-95 font-mono text-xs tracking-widest transition-all duration-300 group"
                    >
                        <span className="group-hover:drop-shadow-[0_0_5px_rgba(26,255,125,0.8)]">SKIP_INTRO</span>
                    </button>

                    {/* 0. BACKGROUND */}
                    <div className="absolute inset-0 z-0 bg-black">
                        {/* 0A. WALTER WHITE BG (Specific to 'Say My Name') */}
                        <img
                            src="/walter.png"
                            alt="Walter White"
                            className="intro-walter-bg absolute inset-0 w-full h-full object-contain md:object-cover opacity-10 filter grayscale contrast-125 brightness-90 bg-black"
                        />

                        {/* 0B. BREAKING BAD BG (Specific to 'Outbreak') */}
                        <img
                            src="/breaking%20bad.png"
                            alt="Background"
                            className="intro-bg-img absolute inset-0 w-full h-full object-contain md:object-cover opacity-0 filter brightness-75 contrast-125 bg-black"
                        />

                        {/* Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-90"></div>
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>

                    {/* 0.5 Film Grain */}
                    <div className="absolute inset-0 z-10 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

                    {/* 1. "SAY MY NAME" - Using serif font to match Hero vibe */}
                    <div className="intro-quote-container absolute z-20 flex items-center justify-center inset-0 opacity-0">
                        <h1 className="intro-quote text-4xl md:text-7xl lg:text-8xl text-white font-serif font-bold tracking-widest text-center leading-tight drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] flex flex-col items-center gap-2 md:gap-4">
                            <span className="intro-text-1 font-mono tracking-widest opacity-80">C₁₀H₁₅N</span>
                            <span className="intro-text-2 emphasis text-neon-green tracking-[0.2em] transform scale-0 opacity-0">NAME</span>
                        </h1>
                    </div>

                    {/* MAIN COMPOSITION */}
                    <div className="intro-main-container relative z-30 flex flex-col items-center opacity-0 transform scale-90 md:scale-100">

                        {/* 2. PRESENTS TEXT */}
                        <div className="intro-present-container opacity-0 mb-8 text-center">
                            <h3 className="intro-present text-neon-green text-xs md:text-lg tracking-[0.3em] font-mono font-bold uppercase drop-shadow-md">
                                GFG CAMPUS BODY KARE PRESENTS
                            </h3>
                        </div>

                        {/* 3. LOGO LOCKUP - STACKED LAYOUT */}
                        <div className="flex flex-col items-start relative">

                            {/* ROW 1: O-ut */}
                            <div className="flex items-center z-20">
                                <div className="intro-logo-box">
                                    <LogoBox symbol="O" number="8" />
                                </div>
                                <span className="intro-text-part text-3xl md:text-5xl lg:text-6xl font-serif text-white leading-none ml-3 tracking-tight drop-shadow-lg font-bold">
                                    ut
                                </span>
                            </div>

                            {/* ROW 2: Br-eak'26 */}
                            <div className="flex items-center z-10 ml-16 md:ml-28 lg:ml-32">
                                <div className="intro-logo-box">
                                    <LogoBox symbol="Br" number="35" />
                                </div>
                                <span className="intro-text-part text-3xl md:text-5xl lg:text-6xl font-serif text-white leading-none ml-3 tracking-tight drop-shadow-lg font-bold">
                                    eak
                                </span>
                                {/* '26 */}
                                <span className="intro-year text-3xl md:text-5xl lg:text-6xl font-serif text-white leading-none tracking-tight drop-shadow-lg font-bold">
                                    '26
                                </span>
                            </div>

                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
