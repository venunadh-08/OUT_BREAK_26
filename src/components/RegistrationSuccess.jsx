import React from 'react';
import { Check, AlertCircle, MessageCircle, ExternalLink } from 'lucide-react';
import { FloatingElements } from './FloatingElements';

export const RegistrationSuccess = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black overflow-hidden">
            {/* Background Atmosphere (Matching Features.jsx) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
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
                            animation: `float ${Math.random() * 3 + 2}s infinite ease-in-out`
                        }}
                    ></div>
                ))}
            </div>

            <div className="relative z-10 bg-neutral-900/90 border border-yellow-500/50 p-8 rounded-2xl max-w-md text-center shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden m-4 backdrop-blur-sm">
                {/* Background sheen */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>

                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse ring-1 ring-yellow-500/50">
                    <Check size={40} className="text-yellow-500" />
                </div>

                <h2 className="text-3xl font-bold text-white mb-2 font-cinematic tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">MISSION ACCEPTED</h2>
                <p className="text-gray-400 mb-6 text-sm font-mono">Your data has been secured in the mainframe.</p>

                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg mb-8 text-left relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                    <h3 className="text-yellow-500 font-bold text-sm mb-2 flex items-center gap-2 font-mono tracking-widest uppercase">
                        <AlertCircle size={16} />
                        VITAL INSTRUCTION
                    </h3>
                    <p className="text-gray-300 text-xs leading-relaxed font-mono">
                        You must join the encrypted network immediately.
                        <span className="text-white font-bold block mt-1">Add all your team members to this group.</span>
                    </p>
                </div>

                <div className="space-y-3">
                    <a
                        href="https://chat.whatsapp.com/BruqPLA2TeyGzgTRhpUv6A"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold rounded-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(37,211,102,0.4)] relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <div className="relative flex items-center gap-2">
                            <MessageCircle size={20} />
                            JOIN THE LAB
                            <ExternalLink size={16} className="opacity-60" />
                        </div>
                    </a>

                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-transparent border border-white/10 text-gray-400 font-bold rounded-lg hover:bg-white/5 hover:text-white transition-colors text-xs tracking-widest font-mono uppercase hover:border-yellow-500/50"
                    >
                        RETURN TO BASE
                    </button>
                </div>
            </div>
        </div>
    );
};
