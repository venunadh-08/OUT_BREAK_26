import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertTriangle, ChevronRight } from 'lucide-react';
import { FloatingElements } from './FloatingElements';
import { SmokeOverlay } from './SmokeOverlay';

export const AdminLogin = () => {
    const [accessKey, setAccessKey] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple client-side check. In a real app, this would be server-side.
        if (accessKey === 'GFG_BREAKOUT_ADMIN') {
            sessionStorage.setItem('admin_auth', 'true');
            navigate('/admin/dashboard');
        } else {
            setError('ACCESS DENIED: INVALID CRYPTO KEY');
            setAccessKey('');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
            {/* Background Atmosphere (Standard Amber Theme) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img
                    src="/breaking%20bad.png"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay filter grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-amber-400/10 via-amber-600/5 to-transparent"></div>
                <div className="absolute inset-0 opacity-60 mix-blend-soft-light" style={{ background: 'radial-gradient(circle at 50% 50%, #d17a22 0%, transparent 100%)' }}></div>
                <SmokeOverlay />
                <FloatingElements />
            </div>

            <div className="relative z-10 w-full max-w-md p-8">
                <div className="bg-neutral-900/80 backdrop-blur-md border border-yellow-500/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.1)] relative overflow-hidden group">

                    {/* Security Tape Decoration */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
                    <div className="absolute -left-10 top-5 -rotate-45 bg-yellow-500 text-black font-bold text-[10px] px-8 py-1 shadow-lg z-20">RESTRICTED</div>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
                            <Lock className="text-yellow-500 w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black text-white font-cinematic tracking-widest uppercase">Admin Command</h2>
                        <p className="text-yellow-500/60 font-mono text-xs mt-2 uppercase tracking-widest">Authorized Personnel Only</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-yellow-500 font-mono text-xs uppercase tracking-widest font-bold">Security Clearance Key</label>
                            <input
                                type="password"
                                value={accessKey}
                                onChange={(e) => setAccessKey(e.target.value)}
                                className="w-full bg-black/50 border-b-2 border-yellow-500/30 text-center text-white text-xl py-3 focus:outline-none focus:border-yellow-500 transition-colors font-mono tracking-[0.5em] placeholder:tracking-normal placeholder:text-white/20"
                                placeholder="ENTER PIN"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded text-xs font-mono font-bold animate-pulse">
                                <AlertTriangle size={14} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(234,179,8,0.3)] flex items-center justify-center gap-2 font-mono tracking-widest uppercase"
                        >
                            Access Data
                            <ChevronRight size={16} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
