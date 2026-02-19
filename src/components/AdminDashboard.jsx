import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { firestore } from '../firebase';
import { Search, ExternalLink, Download, RefreshCw, X, Image as ImageIcon, Users, Phone, Mail } from 'lucide-react';
import { SmokeOverlay } from './SmokeOverlay';

// Image Modal Component
const ImageModal = ({ src, onClose }) => {
    if (!src) return null;
    return (
        <div className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                <X size={32} />
            </button>
            <div className="max-w-4xl max-h-[90vh] overflow-auto bg-neutral-900 border border-white/10 rounded-lg p-2" onClick={e => e.stopPropagation()}>
                <img src={src} alt="Payment Proof" className="max-w-full h-auto rounded" />
            </div>
        </div>
    );
};

export const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('admin_auth') === 'true');
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingImage, setViewingImage] = useState(null);

    // Refresh Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(firestore, "registrations"));
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() });
            });
            // Sort by submission time (newest first)
            data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
            setRegistrations(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to fetch data. Check console.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) return <Navigate to="/admin" />;

    // Filter Logic
    const filteredData = registrations.filter(reg =>
        reg.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.teamLeader?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.teamLeader?.regNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.payment?.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Download CSV
    const downloadCSV = () => {
        // Headers
        let csv = "Team Name,Leader Name,Leader RegNo,Leader Email,Leader Phone,Members Count,Transaction ID,Amount\n";

        // Rows
        filteredData.forEach(reg => {
            const row = [
                `"${reg.teamName}"`,
                `"${reg.teamLeader.name}"`,
                `"${reg.teamLeader.regNo}"`,
                `"${reg.teamLeader.email}"`,
                `"${reg.teamLeader.phone}"`,
                reg.members.length + 1, // Leader + Members
                `"${reg.payment.transactionId}"`,
                1400
            ];
            csv += row.join(",") + "\n";
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `outbreak26_registrations_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30">
            {/* Minimal Background Img */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-black to-black"></div>
                <SmokeOverlay />
            </div>

            {/* Content */}
            <div className="relative z-10 p-4 md:p-8 max-w-[1600px] mx-auto">

                {/* Header Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-neutral-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-2xl">
                    <div>
                        <h1 className="text-3xl font-black text-white font-cinematic uppercase tracking-wide flex items-center gap-3">
                            <span className="w-3 h-8 bg-yellow-500 block"></span>
                            Mission Control
                        </h1>
                        <p className="text-yellow-500/60 font-mono text-xs mt-1 tracking-[0.2em] uppercase">
                            Admin Dashboard • {registrations.length} Active Operatives
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-grow md:flex-grow-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search Teams / ID..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500 w-full md:w-64 transition-all"
                            />
                        </div>
                        <button onClick={fetchData} className="p-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-white/10 transition-all text-gray-400 hover:text-white" title="Refresh">
                            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                        </button>
                        <button onClick={downloadCSV} className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-all text-sm uppercase tracking-wide shadow-lg shadow-yellow-500/20">
                            <Download size={16} /> Export CSV
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-neutral-900/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-xs font-mono uppercase tracking-wider text-gray-400">
                                    <th className="p-4 pl-6">#</th>
                                    <th className="p-4">Team Identity</th>
                                    <th className="p-4">Contact Intel</th>
                                    <th className="p-4 text-center">Unit Size</th>
                                    <th className="p-4">Txn Protocol</th>
                                    <th className="p-4 text-center">Proof</th>
                                    <th className="p-4 text-right pr-6">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="p-12 text-center text-gray-500 animate-pulse font-mono">
                                            ESTABLISHING UPLINK...
                                        </td>
                                    </tr>
                                ) : filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-12 text-center text-gray-500 font-mono">
                                            NO DATA FOUND IN SECTOR
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((reg, idx) => (
                                        <tr key={reg.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4 pl-6 font-mono text-gray-500">{idx + 1}</td>
                                            <td className="p-4">
                                                <div className="font-bold text-white text-lg font-cinematic">{reg.teamName}</div>
                                                <div className="text-xs text-yellow-500/70 font-mono mt-1">ID: {reg.id}</div>
                                            </td>
                                            <td className="p-4 space-y-1">
                                                <div className="flex items-center gap-2 text-white font-medium">
                                                    <Users size={14} className="text-gray-500" />
                                                    {reg.teamLeader.name} <span className="text-gray-500 text-xs">({reg.teamLeader.regNo})</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                                    <Mail size={12} /> {reg.teamLeader.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                                    <Phone size={12} /> {reg.teamLeader.phone}
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-mono text-xs">
                                                    {reg.members.length + 1}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-mono text-yellow-500">{reg.payment.transactionId}</div>
                                                <div className="text-xs text-emerald-500 font-bold mt-1">SUCCESS (₹1,400)</div>
                                            </td>
                                            <td className="p-4 text-center">
                                                {reg.payment.screenshot ? (
                                                    <button
                                                        onClick={() => setViewingImage(reg.payment.screenshot)}
                                                        className="p-2 bg-white/5 hover:bg-yellow-500 hover:text-black rounded border border-white/10 transition-colors text-gray-400"
                                                        title="View Proof"
                                                    >
                                                        <ImageIcon size={18} />
                                                    </button>
                                                ) : (
                                                    <span className="text-red-500 text-xs font-mono">MISSING</span>
                                                )}
                                            </td>
                                            <td className="p-4 pr-6 text-right font-mono text-xs text-gray-500">
                                                {new Date(reg.submittedAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4 p-4">
                        {loading ? (
                            <div className="text-center text-gray-500 animate-pulse font-mono py-8">ESTABLISHING UPLINK...</div>
                        ) : filteredData.length === 0 ? (
                            <div className="text-center text-gray-500 font-mono py-8">NO DATA FOUND IN SECTOR</div>
                        ) : (
                            filteredData.map((reg, idx) => (
                                <div key={reg.id} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-white text-xl font-cinematic">{reg.teamName}</div>
                                            <div className="text-xs text-yellow-500/70 font-mono">ID: {reg.id}</div>
                                        </div>
                                        <div className="bg-emerald-500/10 text-emerald-500 text-xs font-bold px-2 py-1 rounded border border-emerald-500/20">
                                            PAID
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                                            <Users size={14} className="text-yellow-500" />
                                            {reg.teamLeader.name}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                                            <Mail size={12} /> {reg.teamLeader.email}
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-gray-500 pt-2">
                                            <span>Members: {reg.members.length + 1}</span>
                                            <span>{new Date(reg.submittedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="pt-3 flex gap-3">
                                        {reg.payment.screenshot && (
                                            <button
                                                onClick={() => setViewingImage(reg.payment.screenshot)}
                                                className="flex-1 bg-yellow-500 text-black py-2 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                                            >
                                                <ImageIcon size={14} /> View Proof
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer Stats */}
                    <div className="p-4 border-t border-white/10 bg-white/5 flex justify-between items-center text-xs text-gray-400 font-mono">
                        <div>TOTAL UNITS: {filteredData.length}</div>
                        <div>SYSTEM STATUS: ONLINE</div>
                    </div>
                </div>
            </div>

            {/* Image Viewer */}
            <ImageModal src={viewingImage} onClose={() => setViewingImage(null)} />
        </div>
    );
};
