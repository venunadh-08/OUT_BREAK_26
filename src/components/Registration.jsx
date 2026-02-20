import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, Upload, Check, AlertCircle, User, Users, CreditCard, Building, Phone, Mail, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FloatingElements } from './FloatingElements';
import { SmokeOverlay } from './SmokeOverlay';
import { collection, doc, runTransaction, query, where, getDocs, getDoc } from "firebase/firestore";
import { firestore } from '../firebase';

// Helper Hook for Debounce
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

// UI Components for Form Fields (Updated size logic: Larger headings, smaller inputs)
const InputField = ({ label, value, onChange, error, validationStatus, placeholder, type = "text", inputMode, ...props }) => (
    <div className="flex flex-col gap-2 w-full group">
        <label className="text-yellow-500 font-mono text-sm md:text-base uppercase tracking-[0.15em] group-focus-within:text-yellow-400 transition-colors flex justify-between font-bold">
            {label}
            {error && <span className="text-red-500 normal-case tracking-normal text-xs md:text-sm font-semibold ml-2">{error}</span>}
        </label>
        <div className="relative">
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                inputMode={inputMode}
                className={`w-full bg-black/40 border-b ${error ? 'border-red-500' : (validationStatus === 'valid' ? 'border-yellow-500' : 'border-white/10')} focus:border-yellow-500 text-white text-base py-3 px-2 focus:outline-none transition-all font-mono placeholder:text-white/20 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed ${type === 'email' ? 'lowercase' : 'uppercase'}`}
                style={{ letterSpacing: '0.05em' }}
                onBlur={props.onBlur}
                {...props}
            />
            {/* Validation Status Indicator */}
            {validationStatus === 'loading' && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
                </div>
            )}
            {validationStatus === 'valid' && !error && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Check className="w-5 h-5 text-yellow-500" />
                </div>
            )}

            {/* Corner Accents */}
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-yellow-500 transition-all duration-500 group-focus-within:w-full"></div>
        </div>
    </div>
);

const SelectField = ({ label, value, onChange, options, error, onBlur }) => (
    <div className="flex flex-col gap-2 w-full group">
        <label className="text-yellow-500/90 font-mono text-sm md:text-base uppercase tracking-[0.15em] group-focus-within:text-yellow-400 transition-colors flex justify-between font-bold">
            {label}
            {error && <span className="text-red-500 normal-case tracking-normal text-xs md:text-sm font-semibold ml-2">{error}</span>}
        </label>
        <div className="relative">
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className={`w-full bg-black/40 border-b ${error ? 'border-red-500' : 'border-white/10'} focus:border-yellow-500 text-white text-base py-3 px-2 focus:outline-none transition-all font-mono appearance-none hover:bg-white/5 cursor-pointer uppercase`}
                style={{ letterSpacing: '0.05em' }}
                onBlur={onBlur}
            >
                <option value="" className="bg-[#111] text-gray-500">SELECT OPTION</option>
                {options.map(opt => (
                    <option key={opt} value={opt} className="bg-[#111] text-white py-2">{opt.toUpperCase()}</option>
                ))}
            </select>
            {/* Custom Arrow */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-80">
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-yellow-500"></div>
            </div>
            {/* Animated Bottom Border */}
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-yellow-500 transition-all duration-500 group-focus-within:w-full"></div>
        </div>
    </div>
);

const RadioGroup = ({ label, value, onChange, options, error }) => (
    <div className="flex flex-col gap-3 w-full group">
        <label className="text-yellow-500/90 font-mono text-sm md:text-base uppercase tracking-[0.15em] font-bold">
            {label}
            {error && <span className="text-red-500 normal-case tracking-normal text-xs md:text-sm font-semibold ml-2">{error}</span>}
        </label>
        <div className="flex items-center gap-8 py-2">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className="flex items-center gap-3 group/radio focus:outline-none"
                >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${value === opt.value ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]' : 'border-gray-500 group-hover/radio:border-gray-400'}`}>
                        <div className={`w-2.5 h-2.5 rounded-full bg-yellow-500 transition-transform duration-300 ${value === opt.value ? 'scale-100' : 'scale-0'}`}></div>
                    </div>
                    <span className={`text-base md:text-lg font-bold tracking-wide transition-colors ${value === opt.value ? 'text-white' : 'text-gray-500 group-hover/radio:text-gray-300'}`}>
                        {opt.label}
                    </span>
                </button>
            ))}
        </div>
        <div className="h-[1px] bg-white/10 w-full mt-1"></div>
    </div>
);

