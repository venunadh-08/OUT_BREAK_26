import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hero } from './components/Hero';
import { Header } from './components/Header';
import { Intro } from './components/Intro';
import { SmokeOverlay } from './components/SmokeOverlay';
import { FloatingElements } from './components/FloatingElements';
import { RegistrationSuccess } from './components/RegistrationSuccess';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

// Lazy Load heavy sections
const About = lazy(() => import('./components/About').then(module => ({ default: module.About })));
const Features = lazy(() => import('./components/Features').then(module => ({ default: module.Features })));
const Details = lazy(() => import('./components/Details').then(module => ({ default: module.Details })));
const PastSuccess = lazy(() => import('./components/PastSuccess').then(module => ({ default: module.PastSuccess })));
const Footer = lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));
const Registration = lazy(() => import('./components/Registration').then(module => ({ default: module.Registration })));

gsap.registerPlugin(ScrollTrigger);

// Loading Fallback
const SectionLoader = () => (
    <div className="w-full h-40 flex flex-col items-center justify-center gap-4 opacity-50">
        <div className="w-1 h-1 bg-neon-green rounded-full animate-ping"></div>
        <span className="text-neon-green font-mono text-xs tracking-[0.3em] animate-pulse">INITIALIZING...</span>
    </div>
);

// Main Layout Component (Landing Page)
const MainLayout = () => {
    const [showIntro, setShowIntro] = useState(true);
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="app-container relative">
            {showIntro && <Intro onComplete={() => setShowIntro(false)} />}

            <div className={`transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
                <div className="film-grain"></div>
                <SmokeOverlay />
                <FloatingElements />

                <div className="relative z-10 w-full overflow-x-hidden">
                    <Header onRegister={handleRegisterClick} />
                    <Hero onRegister={handleRegisterClick} />

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
};

// Standalone Registration Page Wrapper
const RegistrationPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black relative">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <SmokeOverlay />
                <FloatingElements />
            </div>
            <Suspense fallback={<SectionLoader />}>
                <Registration onClose={() => navigate('/')} />
            </Suspense>
        </div>
    );
};

// Success Page Wrapper
const SuccessPage = () => {
    const navigate = useNavigate();
    return <RegistrationSuccess onClose={() => navigate('/')} />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
