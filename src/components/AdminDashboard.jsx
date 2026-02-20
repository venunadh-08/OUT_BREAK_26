import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { firestore } from '../firebase';
import { Search, ExternalLink, Download, RefreshCw, X, Image as ImageIcon, Users, Phone, Mail, AlertTriangle } from 'lucide-react';
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

    // New State for View Mode and Filters
    const [viewMode, setViewMode] = useState('teams'); // 'teams' | 'participants'
    const [filterGender, setFilterGender] = useState('All');
    const [filterAccommodation, setFilterAccommodation] = useState('All');

    // New State for Error Handling
    const [fetchError, setFetchError] = useState(null);

    // Refresh Data
    const fetchData = async () => {
        setLoading(true);
        setFetchError(null);
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
            setFetchError("CONNECTION FAILURE: Unable to retrieve data stream.");
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

    // Helper to get all participants
    const getAllParticipants = () => {
        const participants = [];
        registrations.forEach(reg => {
            // Add Leader
            participants.push({
                type: 'LEADER',
                teamName: reg.teamName,
                teamId: reg.id,
                ...reg.teamLeader,
                paymentStatus: 'PAID',
                transactionId: reg.payment.transactionId,
                submittedAt: reg.submittedAt
            });
            // Add Members
            reg.members.forEach((member, idx) => {
                participants.push({
                    type: `MEMBER ${idx + 1}`,
                    teamName: reg.teamName,
                    teamId: reg.id,
                    ...member,
                    paymentStatus: 'PAID',
                    transactionId: reg.payment.transactionId,
                    submittedAt: reg.submittedAt
                });
            });
        });
        return participants;
    };

    // Filter Logic
    const getFilteredData = () => {
        if (viewMode === 'teams') {
            return registrations.filter(reg =>
                reg.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reg.teamLeader?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reg.id?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else {
            let participants = getAllParticipants();

            // 1. Search
            if (searchTerm) {
                const lowerTerm = searchTerm.toLowerCase();
                participants = participants.filter(p =>
                    p.name.toLowerCase().includes(lowerTerm) ||
                    p.regNo.toLowerCase().includes(lowerTerm) ||
                    p.teamName.toLowerCase().includes(lowerTerm) ||
                    p.teamId.toLowerCase().includes(lowerTerm)
                );
            }

            // 2. Filter Gender
            if (filterGender !== 'All') {
                participants = participants.filter(p => p.gender === filterGender);
            }

            // 3. Filter Accommodation
            if (filterAccommodation !== 'All') {
                participants = participants.filter(p => p.accommodation === filterAccommodation);
            }

            return participants;
        }
    };

    const filteredData = getFilteredData();

    // Excel Export
    const downloadExcel = () => {
        let tableContent = '';
        const fileName = viewMode === 'teams' ? 'outbreak26_teams' : 'outbreak26_participants';

        if (viewMode === 'teams') {
            // Teams Export
            tableContent = `
                <table border="1">
                    <thead>
                        <tr>
                            <th>Team Name</th>
                            <th>Leader Name</th>
                            <th>Leader Email</th>
                            <th>Leader Phone</th>
                            <th>Leader RegNo</th>
                            <th>Transaction ID</th>
                            <th>Status</th>
                            <th>Submitted At</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            filteredData.forEach(reg => {
                tableContent += `
                    <tr>
                        <td>${reg.teamName}</td>
                        <td>${reg.teamLeader.name}</td>
                        <td>${reg.teamLeader.email}</td>
                        <td>${reg.teamLeader.phone}</td>
                        <td>${reg.teamLeader.regNo}</td>
                        <td>${reg.payment.transactionId}</td>
                        <td>SUCCESS</td>
                        <td>${new Date(reg.submittedAt).toLocaleString()}</td>
                    </tr>
                `;
            });
        } else {
            // Participants Export
            const participants = getAllParticipants().filter(p => {
                let match = true;
                if (searchTerm) {
                    const lowerTerm = searchTerm.toLowerCase();
                    match = match && (
                        p.name.toLowerCase().includes(lowerTerm) ||
                        p.regNo.toLowerCase().includes(lowerTerm) ||
                        p.teamName.toLowerCase().includes(lowerTerm) ||
                        p.teamId.toLowerCase().includes(lowerTerm)
                    );
                }
                if (filterGender !== 'All') match = match && p.gender === filterGender;
                if (filterAccommodation !== 'All') match = match && p.accommodation === filterAccommodation;
                return match;
            });

            tableContent = `
                <table border="1">
                    <thead>
                        <tr>
                            <th>Team Name</th>
                            <th>Name</th>
                            <th>Reg No</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Gender</th>
                            <th>Branch</th>
                            <th>Year</th>
                            <th>Accommodation</th>
                            <th>Hostel Name</th>
                            <th>Room No</th>
                            <th>Warden Name</th>
                            <th>Warden Phone</th>
                            <th>Transaction ID</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            participants.forEach(p => {
                tableContent += `
                    <tr>
                        <td>${p.teamName}</td>
                        <td>${p.name}</td>
                        <td>${p.regNo}</td>
                        <td>${p.email}</td>
                        <td>${p.phone}</td>
                        <td>${p.gender}</td>
                        <td>${p.branch}</td>
                        <td>${p.year}</td>
                        <td>${p.accommodation}</td>
                        <td>${p.hostelName || '-'}</td>
                        <td>${p.roomNo || '-'}</td>
                        <td>${p.wardenName || '-'}</td>
                        <td>${p.wardenPhone || '-'}</td>
                        <td>${p.transactionId}</td>
                    </tr>
                `;
            });
        }

        tableContent += `</tbody></table>`;

        const blob = new Blob([tableContent], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}_${new Date().toISOString().split('T')[0]}.xls`;
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
            <div className="relative z-10 p-4 md:p-8 max-w-[1920px] mx-auto">

                {/* Header Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-neutral-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-2xl">
                    <div>
                        <h1 className="text-3xl font-black text-white font-cinematic uppercase tracking-wide flex items-center gap-3">
                            <span className="w-3 h-8 bg-yellow-500 block"></span>
                            Mission Control
                        </h1>
                        <p className="text-yellow-500/60 font-mono text-xs mt-1 tracking-[0.2em] uppercase">
                            Admin Dashboard • {registrations.length} Teams Registered
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">

                        {/* View Mode Toggle */}
                        <div className="flex bg-black/50 p-1 rounded-lg border border-white/10 mr-4">
                            <button
                                onClick={() => setViewMode('teams')}
                                className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wide transition-all ${viewMode === 'teams' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}
                            >
                                Teams
                            </button>
                            <button
                                onClick={() => setViewMode('participants')}
                                className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wide transition-all ${viewMode === 'participants' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}
                            >
                                Participants
                            </button>
                        </div>

                        {/* Filters (Visible only in Participants Mode) */}
                        {viewMode === 'participants' && (
                            <>
                                <select
                                    value={filterGender}
                                    onChange={e => setFilterGender(e.target.value)}
                                    className="bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500 text-gray-300"
                                >
                                    <option value="All">All Genders</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Others">Others</option>
                                </select>
                                <select
                                    value={filterAccommodation}
                                    onChange={e => setFilterAccommodation(e.target.value)}
                                    className="bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500 text-gray-300"
                                >
                                    <option value="All">All Accommodation</option>
                                    <option value="Hostler">Hostler</option>
                                    <option value="Dayscholar">Day Scholar</option>
                                </select>
                            </>
                        )}

                        <div className="relative flex-grow md:flex-grow-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder={viewMode === 'teams' ? "Search Teams / ID..." : "Search Name / RegNo..."}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500 w-full md:w-64 transition-all"
                            />
                        </div>
                        <button onClick={fetchData} className="p-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-white/10 transition-all text-gray-400 hover:text-white" title="Refresh">
                            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                        </button>
                        <button onClick={downloadExcel} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition-all text-sm uppercase tracking-wide shadow-lg shadow-emerald-500/20">
                            <Download size={16} /> Export XLS
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-neutral-900/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto max-h-[75vh]">
                        <table className="w-full text-left border-collapse relative">
                            <thead className="sticky top-0 z-10 bg-[#0a0a0a] shadow-md">
                                <tr className="border-b border-white/10 text-xs font-mono uppercase tracking-wider text-gray-400">
                                    <th className="p-4 pl-6">#</th>
                                    <th className="p-4 bg-[#0a0a0a]">Team Name</th>
                                    {viewMode === 'participants' ? (
                                        <>
                                            <th className="p-4 bg-[#0a0a0a]">Name</th>
                                            <th className="p-4 bg-[#0a0a0a]">Reg No</th>
                                            <th className="p-4 bg-[#0a0a0a]">Gender</th>
                                            <th className="p-4 bg-[#0a0a0a]">Year/Branch</th>
                                            <th className="p-4 bg-[#0a0a0a]">Phone</th>
                                            <th className="p-4 bg-[#0a0a0a]">Accommodation</th>
                                            <th className="p-4 bg-[#0a0a0a]">Hostel Details</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="p-4">Contact Intel</th>
                                            <th className="p-4 text-center">Unit Size</th>
                                            <th className="p-4">Txn Protocol</th>
                                            <th className="p-4 text-center">Proof</th>
                                            <th className="p-4 text-right pr-6">Timestamp</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {fetchError ? (
                                    <tr>
                                        <td colSpan="10" className="p-12 text-center">
                                            <div className="flex flex-col items-center gap-4 text-red-500">
                                                <AlertTriangle size={32} />
                                                <div className="font-mono font-bold text-lg">{fetchError}</div>
                                                <button
                                                    onClick={fetchData}
                                                    className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded text-red-400 hover:text-red-300 transition-colors font-mono uppercase text-xs tracking-widest flex items-center gap-2"
                                                >
                                                    <RefreshCw size={14} /> Retry Connection
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : loading ? (
                                    <tr>
                                        <td colSpan="10" className="p-12 text-center text-gray-500 animate-pulse font-mono">
                                            ESTABLISHING UPLINK...
                                        </td>
                                    </tr>
                                ) : filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="p-12 text-center text-gray-500 font-mono">
                                            NO DATA FOUND IN SECTOR
                                        </td>
                                    </tr>
                                ) : (
                                    viewMode === 'teams' ? (
                                        // TEAMS VIEW (Original)
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
                                    ) : (
                                        // PARTICIPANTS VIEW (New)
                                        filteredData.map((p, idx) => (
                                            <tr key={`${p.teamId}-${idx}`} className="hover:bg-white/5 transition-colors border-b border-white/5">
                                                <td className="p-4 pl-6 font-mono text-gray-500">{idx + 1}</td>
                                                <td className="p-4">
                                                    <div className="font-bold text-white">{p.teamName}</div>
                                                </td>
                                                <td className="p-4 font-medium text-white">{p.name}</td>
                                                <td className="p-4 font-mono text-gray-400">{p.regNo}</td>
                                                <td className="p-4">{p.gender}</td>
                                                <td className="p-4 text-gray-400">{p.year} / {p.branch}</td>
                                                <td className="p-4 font-mono text-xs text-gray-400">{p.phone}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.accommodation === 'Hostler' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-gray-700/30 text-gray-400'}`}>
                                                        {p.accommodation?.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-xs">
                                                    {p.accommodation === 'Hostler' ? (
                                                        <div className="space-y-0.5 text-gray-400">
                                                            <div><span className="text-gray-600">HOSTEL:</span> {p.hostelName} ({p.roomNo})</div>
                                                            <div><span className="text-gray-600">WARDEN:</span> {p.wardenName}</div>
                                                            <div className="font-mono text-[10px]">{p.wardenPhone}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-700">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Stats */}
                    <div className="p-4 border-t border-white/10 bg-white/5 flex justify-between items-center text-xs text-gray-400 font-mono">
                        <div>
                            {viewMode === 'teams' ? `TOTAL TEAMS: ${filteredData.length}` : `TOTAL PARTICIPANTS: ${filteredData.length}`}
                        </div>
                        <div>SYSTEM STATUS: ONLINE</div>
                    </div>
                </div>
            </div>

            {/* Image Viewer */}
            <ImageModal src={viewingImage} onClose={() => setViewingImage(null)} />
        </div>
    );
};