const PersonForm = ({ data, onChange, onBlur, prefix, title, errors, validationStatuses = {} }) => (
    <div className="form-section relative bg-black/20 backdrop-blur-sm border-l border-white/10 hover:border-yellow-500/50 transition-colors duration-300 p-6 md:p-8 mb-8 group">
        {/* Tech Decoration */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20 group-hover:border-yellow-500 transition-colors"></div>

        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 font-cinematic tracking-wide">
            <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-yellow-500/50 transition-colors">
                {prefix === 'teamLeader' ? <User className="text-yellow-500 w-4 h-4" /> : <Users className="text-yellow-500 w-4 h-4" />}
            </span>
            {title.toUpperCase()}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 mb-4">
            <InputField label="Name" value={data.name} onChange={v => onChange('name', v)} onBlur={e => onBlur('name', e.target.value)} error={errors[`${prefix}_name`]} placeholder="FULL NAME" />
            <InputField
                label="REGISTRATION NUMBER"
                value={data.regNo}
                onChange={v => onChange('regNo', v)}
                onBlur={e => onBlur('regNo', e.target.value)}
                error={errors[`${prefix}_regNo`]}
                placeholder="your_regno"
                validationStatus={validationStatuses.regNo}
                inputMode="numeric"
            />
            <InputField
                label="COLLEGE MAIL ID"
                value={data.email}
                onChange={v => onChange('email', v)}
                onBlur={e => onBlur('email', e.target.value)}
                error={errors[`${prefix}_email`]}
                placeholder="example@klu.ac.in"
                type="email"
                validationStatus={validationStatuses.email}
            />
            <InputField label="Phone NUMBER" value={data.phone} onChange={v => onChange('phone', v)} onBlur={e => onBlur('phone', e.target.value)} error={errors[`${prefix}_phone`]} placeholder="PHONE NO" inputMode="tel" />

            <SelectField label="Gender" value={data.gender} onChange={v => onChange('gender', v)} onBlur={e => onBlur('gender', e.target.value)} options={['Male', 'Female', 'Others']} error={errors[`${prefix}_gender`]} />
            <SelectField label="Year" value={data.year} onChange={v => onChange('year', v)} onBlur={e => onBlur('year', e.target.value)} options={['2', '3', '4']} error={errors[`${prefix}_year`]} />

            <InputField label="Branch" value={data.branch} onChange={v => onChange('branch', v)} onBlur={e => onBlur('branch', e.target.value)} error={errors[`${prefix}_branch`]} placeholder="CSE, ECE, IT..." />
            <InputField label="Section" value={data.section} onChange={v => onChange('section', v)} onBlur={e => onBlur('section', e.target.value)} error={errors[`${prefix}_section`]} placeholder="SECTION" />

            <RadioGroup
                label="Accommodation"
                value={data.accommodation}
                onChange={v => {
                    onChange('accommodation', v);
                    if (v === 'Dayscholar') {
                        onChange('hostelName', '');
                        onChange('roomNo', '');
                        onChange('wardenName', '');
                        onChange('wardenPhone', '');
                    }
                }}
                options={[
                    { label: 'Day Scholar', value: 'Dayscholar' },
                    { label: 'Hostler', value: 'Hostler' }
                ]}
                error={errors[`${prefix}_accommodation`]}
            />
        </div>

        {data.accommodation === 'Hostler' && (
            <div className="mt-6 p-6 bg-yellow-500/5 border-l-2 border-yellow-500/30 animate-in fade-in slide-in-from-top-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"></div>
                <h4 className="text-yellow-500 font-bold mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em]"><Building size={14} /> Hostel Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SelectField label="Hostel Name" value={data.hostelName} onChange={v => onChange('hostelName', v)} onBlur={e => onBlur('hostelName', e.target.value)} options={['MH-1', 'MH-2', 'MH-3', 'MH-6', 'PG', 'LH-2', 'LH-3', 'LH-4']} error={errors[`${prefix}_hostelName`]} />
                    <InputField label="Room NUMBER" value={data.roomNo} onChange={v => onChange('roomNo', v)} onBlur={e => onBlur('roomNo', e.target.value)} error={errors[`${prefix}_roomNo`]} placeholder="ROOM NO" inputMode="numeric" />
                    <InputField label="Warden Name" value={data.wardenName} onChange={v => onChange('wardenName', v)} onBlur={e => onBlur('wardenName', e.target.value)} error={errors[`${prefix}_wardenName`]} placeholder="WARDEN NAME" />
                    <InputField label="Warden Phone" value={data.wardenPhone} onChange={v => onChange('wardenPhone', v)} onBlur={e => onBlur('wardenPhone', e.target.value)} error={errors[`${prefix}_wardenPhone`]} placeholder="WARDEN PHONE" inputMode="tel" />
                </div>
            </div>
        )}
    </div>
);

export const Registration = ({ onClose }) => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const formRef = useRef(null);

    // Form State
    const [formData, setFormData] = useState({
        teamName: '',
        teamLeader: {
            name: '',
            regNo: '',
            email: '',
            gender: '',
            section: '',
            year: '',
            branch: '',
            phone: '',
            accommodation: '',
            hostelName: '',
            roomNo: '',
            wardenName: '',
            wardenPhone: ''
        },
        members: [
            { name: '', regNo: '', email: '', gender: '', section: '', year: '', branch: '', phone: '', accommodation: '', hostelName: '', roomNo: '', wardenName: '', wardenPhone: '' },
            { name: '', regNo: '', email: '', gender: '', section: '', year: '', branch: '', phone: '', accommodation: '', hostelName: '', roomNo: '', wardenName: '', wardenPhone: '' },
            { name: '', regNo: '', email: '', gender: '', section: '', year: '', branch: '', phone: '', accommodation: '', hostelName: '', roomNo: '', wardenName: '', wardenPhone: '' }
        ],
        payment: {
            transactionId: '',
            screenshot: null
        }
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Dynamic Validation State
    const [fieldStatus, setFieldStatus] = useState({
        teamName: null, // null, 'loading', 'valid', 'taken'
        leaderEmail: null,
        leaderRegNo: null,
        transactionId: null
    });

    // Debounced Values
    const debouncedTeamName = useDebounce(formData.teamName, 500);
    const debouncedLeaderEmail = useDebounce(formData.teamLeader.email, 500);
    const debouncedLeaderRegNo = useDebounce(formData.teamLeader.regNo, 500);
    const debouncedTransactionId = useDebounce(formData.payment.transactionId, 500);

    // Dynamic Availability Checkers
    useEffect(() => {
        let isActive = true;
        if (!debouncedTeamName) {
            setFieldStatus(prev => ({ ...prev, teamName: null }));
            return;
        }
        const checkTeamName = async () => {
            setFieldStatus(prev => ({ ...prev, teamName: 'loading' }));
            try {
                // Surgical checks for scalability (No collection scanning)
                // 1. Check direct ID (No spaces, Upper case)
                // 1. Check direct ID (No spaces, No symbols, Upper case)
                const normalizedId = debouncedTeamName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                const docRef = doc(firestore, "registrations", normalizedId);

                // 2. Check exact field match (For team names that might have been saved differently)
                const q = query(collection(firestore, "registrations"), where("teamName", "==", debouncedTeamName));

                const [docSnap, querySnap] = await Promise.all([
                    getDoc(docRef),
                    getDocs(q)
                ]);

                if (!isActive) return; // Cancel if component unmounted or input changed

                const isTaken = docSnap.exists() || !querySnap.empty;

                if (isActive) setFieldStatus(prev => ({ ...prev, teamName: !isTaken ? 'valid' : 'taken' }));

                // Clear or set error based on status
                if (isTaken) {
                    if (isActive) setErrors(prev => ({ ...prev, teamName: "ALREADY EXISTS" }));
                } else {
                    if (isActive) setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.teamName;
                        return newErrors;
                    });
                }
            } catch (err) {
                console.error("Error checking team name", err);
                if (isActive) setFieldStatus(prev => ({ ...prev, teamName: null }));
            }
        };
        checkTeamName();
        return () => { isActive = false; };
    }, [debouncedTeamName]);







    useEffect(() => {
        let isActive = true;
        if (!debouncedTransactionId) {
            setFieldStatus(prev => ({ ...prev, transactionId: null }));
            return;
        }
        const checkTransactionId = async () => {
            setFieldStatus(prev => ({ ...prev, transactionId: 'loading' }));
            try {
                const q = query(collection(firestore, "registrations"), where("payment.transactionId", "==", debouncedTransactionId));
                const snap = await getDocs(q);

                if (!isActive) return;

                setFieldStatus(prev => ({ ...prev, transactionId: snap.empty ? 'valid' : 'taken' }));

                if (!snap.empty) {
                    setErrors(prev => ({ ...prev, transactionId: "ALREADY EXISTS" }));
                } else {
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.transactionId;
                        return newErrors;
                    });
                }
            } catch (err) {
                console.error("Error checking transaction id", err);
                if (isActive) setFieldStatus(prev => ({ ...prev, transactionId: null }));
            }
        };
        checkTransactionId();
        return () => { isActive = false; };
    }, [debouncedTransactionId]);


    // Animation on Mount
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(containerRef.current,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
            );

            gsap.from(".form-section", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                delay: 0.2
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleChange = (section, field, value, index = null) => {
        // Input Masking & Validation Logic
        let processedValue = value;

        // 1. Email: Force lowercase
        if (field === 'email') {
            processedValue = value.toLowerCase();
        }

        // 2. Phone: Allow only digits, max 10
        if (field === 'phone' || field === 'wardenPhone') {
            if (!/^\d*$/.test(value)) return; // Ignore non-digits
            if (value.length > 10) return; // Max 10 digits
        }

        // 3. Reg No / Room No: Allow only digits (No alphabets)
        if (field === 'roomNo') {
            if (!/^\d*$/.test(value)) return; // Ignore non-digits for Room No
        }

        setFormData(prev => {
            if (section === 'teamName') {
                return { ...prev, teamName: processedValue.toUpperCase() };
            }
            if (section === 'payment') {
                return { ...prev, payment: { ...prev.payment, [field]: processedValue } };
            }
            if (section === 'teamLeader') {
                return { ...prev, teamLeader: { ...prev.teamLeader, [field]: processedValue } };
            }
            if (section === 'members') {
                const newMembers = [...prev.members];
                newMembers[index] = { ...newMembers[index], [field]: processedValue };
                return { ...prev, members: newMembers };
            }
            return prev;
        });

        // Determine error key
        let errorKey = `${section}`;
        if (field) errorKey += `_${field}`;
        if (index !== null) errorKey = `${section}_${index}_${field}`;

        // Special cases for root fields
        if (section === 'teamName') errorKey = 'teamName';
        if (field === 'transactionId') errorKey = 'transactionId';

        // Clear error when typing (locally) - Note: Dynamic check might re-add it if still invalid
        if (errors[errorKey]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[errorKey];
                return newErrors;
            });
        }
    };

    const handleBlur = (section, field, value, index = null) => {
        let error = null;
        let key = `${section}_${field}`;
        if (index !== null) key = `${section}_${index}_${field}`;

        // Special cases for root fields to match validateForm keys
        if (section === 'teamName') key = 'teamName';
        if (field === 'transactionId') key = 'transactionId';

        // Field Validation Logic
        if (section === 'teamName') {
            if (!value) error = "Team Identify Required";
        } else if (field === 'transactionId') {
            if (!value) error = "Txn ID Required";
        } else {
            // Person Validation
            if (field === 'name') {
                if (!value) error = "Required";
                // Name: No constraints
            }
            if (field === 'regNo') {
                if (!value) error = "Required";
                // RegNo: No constraints
            }
            if (field === 'email') {
                if (!value) error = "Required";
                else if (!value.endsWith('@klu.ac.in')) error = "klu.ac.in Only";
            }
            if (field === 'phone') {
                if (!value) error = "Required";
                else if (!/^\d{10}$/.test(value)) error = "10 Digits";
            }
            if (field === 'gender') { if (!value) error = "Select"; }
            if (field === 'year') { if (!value) error = "Select"; }
            if (field === 'branch') { if (!value) error = "Required"; }
            if (field === 'section') { if (!value) error = "Required"; }
            if (field === 'accommodation') { if (!value) error = "Select"; }

            // Note: Hostel fields are conditional, but we can check if they are being blured/filled
            if (field === 'hostelName' && value === '') error = "Required"; // Simple check
            if (field === 'roomNo') {
                if (!value) error = "Required";
                else if (!/^\d+$/.test(value)) error = "Digits";
            }
            if (field === 'wardenName') { if (!value) error = "Required"; }
            if (field === 'wardenPhone') {
                if (!value) error = "Required";
                else if (!/^\d{10}$/.test(value)) error = "10 Digits";
            }
        }

        if (error) {
            setErrors(prev => ({ ...prev, [key]: error }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, payment: { ...prev.payment, screenshot: file } }));
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.screenshot;
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Team Name: Unique (mock)
        if (!formData.teamName) newErrors.teamName = "Required";
        if (fieldStatus.teamName === 'taken') newErrors.teamName = "ALREADY EXISTS";

        // Helper to validate a person
        const validatePerson = (person, prefix) => {
            if (!person.name) newErrors[`${prefix}_name`] = "Required";
            // Name: No constraints as requested

            if (!person.regNo) newErrors[`${prefix}_regNo`] = "Required";

            if (!person.email) newErrors[`${prefix}_email`] = "Required";
            else if (!person.email.endsWith('@klu.ac.in')) newErrors[`${prefix}_email`] = "Use KLU Mail";

            if (!person.phone) newErrors[`${prefix}_phone`] = "Required";
            else if (!/^\d{10}$/.test(person.phone)) newErrors[`${prefix}_phone`] = "10 Digits";

            if (!person.gender) newErrors[`${prefix}_gender`] = "Select";
            if (!person.year) newErrors[`${prefix}_year`] = "Select";
            if (!person.branch) newErrors[`${prefix}_branch`] = "Required";
            if (!person.section) newErrors[`${prefix}_section`] = "Required";
            if (!person.accommodation) newErrors[`${prefix}_accommodation`] = "Select";

            if (person.accommodation === 'Hostler') {
                if (!person.hostelName) newErrors[`${prefix}_hostelName`] = "Required";
                if (!person.roomNo) newErrors[`${prefix}_roomNo`] = "Required";
                else if (!/^\d+$/.test(person.roomNo)) newErrors[`${prefix}_roomNo`] = "Digits";

                if (!person.wardenName) newErrors[`${prefix}_wardenName`] = "Required";

                if (!person.wardenPhone) newErrors[`${prefix}_wardenPhone`] = "Required";
                else if (!/^\d{10}$/.test(person.wardenPhone)) newErrors[`${prefix}_wardenPhone`] = "10 Digits";
            }
        };

        validatePerson(formData.teamLeader, 'teamLeader');


        formData.members.forEach((member, idx) => validatePerson(member, `members_${idx}`));

        // Payment
        if (!formData.payment.transactionId) newErrors.transactionId = "Required";
        if (fieldStatus.transactionId === 'taken') newErrors.transactionId = "ALREADY EXISTS";

        if (!formData.payment.screenshot) newErrors.screenshot = "Required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Helper to compress image and convert to base64
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800; // Optimization
                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.6)); // 60% quality
                };
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        // 0. Safety Check: Online Status
        if (!navigator.onLine) {
            setSubmitError("YOU ARE OFFLINE. ESTABLISH UPLINK AND RETRY.");
            // Scroll to error
            const errorDiv = document.querySelector('.error-message-container');
            if (errorDiv) errorDiv.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        if (validateForm()) {
            setIsSubmitting(true);
            console.log("Starting submission (Reference Impl)...");

            try {
                // 1. Process Image
                let base64Image = null;
                if (formData.payment.screenshot) {
                    console.log("Compressing screenshot...");
                    base64Image = await compressImage(formData.payment.screenshot);
                }

                // 2. Prepare Data
                // ID generation: Remove spaces AND special characters
                const registrationId = formData.teamName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                const processedData = {
                    ...formData,
                    teamLeader: {
                        ...formData.teamLeader,
                        email: formData.teamLeader.email.toLowerCase()
                    },
                    members: formData.members.map(m => ({
                        ...m,
                        email: m.email.toLowerCase()
                    })),
                    payment: {
                        ...formData.payment,
                        screenshot: base64Image // Storing Base64 directly
                    },
                    submittedAt: new Date().toISOString()
                };

                // 3. Atomic Write
                console.log("Saving to Firestore via Transaction...");
                await runTransaction(firestore, async (transaction) => {
                    const regDocRef = doc(firestore, 'registrations', registrationId);

                    // A. Read existing state
                    const regsRef = collection(firestore, 'registrations');
                    // Simplified checks: Only Team Name and Transaction ID uniqueness
                    const [docSnap, txnSnap] = await Promise.all([
                        transaction.get(regDocRef),
                        getDocs(query(regsRef, where("payment.transactionId", "==", processedData.payment.transactionId)))
                    ]);

                    // B. Validate Constraints
                    if (docSnap.exists()) throw new Error("Team Name already taken! Please choose another.");
                    if (!txnSnap.empty) throw new Error("Transaction ID already used!");

                    // C. Commit Write
                    transaction.set(regDocRef, processedData);
                });

                console.log("Transaction successful.");
                setIsSuccess(true);
                setTimeout(() => navigate('/success'), 1500);

            } catch (error) {
                console.error("Error submitting registration: ", error);
                setIsSubmitting(false);

                // Enhanced Error Handling
                let msg = error.message || "An unknown error occurred.";
                if (msg.includes("unavailable")) msg = "System busy. Please try again in 5s.";
                if (msg.includes("resource-exhausted")) msg = "Quota exceeded. Contact Support.";

                setSubmitError(msg);

                // Scroll to error
                setTimeout(() => {
                    const errorDiv = document.getElementById('submit-error');
                    if (errorDiv) errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);

            }
        } else {
            // Scroll to first error

            // Wait for React to render the error states
            setTimeout(() => {
                // Try to find the first error message
                const firstError = document.querySelector('.text-red-500');
                // Or find the first input with red border (group)
                const firstInvalidInput = document.querySelector('.border-red-500');

                if (firstInvalidInput) {
                    firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalidInput.focus();
                } else if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    };




    return (
        <div className="fixed inset-0 z-[150] bg-black overflow-y-auto overflow-x-hidden">
            {/* Background Atmosphere (Borrowed from Hero.jsx) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Image Layer */}
                <img
                    src="/breaking%20bad.png"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-contain md:object-cover opacity-20 mix-blend-overlay filter grayscale contrast-125 bg-black"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-amber-400/10 via-amber-600/5 to-transparent"></div>
                <div
                    className="absolute inset-0 opacity-60 mix-blend-soft-light"
                    style={{
                        background: 'radial-gradient(circle at 50% 50%, #d17a22 0%, transparent 100%)'
                    }}
                ></div>

                {/* 3. Hazard Glow (Amber/Orange) - Bright Atmosphere */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-yellow-500/10 rounded-full blur-[120px] mix-blend-screen opacity-70"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[100px] mix-blend-screen opacity-60"></div>
                <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] mix-blend-screen opacity-50"></div>

                <SmokeOverlay />
                <FloatingElements />

                {/* Particle Overlay - Fixed positioning for overlay */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="particle absolute w-1 h-1 bg-amber-400/40 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            willChange: 'transform',
                            transform: 'translateZ(0)'
                        }}
                    ></div>
                ))}
            </div>

            <div ref={containerRef} className="relative z-10 min-h-screen py-6 md:py-10 px-4 md:px-6 max-w-[95%] xl:max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-end mb-8 md:mb-16 border-b border-white/10 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                            <span className="text-yellow-500 font-mono text-xs tracking-[0.3em] uppercase">Secure Channel Established</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-white font-cinematic leading-none">
                            OPERATIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-500">REGISTRATION</span>
                        </h1>
                    </div>
                    <button onClick={onClose} className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <span className="hidden md:block font-mono text-xs tracking-widest group-hover:underline">ABORT</span>
                        <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-12">

                    {/* Team Name Section */}
                    <div className="form-section relative bg-black/40 border-t border-b border-yellow-500/30 p-12 backdrop-blur-md">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>

                        <InputField
                            label="TEAM IDENTITY"
                            value={formData.teamName}
                            onChange={v => handleChange('teamName', null, v)}
                            onBlur={e => handleBlur('teamName', 'teamName', e.target.value)}
                            error={errors.teamName}
                            validationStatus={fieldStatus.teamName}
                            placeholder="DESIGNATE TEAM NAME"
                            className={`bg-transparent border-b-2 ${errors.teamName ? 'border-red-500' : 'border-yellow-500/50'} text-xl md:text-3xl py-6 font-cinematic text-center w-full focus:outline-none focus:border-yellow-500 text-yellow-500 placeholder:text-white/10 placeholder:font-sans`}
                        />
                        <p className="text-xs text-gray-500 mt-6 font-mono text-center tracking-widest uppercase">* Unique Identifier Required.</p>
                    </div>

                    {/* Team Leader */}
                    <div className="space-y-12">
                        <h3 className="text-2xl font-bold text-gray-400 font-mono uppercase tracking-widest flex items-center gap-6">
                            <span className="h-[1px] flex-1 bg-white/10"></span>
                            Squad Unit
                            <span className="h-[1px] flex-1 bg-white/10"></span>
                        </h3>
                    </div>
                    <PersonForm
                        data={formData.teamLeader}
                        onChange={(field, value) => handleChange('teamLeader', field, value)}
                        onBlur={(field, value) => handleBlur('teamLeader', field, value)}
                        prefix="teamLeader"
                        title="Team Lead"
                        errors={errors}
                        validationStatuses={{
                            regNo: fieldStatus.leaderRegNo,
                            email: fieldStatus.leaderEmail
                        }}
                    />

                    {/* Team Members */}
                    <div className="space-y-12">
                        {formData.members.map((member, idx) => (
                            <PersonForm
                                key={idx}
                                data={member}
                                onChange={(field, value) => handleChange('members', field, value, idx)}
                                onBlur={(field, value) => handleBlur('members', field, value, idx)}
                                prefix={`members_${idx}`}
                                title={`Operative ${idx + 1}`}
                                errors={errors}
                            />
                        ))}
                    </div>

                    {/* Payment Section */}
                    <div className="form-section bg-neutral-900/40 border border-white/10 p-4 md:p-10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-10 flex items-center gap-4 font-cinematic">
                            <CreditCard className="text-yellow-500 w-6 h-6 md:w-8 md:h-8" />
                            <span className="tracking-widest">TRANSACTION PROTOCOL</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
                            <div className="flex flex-col items-center p-4 md:p-8 bg-black/40 border border-white/10 relative">
                                {/* Corner Decorations */}
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/20"></div>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/20"></div>
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/20"></div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/20"></div>

                                {/* Placeholder for QR */}
                                <div className="w-48 h-48 md:w-64 md:h-64 bg-white p-3 mb-6 md:mb-8 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                    <div className="w-full h-full border-2 border-black flex items-center justify-center bg-gray-100">
                                        <img src="/payment.jpeg" alt="QR Code" className="w-full h-full object-contain mix-blend-multiply" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="font-bold text-black text-xl md:text-2xl">QR CODE</span>'; }} />
                                    </div>
                                </div>
                                <div className="text-center w-full">
                                    <div className="flex flex-col items-center border-b border-white/10 pb-4 mb-4">
                                        <span className="text-gray-400 text-xs md:text-sm font-mono uppercase mb-2">Total Amount</span>
                                        <span className="text-3xl md:text-5xl font-bold text-yellow-500 font-mono mb-2">₹1,400</span>
                                        <span className="text-sm md:text-lg text-white/80 font-mono font-bold tracking-widest">₹350 / UNIT</span>
                                    </div>
                                    <div className="font-mono text-sm md:text-lg bg-yellow-500/10 border border-yellow-500/20 px-4 md:px-6 py-3 md:py-4 text-yellow-500 break-all md:break-normal">
                                        UPI ID: <span className="font-bold text-white">69097701@ubin</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:gap-8 items-start">
                                <InputField
                                    label="Transaction ID / UTR"
                                    value={formData.payment.transactionId}
                                    onChange={v => handleChange('payment', 'transactionId', v)}
                                    onBlur={e => handleBlur('payment', 'transactionId', e.target.value)}
                                    error={errors.transactionId}
                                    validationStatus={fieldStatus.transactionId}
                                    placeholder="ENTER TRANSACTION ID"
                                />

                                <div className="flex flex-col gap-4">
                                    <label className="text-yellow-500/80 font-mono text-xs uppercase tracking-[0.2em]">PROOF OF TRANSFER</label>
                                    <div className={`border border-dashed ${errors.screenshot ? 'border-red-500' : 'border-white/20'} bg-black/20 p-6 md:p-12 text-center hover:bg-white/5 transition-all cursor-pointer relative group/upload overflow-hidden`}>
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="relative z-0 group-hover/upload:scale-110 transition-transform duration-300">
                                            <Upload className="mx-auto text-yellow-500 mb-4" size={40} />
                                            <p className="text-xs md:text-sm text-gray-300 font-mono uppercase tracking-widest">
                                                {formData.payment.screenshot ? formData.payment.screenshot.name : "INITIALIZE UPLOAD SEQUENCE"}
                                            </p>
                                        </div>
                                    </div>
                                    {errors.screenshot && <span className="error-message text-red-500 text-xs font-mono">{errors.screenshot}</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-start gap-3 bg-red-950/80 border border-red-500 p-4 max-w-2xl text-left rounded-sm shadow-[0_0_15px_rgba(239,68,68,0.2)] backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none"></div>
                            <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5 relative z-10" />
                            <p className="text-red-100 text-xs md:text-sm font-mono leading-relaxed relative z-10">
                                <strong className="text-red-500 block mb-1 tracking-widest uppercase text-base">Critical Notice:</strong>
                                Ensure all details are accurate before submission. Once registered, details cannot be modified and will be used for CERTIFICATES & CREDITS.
                            </p>
                        </div>
                    </div>
                    {/* Submit Button */}
                    <div className="sticky bottom-4 z-50 pt-10 pb-6 bg-gradient-to-t from-black via-black/90 to-transparent">
                        {submitError && (
                            <div className="mb-6 p-6 bg-red-500/10 border border-red-500 text-red-500 text-center font-bold text-lg">
                                ERROR: {submitError}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting || Object.values(fieldStatus).some(s => s === 'loading' || s === 'taken')}
                            className="w-full relative overflow-hidden bg-yellow-500 text-black font-black text-lg md:text-xl py-3 md:py-4 hover:bg-white transition-all duration-300 shadow-[0_0_40px_rgba(234,179,8,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] clip-path-slant"
                            style={{ clipPath: 'polygon(2% 0, 100% 0, 98% 100%, 0% 100%)' }}
                        >
                            <span className="relative z-10 flex justify-center items-center gap-4">
                                {isSuccess ? (
                                    <>
                                        <Check className="w-8 h-8 text-black" />
                                        ACCESS GRANTED
                                    </>
                                ) : isSubmitting ? (
                                    <>
                                        <span className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></span>
                                        PROCESSING CLASSIFIED DATA...
                                    </>
                                ) : (
                                    <>
                                        CONFIRM REGISTRATION
                                        <div className="w-3 h-3 bg-black animate-pulse"></div>
                                    </>
                                )}
                            </span>
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};
