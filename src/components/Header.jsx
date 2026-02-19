import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Header = ({ onRegister }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };

    const navLinks = [
        { name: 'HOME', id: 'hero' },
        { name: 'ABOUT', id: 'about' },
        { name: 'WHY PARTICIPATE', id: 'features' },
        { name: 'DETAILS', id: 'details' },
        { name: 'PAST EVENTS', id: 'past-success' },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-6 md:px-12 py-4 ${isScrolled ? 'bg-[#0a0f0a]/90 backdrop-blur-md border-b border-neon-green/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo & Title Section */}
                    <div className="flex items-center gap-4 group cursor-pointer relative z-50" onClick={() => scrollToSection('hero')}>
                        <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(26,255,125,0.4)] group-hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-shadow duration-300">
                            <img src="/gfg.jpeg" alt="GFG" className="w-full h-full object-contain p-0.5" />
                        </div>

                        {/* Chemical Title: [O]ut [Br]eak'26 */}
                        <div className="flex flex-col justify-center -space-y-px">
                            {/* Row 1: [O]ut */}
                            <div className="flex items-end gap-1">
                                <div className="w-6 h-6 bg-[#1a4d2e] relative flex flex-col justify-center items-center p-0.5 border border-white/20">
                                    <span className="absolute top-0 right-0.5 text-[5px] font-bold text-white font-serif opacity-80">8</span>
                                    <span className="text-xs font-bold text-white font-serif leading-none">O</span>
                                </div>
                                <span className="text-lg font-serif text-white tracking-tight leading-none mb-0.5">ut</span>
                            </div>

                            {/* Row 2: [Br]eak'26 */}
                            <div className="flex items-end gap-1 pl-6">
                                <div className="w-6 h-6 bg-[#1a4d2e] relative flex flex-col justify-center items-center p-0.5 border border-white/20">
                                    <span className="absolute top-0 right-0.5 text-[5px] font-bold text-white font-serif opacity-80">35</span>
                                    <span className="text-xs font-bold text-white font-serif leading-none">Br</span>
                                </div>
                                <span className="text-lg font-serif text-white tracking-tight leading-none mb-0.5">eak'26</span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => scrollToSection(link.id)}
                                className="text-sm font-bold text-gray-300 hover:text-neon-green transition-colors tracking-widest font-mono relative group"
                            >
                                <span className="relative z-10">{link.name}</span>
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-green transition-all duration-300 group-hover:w-full"></span>
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        {/* Desktop CTA Button */}
                        <button onClick={onRegister} className="hidden md:block relative px-6 py-2 group overflow-hidden">
                            <div className="absolute inset-0 bg-neon-green transform skew-x-[-15deg] group-hover:bg-yellow-500 transition-colors duration-300 shadow-[0_0_20px_rgba(26,255,125,0.4)] group-hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]"></div>
                            <span className="relative z-10 text-black font-black text-xs tracking-[0.2em] transition-transform group-hover:scale-105 inline-block">
                                LET'S COOK
                            </span>
                            {/* Corner accents */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/40 group-hover:border-black/40 transition-colors"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/40 group-hover:border-black/40 transition-colors"></div>
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden relative z-50 p-2 text-white hover:text-neon-green transition-colors"
                        >
                            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-[90] flex items-center justify-center transition-all duration-500 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <div className="container px-6 flex flex-col items-center gap-8">

                    {/* Mobile Menu Links */}
                    <nav className="flex flex-col gap-8 text-center">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => scrollToSection(link.id)}
                                className="text-2xl font-black text-white hover:text-neon-green font-cinematic tracking-wider transition-all hover:scale-110"
                            >
                                {link.name}
                            </button>
                        ))}
                    </nav>

                    <div className="w-16 h-1 bg-white/10 rounded-full"></div>

                    <button onClick={() => { setIsMenuOpen(false); onRegister(); }} className="relative px-10 py-4 bg-neon-green text-black font-bold rounded-sm group overflow-hidden">
                        <span className="relative z-10 font-mono tracking-widest text-sm flex items-center gap-2">
                            <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                            LET'S COOK
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
};
