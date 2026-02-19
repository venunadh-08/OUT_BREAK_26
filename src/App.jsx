import React, { useState, useEffect, Suspense, lazy } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hero } from './components/Hero';
import { Header } from './components/Header';
import { Intro } from './components/Intro';
import { SmokeOverlay } from './components/SmokeOverlay';
import { FloatingElements } from './components/FloatingElements';

// Lazy Load heavy sections to optimize bundle size and initial load
const About = lazy(() => import('./components/About').then(module => ({ default: module.About })));
const Features = lazy(() => import('./components/Features').then(module => ({ default: module.Features })));
const Details = lazy(() => import('./components/Details').then(module => ({ default: module.Details })));
const PastSuccess = lazy(() => import('./components/PastSuccess').then(module => ({ default: module.PastSuccess })));
const Footer = lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));

gsap.registerPlugin(ScrollTrigger);

// Simple Loading Fallback
const SectionLoader = () => (
    <div className="w-full h-40 flex flex-col items-center justify-center gap-4 opacity-50">
        <div className="w-1 h-1 bg-neon-green rounded-full animate-ping"></div>
        <span className="text-neon-green font-mono text-xs tracking-[0.3em] animate-pulse">INITIALIZING...</span>
    </div>
);

function App() {
    const [showIntro, setShowIntro] = useState(true);

    return (
        <div className="app-container relative">
            {showIntro && <Intro onComplete={() => setShowIntro(false)} />}

            <div className={`transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
                <div className="film-grain"></div>
                <SmokeOverlay />
                <FloatingElements />

                <div className="relative z-10 w-full overflow-x-hidden">
                    <Header />
                    <Hero />

                    <Suspense fallback={<SectionLoader />}>
                        <About />
                        <Features />
                        <Details />
                        <PastSuccess />
                        <Footer />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default App;
