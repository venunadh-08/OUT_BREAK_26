import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Atom, Zap, Trophy, Network, BrainCircuit, Briefcase } from 'lucide-react';
import TiltCard from './TiltCard';
import { FloatingElements } from './FloatingElements';

const features = [
    {
        title: "Grand Prize Pool",
        value: "₹20,000",
        desc: "To win a Grand Prize Pool of Rs. 20,000/-. recognition favors the bold.",
        icon: <Trophy size={32} />,
        code: "WIN-20K"
    },
    {
        title: "Academic Credits",
        value: "2 Credits",
        desc: "All Participants can Claim 2 Credits under Experimental Elective.",
        icon: <Network size={32} />,
        code: "CRD-02"
    },
    {
        title: "Expert Guidance",
        value: "Mentorship",
        desc: "Expert Guidance will be provided in the Process of Development and Evaluation.",
        icon: <BrainCircuit size={32} />,
        code: "MNT-01"
    }
];

export const Features = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Floating Particles Animation (Matching About Section)
            gsap.to(".features-particle", {
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
        <section ref={sectionRef} id="features" className="py-24 relative overflow-hidden">
            {/* Background Atmosphere w/ Breaking Bad Theme (Hero Style) */}
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
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="feature-particle absolute w-1 h-1 bg-amber-400/40 rounded-full"
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
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Catalyst Effects</span>
                        <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-white font-cinematic">
                            WHY <span className="text-neon-green">PARTICIPATE?</span>
                        </h2>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`${item.title === "Grand Prize Pool" ? "h-full md:-mt-8 md:mb-8" : "h-full"}`} // Offset to make it pop out vertically
                        >
                            <TiltCard className="h-full">
                                <div className={`h-full p-6 md:p-8 rounded-xl relative overflow-hidden group flex flex-col transition-all duration-500 backdrop-blur-sm ${item.title === "Grand Prize Pool" ? "scale-100 md:scale-120 border-yellow-400 border-[3px] shadow-[0_0_40px_rgba(234,179,8,0.5)] md:shadow-[0_0_80px_rgba(234,179,8,0.8)] bg-yellow-500/20 z-20" : "border-yellow-500/20 hover:border-yellow-400/50 shadow-lg hover:shadow-[0_0_30px_rgba(234,179,8,0.2)] bg-yellow-500/5"}`}>

                                    {/* Tech Overlay Lines */}
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"></div>

                                    {/* Special Highlight Overlay for Prize */}
                                    {item.title === "Grand Prize Pool" && (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 via-transparent to-transparent pointer-events-none"></div>
                                            <div className="absolute -inset-1 bg-yellow-400/20 blur-xl opacity-50 animate-pulse pointer-events-none"></div>
                                        </>
                                    )}

                                    {/* Radioactive Corner Marks (Bigger for Prize) */}
                                    <div className="absolute top-0 right-0 p-4 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <div className={`text-black bg-yellow-500 border-yellow-400 font-bold ${item.title === "Grand Prize Pool" ? "shadow-[0_0_20px_rgba(234,179,8,1)] scale-110 md:scale-125 rotate-6" : "opacity-70 scale-90"} text-[10px] font-mono border px-2 py-1 rounded`}>
                                            {item.code}
                                        </div>
                                    </div>

                                    <div className={`mb-8 w-14 h-14 rounded-lg flex items-center justify-center border transition-all duration-500 shadow-inner ${item.title === "Grand Prize Pool" ? "bg-black text-yellow-400 border-yellow-400 scale-125 md:scale-150 shadow-[0_0_40px_rgba(234,179,8,0.6)]" : "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/30 group-hover:text-yellow-400 group-hover:border-yellow-400/60"}`}>
                                        {item.icon}
                                    </div>

                                    <h3 className={`${item.title === "Grand Prize Pool" ? "text-yellow-300 text-lg tracking-[0.3em] font-black" : "text-yellow-400 text-xs tracking-[0.2em]"} drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] font-mono font-bold uppercase mb-3`}>{item.title}</h3>

                                    {/* HUGE PRIZE VALUE - Responsive Sizing */}
                                    <h4 className={`font-black mb-6 font-cinematic leading-none text-white ${item.title === "Grand Prize Pool" ? "text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-br from-yellow-100 to-yellow-500 drop-shadow-[0_0_30px_rgba(234,179,8,1)] scale-100 md:scale-110 origin-left py-2" : "text-2xl"}`}>
                                        {item.value}
                                    </h4>

                                    <p className={`text-sm leading-relaxed font-medium drop-shadow-md border-l-2 pl-4 transition-colors ${item.title === "Grand Prize Pool" ? "text-white font-bold border-yellow-400 bg-black/40 p-2 rounded-r" : "text-gray-300 border-yellow-500/30 group-hover:border-yellow-500"}`}>
                                        {item.desc}
                                    </p>

                                    {/* Hover Scan Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-400/10 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
