import image_e2d0b789f57092492a3652d0d5838719d9b8f1fb from 'figma:asset/e2d0b789f57092492a3652d0d5838719d9b8f1fb.png';
import { AdvancedMapComponent } from '@/app/components/AdvancedMapComponent';
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { InteractiveMap } from '@/app/components/InteractiveMap';
import logoImage from "figma:asset/09a2c08124bc30931042733f559987278c1bd50f.png";
import { 
  Search, MapPin, Pill, Menu, X, Star, Sparkles, 
  MessageCircle, Send, User, Lock, ArrowRight, LayoutDashboard, 
  Store, Truck, Users, Bell, Settings, LogOut, TrendingUp, AlertCircle, Package,
  CheckCircle, CreditCard, Shield, Activity, Globe, ChevronLeft, ChevronRight, ChevronDown, FileText,
  Facebook, Twitter, Instagram, Linkedin, Languages, Bot, Calendar, ClipboardList, Box, Anchor,
  HelpCircle, FileDown, Plus, ShoppingBag, Mail, Server, Wifi, Cpu, AlertTriangle, CheckSquare, Eye, UserCheck, UserX,
  Camera, Navigation, Heart, Thermometer, Clock, Wallet, BarChart3, ScanLine, ShoppingCart, Zap, Brain, Radio, Stethoscope, Phone,
  Calculator, Repeat, WifiOff, Megaphone, Briefcase, PlusCircle, Trash2, Baby, Syringe, FileHeart, Coins, Map as MapIcon, CreditCard as CardIcon,
  Percent, ArrowUpRight, ArrowDownLeft, Scale, Ticket, Mic, Gift, Database, Upload, File, Network, QrCode as QrCodeIcon, MinusCircle,
  TrendingDown, Globe2, Ship, Plane, Container, BarChart4, PieChart as PieChartIcon, Filter, Radar, ThumbsUp, Inbox, Tag, Archive,
  Terminal, Code, HardDrive, RefreshCw, FilePlus, UserPlus, Stethoscope as StethoscopeIcon, History,
  Video, Mic as MicIcon, MicOff, VideoOff, PhoneOff
} from 'lucide-react';

/**
 * ==============================================================================
 * FinDawa - VERSION V25.0 (FINAL BOSS - TELEMEDICINE)
 * Status: COMPLETED + TELE-CONSULTATION INTEGRATED
 * Features: 
 * - Stock: In/Out Management + Cash Register Simulator
 * - B2C: FIFO Sort + Emergency & Workflow Status
 * - Network: Real Profiles, Interactive Comments
 * - TELEMEDICINE: Video Call UI for Doctor/Patient
 * Admin: EL MAHMI YOUSSEF
 * ==============================================================================
 */

// --- 1. LOCAL DATABASE ENGINE ---
const DB_KEYS = {
    USERS: 'findawa_users_v1',
    STOCK: 'findawa_stock_v1',
    B2B_ORDERS: 'findawa_b2b_orders_v1', 
    PATIENT_ORDERS: 'findawa_patient_orders_v1',
    SESSION: 'findawa_session_v1',
    TICKETS: 'findawa_tickets_v1',
    PRESCRIPTIONS: 'findawa_prescriptions_v1'
};

// Initial Data Seeds
const SEED_STOCK = [
    { id: 1, name: "Doliprane 1000mg", rayon: "A1", exp: "12/2025", qty: 120, status: "Available", dateIn: "01/01/2025", dateOut: "15/01/2025", price: 15 },
    { id: 2, name: "Ventoline", rayon: "C2", exp: "11/2024", qty: 5, status: "Low", dateIn: "10/12/2024", dateOut: "14/01/2025", price: 45 },
    { id: 3, name: "Augmentin", rayon: "B3", exp: "05/2025", qty: 45, status: "Available", dateIn: "05/01/2025", dateOut: "-", price: 80 }
];

const SEED_B2B_OFFERS = [
    { id: 1, supplier: "Morocco Logistics", product: "Doliprane 1000mg", price: 12.50, min: 50, stock: "High", promo: "-5%", category: "Medicines" },
    { id: 2, supplier: "Atlas Pharma", product: "Vitamin C 1000mg", price: 35.00, min: 20, stock: "Medium", promo: null, category: "Parapharmacy" },
    { id: 3, supplier: "Dislog Group", product: "FFP2 Masks", price: 2.00, min: 100, stock: "Low", promo: "-10%", category: "Equipment" },
];

const SEED_TICKETS = [
    { id: 'T-101', from: 'Dr. Tazi (Pharmacy)', role: 'pharmacist', subject: 'Stock Stuck Issue', message: 'I cannot update my Ventoline stock. It is urgent because I have patients waiting.', date: '2025-01-14T10:30:00', status: 'open', priority: 'Urgent', tags: ['Technical', 'Urgent'] },
    { id: 'T-102', from: 'Ahmed (Patient)', role: 'patient', subject: 'Refund not received', message: 'I bought a medicine but I do not see the loyalty points.', date: '2025-01-13T14:20:00', status: 'open', priority: 'Medium', tags: ['Loyalty'] },
    { id: 'T-103', from: 'Visitor (External)', role: 'guest', subject: 'Advertising Partnership', message: 'Hello, we are a marketing agency and we want to display ads on FinDawa.', date: '2025-01-12T09:00:00', status: 'spam', priority: 'Low', tags: ['Commercial', 'Spam'] },
];

const db = {
    get: (key, fallback) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch (e) { return fallback; }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            window.dispatchEvent(new Event('storage'));
        } catch (e) { console.error("Storage Error", e); }
    }
};

// --- 2. TRANSLATIONS & CONSTANTS ---
const PRICING_PLANS = [
  { role: 'patient', title: 'Citizen Pack', price: 'Free', features: ['Health Record', 'Prescription Scan', 'Medicine Reminder'], color: 'green', cta: "Register" },
  { role: 'pharmacist', title: 'Pharmacy Pack', price: '199 DH', features: ['Stock Management', 'Group Buying', 'Online Sales (Click&Collect)'], color: 'blue', cta: "Pro Trial" },
  { role: 'doctor', title: 'Clinic Pack', price: '299 DH', features: ['Digital Prescription', 'Tele-Consultation', 'Shared Patient File'], color: 'cyan', cta: "Join" },
  { role: 'importer', title: 'Corporate Pack', price: '999 DH', features: ['3D Logistics', 'Data Market', 'GPS Tracking'], color: 'purple', cta: "Contact" }
];

const TRANSLATIONS = {
  fr: {
    nav_solutions: "Solutions",
    nav_network: "Network",
    nav_pricing: "Pricing",
    nav_login: "Pro",
    nav_subscribe: "Register",
    chat_welcome: "Hello! I am FinDawa AI.",
    contact_title: "Contact FinDawa",
    contact_btn: "Send Message"
  }
};

// --- 3. UI ATOMS ---
const Button = ({ children, variant = 'primary', className = '', onClick, type="button", disabled=false, icon: Icon }) => {
  const styles = {
    primary: "bg-green-700 text-white hover:bg-green-800 shadow-lg shadow-green-900/20 border-none",
    secondary: "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50",
    dark: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg",
    outline: "bg-transparent border-2 border-white text-white hover:bg-white/10",
    sos: "bg-red-600 text-white hover:bg-red-700 shadow-xl animate-pulse",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900",
    console: "bg-black text-green-400 border border-green-900 hover:bg-slate-900 font-mono",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-lg"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`px-6 py-3.5 rounded-2xl font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 touch-manipulation ${styles[variant]} ${className}`}>
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white dark:bg-slate-800 dark:text-white rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 ${onClick ? 'cursor-pointer active:scale-98 transition-transform' : ''} ${className}`}>
    {children}
  </div>
);

const Badge = ({ status }) => {
  const styles = {
    'Validated': 'bg-emerald-100 text-emerald-800',
    'Pending': 'bg-blue-100 text-blue-800',
    'Out of Stock': 'bg-red-100 text-red-800',
    'Available': 'bg-green-100 text-green-800',
    'Low': 'bg-orange-100 text-orange-800',
    'Expired': 'bg-red-600 text-white',
    'Urgent': 'bg-red-500 text-white animate-bounce',
    'Medium': 'bg-orange-100 text-orange-700',
    'Low': 'bg-slate-100 text-slate-500',
    'Technical': 'bg-indigo-100 text-indigo-700',
    'Commercial': 'bg-purple-100 text-purple-700',
    'Loyalty': 'bg-teal-100 text-teal-700',
    'Spam': 'bg-gray-200 text-gray-500',
    'Signed': 'bg-cyan-100 text-cyan-800',
    'Delivered': 'bg-gray-200 text-gray-700',
    'Ready': 'bg-teal-100 text-teal-700'
  };
  return <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide ${styles[status] || 'bg-slate-100 text-slate-700'}`}>{status}</span>;
};

// --- NEW: NOTIFICATION SYSTEM (LIVE DEMO FEEL) ---
const NotificationToast = ({ message, onClose }) => (
    <div className="fixed top-20 right-6 z-[100] animate-in slide-in-from-right duration-500">
        <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 flex items-start gap-3 w-80">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full"><Bell size={16}/></div>
            <div className="flex-1">
                <h4 className="font-bold text-sm text-slate-800">Notification</h4>
                <p className="text-xs text-slate-500">{message}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={14}/></button>
        </div>
    </div>
);

// --- NEW: TELEMEDICINE VIDEO CALL MODAL ---
const TelemedicineModal = ({ onClose, role, targetName }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setTimer(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (s) => {
        const mins = Math.floor(s / 60).toString().padStart(2, '0');
        const secs = (s % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in zoom-in duration-300">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent z-10">
                <div>
                    <h3 className="text-white font-bold text-xl flex items-center gap-2">
                        <StethoscopeIcon className="text-cyan-400"/> Tele-Dawa
                    </h3>
                    <p className="text-white/70 text-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        Online with {targetName}
                    </p>
                </div>
                <div className="bg-white/10 backdrop-blur px-4 py-1 rounded-full text-white font-mono">{formatTime(timer)}</div>
            </div>

            {/* Main Video (Remote) */}
            <div className="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-30 animate-pulse">
                    <User size={200} className="text-slate-700"/>
                </div>
                <div className="text-white/50 text-xl font-light tracking-widest z-0">SECURE VIDEO STREAM</div>
                
                {/* PIP (Self) */}
                <div className="absolute bottom-24 right-6 w-32 h-48 bg-slate-800 rounded-xl border-2 border-white/20 shadow-2xl overflow-hidden z-10">
                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                        <User size={32} className="text-slate-500"/>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="h-24 bg-slate-900 flex items-center justify-center gap-6 pb-6">
                <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className={`p-4 rounded-full transition ${isMuted ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    {isMuted ? <MicOff size={24}/> : <MicIcon size={24}/>}
                </button>
                <button 
                    onClick={onClose} 
                    className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30 transform hover:scale-110 transition"
                >
                    <PhoneOff size={32}/>
                </button>
                <button 
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-4 rounded-full transition ${isVideoOff ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    {isVideoOff ? <VideoOff size={24}/> : <Video size={24}/>}
                </button>
            </div>
        </div>
    );
};

// --- 4. FEATURE COMPONENTS ---

const VoiceSearchButton = ({ onSearch }) => {
    const [listening, setListening] = useState(false);
    const handleListen = () => {
        setListening(true);
        setTimeout(() => {
            setListening(false);
            onSearch("Doliprane (My head hurts)");
        }, 2000);
    };
    return (
        <button onClick={handleListen} className={`p-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
            <Mic size={20} />
        </button>
    );
};

const SmartMap = ({ activeRoute, targetPharmacy }) => (
    <div className="relative w-full h-[300px] md:h-[500px] bg-slate-100 rounded-3xl overflow-hidden border-2 border-white shadow-inner group">
        <InteractiveMap active={activeRoute} target={targetPharmacy} />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm z-10 text-slate-600 flex items-center gap-1">
            <MapPin size={12} className={activeRoute ? "text-green-500" : "text-red-500"}/> 
            {activeRoute ? `Route: ${targetPharmacy}` : "My Position (GPS)"}
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[rgba(73,10,30,0.85)]">
            <div className="w-6 h-6 bg-[rgb(252,21,71)] rounded-full border-4 border-white shadow-xl relative z-20 animate-pulse"></div>
        </div>
         <div className="absolute top-[30%] left-[20%] bg-[rgb(13,184,77)] p-2 rounded-full text-white shadow-lg animate-bounce"><Store size={18}/></div>
         {activeRoute && <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur text-white p-3 rounded-xl text-sm flex justify-between items-center animate-in slide-in-from-bottom">
             <span>Optimized Route</span>
             <span className="font-bold text-green-400">4 min</span>
         </div>}
    </div>
);

const DigitalWallet = ({ balance, type }) => (
    <div className="relative overflow-hidden bg-slate-900 text-white p-6 rounded-3xl shadow-2xl">
        <div className="flex justify-between items-start mb-8">
            <div><p className="text-xs text-slate-400 uppercase tracking-widest">Wallet Balance</p><h3 className="text-3xl font-mono font-bold">{balance} DH</h3></div>
            <div className="p-2 bg-white/10 rounded-xl"><Wallet className="text-green-400"/></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
             <button className="bg-green-600 hover:bg-green-500 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"><PlusCircle size={16}/> Top Up</button>
             <button className="bg-white/10 hover:bg-white/20 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"><QrCodeIcon size={16}/> Pay</button>
        </div>
    </div>
);

const HealthBooklet = ({ scannedDocs = [], onUpload }) => {
    const [activeProfile, setActiveProfile] = useState('Ahmed (Me)');
    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        if(e.target.files && e.target.files[0]) {
            onUpload({ name: e.target.files[0].name, type: 'Document', date: 'Today' });
        }
    };

    const records = [
        { type: 'consultation', title: 'Cardiologist', date: '12 Jan 2025', doc: 'Dr. Tazi' },
        { type: 'vaccin', title: 'Seasonal Flu', date: '10 Nov 2024', status: 'Done' },
        ...scannedDocs.map(d => ({ type: 'scan', title: d.name, date: d.date, status: 'Scanned' }))
    ];

    return (
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in">
            <Card className="md:col-span-1 bg-slate-50 border-none h-fit">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-700">My Family</h3>
                    <button className="text-green-600 hover:bg-green-100 p-1 rounded-full"><PlusCircle size={20}/></button>
                </div>
                <div className="space-y-2">
                    {['Ahmed (Me)', 'Fatima (Wife)', 'Yassir (Son)'].map(p => (
                        <button key={p} onClick={() => setActiveProfile(p)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeProfile === p ? 'bg-white shadow-md text-green-700 border border-green-100' : 'hover:bg-white text-slate-500'}`}>
                            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><User size={16}/></div> 
                            <span className="font-medium text-sm">{p}</span>
                        </button>
                    ))}
                </div>
            </Card>

            <Card className="md:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2"><FileHeart className="text-red-500"/> File: {activeProfile}</h2>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                    <Button className="py-2 text-xs" variant="outline" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                        <Upload size={14}/> Import
                    </Button>
                </div>

                <div className="space-y-4">
                    <div className="relative border-l-2 border-slate-100 ml-4 space-y-6 pl-6 py-2">
                        {records.map((rec, i) => (
                            <div key={i} className="relative">
                                <div className="absolute -left-[31px] bg-white border-2 border-green-500 w-4 h-4 rounded-full"></div>
                                <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm hover:shadow-md transition">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs text-slate-400 font-mono mb-1">{rec.date}</p>
                                            <h4 className="font-bold text-slate-800">{rec.title}</h4>
                                            {rec.doc && <p className="text-xs text-slate-500 flex items-center gap-1"><Stethoscope size={12}/> {rec.doc}</p>}
                                        </div>
                                        <div className={`p-2 rounded-full ${rec.type === 'vaccin' ? 'bg-purple-50 text-purple-600' : rec.type === 'scan' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                                            {rec.type === 'vaccin' ? <Syringe size={16}/> : rec.type === 'scan' ? <Camera size={16}/> : <FileText size={16}/>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

// --- SUPPORT LOGIC ---
const classifyMessage = (subject, message) => {
    const text = (subject + " " + message).toLowerCase();
    let priority = 'Low';
    let tags = ['General'];

    if (text.includes('urgent') || text.includes('panne') || text.includes('blocked') || text.includes('health') || text.includes('death')) {
        priority = 'Urgent';
        tags.push('Technical');
    }
    else if (text.includes('price') || text.includes('offer') || text.includes('partnership') || text.includes('ad')) {
        priority = 'Medium';
        tags.push('Commercial');
    }
    else if (text.includes('login') || text.includes('account') || text.includes('password')) {
        priority = 'Medium';
        tags.push('Account');
    }

    if (text.includes('casino') || text.includes('win') || text.includes('lottery')) {
        priority = 'Low';
        tags.push('Spam');
    }

    return { priority, tags };
};

const TicketSystem = ({ role, suggestions = [], user }) => {
    const [tickets, setTickets] = useState([]);
    const [newT, setNewT] = useState("");
    
    useEffect(() => {
        const allTickets = db.get(DB_KEYS.TICKETS, SEED_TICKETS);
        const myTickets = allTickets.filter(t => t.role === role || t.from.includes(role));
        setTickets(myTickets);
    }, [role]);

    const handleSubmit = () => {
        if (!newT) return;
        const { priority, tags } = classifyMessage(newT, newT);
        const newTicket = {
            id: `T-${Date.now().toString().slice(-4)}`,
            from: user ? user.name : `${role} User`,
            role: role,
            subject: newT.substring(0, 20) + "...",
            message: newT,
            date: new Date().toISOString(),
            status: 'open',
            priority: priority,
            tags: tags
        };
        const allTickets = db.get(DB_KEYS.TICKETS, SEED_TICKETS);
        const updatedTickets = [...allTickets, newTicket];
        db.set(DB_KEYS.TICKETS, updatedTickets);
        setTickets([...tickets, newTicket]);
        setNewT("");
        alert("Ticket created and sent to Admin!");
    };
    
    return (
        <Card>
            <h3 className="font-bold mb-4 flex items-center gap-2"><Ticket size={18}/> Support & Tickets ({role})</h3>
            <div className="flex gap-2 mb-2">
                <input value={newT} onChange={e=>setNewT(e.target.value)} placeholder="Describe your issue..." className="flex-1 border p-2 rounded text-sm outline-none"/>
                <Button onClick={handleSubmit} className="py-1 px-3 text-xs">Create</Button>
            </div>
            {suggestions.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                    {suggestions.map((s, i) => (
                        <button key={i} onClick={() => setNewT(s)} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full whitespace-nowrap hover:bg-slate-200 border border-slate-200">{s}</button>
                    ))}
                </div>
            )}
            <div className="space-y-2 max-h-40 overflow-y-auto">
                {tickets.map((t,i)=>(<div key={i} className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100 text-sm"><div><span className="font-bold block">{t.subject}</span><span className="text-[10px] text-slate-400">{new Date(t.date).toLocaleDateString()}</span></div><Badge status={t.status === 'open' ? 'Pending' : t.status}/></div>))}
            </div>
        </Card>
    );
};

// ** UPDATED NETWORK HUB (INTERACTIVE) **
const PharmacyNetworkHub = () => {
    const [viewMode, setViewMode] = useState('radar');
    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [activeCommentId, setActiveCommentId] = useState(null);

    const nearbyPharmacies = [
        { id: 1, name: "Pharma Espoir", dist: "0.5km", status: "open", stockScore: 95, address: "Hay Salam, St 12", phone: "0522..." },
        { id: 2, name: "Pharma Ibn Sina", dist: "1.2km", status: "closed", stockScore: 80, address: "City Center, Av 5", phone: "0535..." },
        { id: 3, name: "Pharma Al Quds", dist: "2.5km", status: "open", stockScore: 60, address: "Massira 2, St 8", phone: "0536..." },
    ];

    const [livePosts, setLivePosts] = useState([
        { id: 1, pharmacy: "Pharma Espoir", text: "🚨 Urgent: Need 10 boxes of Ventoline.", type: "urgent", time: "2m", comments: [] },
        { id: 2, pharmacy: "Pharma Al Quds", text: "📦 Exchange: Surplus of Doliprane 1g (50 boxes).", type: "offer", time: "15m", comments: [] },
    ]);

    const handleComment = (postId) => {
        if(!commentText) return;
        setLivePosts(prev => prev.map(p => {
            if(p.id === postId) {
                return { ...p, comments: [...p.comments, { author: "Me (Pharma Al Amal)", text: commentText }] };
            }
            return p;
        }));
        setCommentText("");
        setActiveCommentId(null);
    };

    const openChat = (pharmacy) => {
        setSelectedChat(pharmacy);
        setViewMode('chat');
        setSelectedProfile(null); // Close profile if open
    };

    return (
        <div className="grid md:grid-cols-3 gap-6 h-[550px] animate-in fade-in">
            {/* Sidebar Navigation */}
            <Card className="col-span-1 border-r border-slate-200 flex flex-col p-0 overflow-hidden">
                 <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                     <h3 className="font-bold flex items-center gap-2"><Network/> Network Hub</h3>
                     <p className="text-xs opacity-80">Connected with 12 pharmacies</p>
                 </div>
                 <div className="flex-1 p-2 space-y-1">
                     <button onClick={()=>setViewMode('radar')} className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${viewMode==='radar'?'bg-blue-50 text-blue-700':'hover:bg-slate-50'}`}>
                         <Radar size={20}/> <div className="text-left"><p className="font-bold text-sm">Zone Radar</p><p className="text-[10px] text-slate-400">See neighbors</p></div>
                     </button>
                     <button onClick={()=>setViewMode('wall')} className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${viewMode==='wall'?'bg-blue-50 text-blue-700':'hover:bg-slate-50'}`}>
                         <Activity size={20}/> <div className="text-left"><p className="font-bold text-sm">Live Wall</p><p className="text-[10px] text-slate-400">Interactive & Comments</p></div>
                     </button>
                     <button onClick={()=>setViewMode('chat')} className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${viewMode==='chat'?'bg-blue-50 text-blue-700':'hover:bg-slate-50'}`}>
                         <MessageCircle size={20}/> <div className="text-left"><p className="font-bold text-sm">Messaging</p><p className="text-[10px] text-slate-400">Private chats</p></div>
                     </button>
                 </div>
            </Card>

            {/* Main Content Area */}
            <Card className="col-span-2 relative overflow-hidden p-0">
                {/* --- VIEW: RADAR --- */}
                {viewMode === 'radar' && (
                    <div className="h-full flex flex-col">
                        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                            <h3 className="font-bold flex gap-2"><MapPin size={18}/> Neighbors (2km)</h3>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded animate-pulse">Scanning...</span>
                        </div>
                        <div className="flex-1 bg-slate-50 p-4 space-y-3 overflow-y-auto">
                            {nearbyPharmacies.map(p => (
                                <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center hover:shadow-md transition">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${p.status === 'open' ? 'bg-green-500' : 'bg-slate-400'}`}>
                                            {p.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{p.name}</p>
                                            <p className="text-xs text-slate-500">{p.dist} • Reliability: <span className="text-green-600">{p.stockScore}%</span></p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button className="h-8 text-xs px-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50" onClick={()=>setSelectedProfile(p)}>Profile</Button>
                                        <Button className="h-8 text-xs px-3 bg-blue-600 text-white hover:bg-blue-700" onClick={()=>openChat(p)}><MessageCircle size={14}/></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Profile Modal */}
                        {selectedProfile && (
                            <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center p-4">
                                <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-in zoom-in">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold">{selectedProfile.name}</h3>
                                        <button onClick={()=>setSelectedProfile(null)}><X/></button>
                                    </div>
                                    <div className="space-y-2 text-sm text-slate-600 mb-6">
                                        <p><span className="font-bold">Address:</span> {selectedProfile.address}</p>
                                        <p><span className="font-bold">Distance:</span> {selectedProfile.dist}</p>
                                        <p><span className="font-bold">Status:</span> {selectedProfile.status}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button className="w-full bg-blue-600 text-white" onClick={()=>openChat(selectedProfile)}>Send Message</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- VIEW: WALL (Interactive) --- */}
                {viewMode === 'wall' && (
                    <div className="h-full flex flex-col bg-slate-50">
                        <div className="bg-white border-b p-4">
                            <div className="flex gap-2">
                                <input className="flex-1 bg-slate-100 border-none rounded-xl p-3 text-sm" placeholder="Post a request..."/>
                                <Button className="bg-blue-600"><Send size={18}/></Button>
                            </div>
                        </div>
                        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                            {livePosts.map(post => (
                                <div key={post.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="font-bold text-sm text-slate-800">{post.pharmacy}</div>
                                            <span className="text-[10px] text-slate-400">• {post.time}</span>
                                        </div>
                                        <Badge status={post.type === 'urgent' ? 'Urgent' : 'Available'}/>
                                    </div>
                                    <p className="text-sm text-slate-700 mb-3">{post.text}</p>
                                    
                                    {/* Comments Section */}
                                    {post.comments.length > 0 && (
                                        <div className="bg-slate-50 p-2 rounded-lg mb-2 space-y-1">
                                            {post.comments.map((c, idx) => (
                                                <p key={idx} className="text-xs"><span className="font-bold">{c.author}:</span> {c.text}</p>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-2 border-t pt-2">
                                        <button className="flex-1 text-xs text-slate-500 font-medium hover:text-blue-600 flex items-center justify-center gap-1"><ThumbsUp size={14}/> I have stock</button>
                                        <button className="flex-1 text-xs text-slate-500 font-medium hover:text-blue-600 flex items-center justify-center gap-1" onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}><MessageCircle size={14}/> Comment</button>
                                    </div>
                                    
                                    {activeCommentId === post.id && (
                                        <div className="mt-2 flex gap-2 animate-in slide-in-from-top-2">
                                            <input 
                                                className="flex-1 border p-1 rounded text-xs" 
                                                placeholder="Your comment..." 
                                                value={commentText}
                                                onChange={e=>setCommentText(e.target.value)}
                                                onKeyPress={e => e.key === 'Enter' && handleComment(post.id)}
                                            />
                                            <Button className="h-6 px-2 text-[10px]" onClick={()=>handleComment(post.id)}>Send</Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- VIEW: CHAT --- */}
                {viewMode === 'chat' && (
                    <div className="h-full flex flex-col">
                         <div className="bg-white border-b p-3 flex justify-between items-center">
                             <div className="flex items-center gap-2">
                                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">{selectedChat ? selectedChat.name.charAt(0) : 'R'}</div>
                                 <span className="font-bold text-sm">{selectedChat ? selectedChat.name : "Global Network"}</span>
                             </div>
                             <button onClick={()=>setViewMode('radar')}><X size={18} className="text-slate-400"/></button>
                         </div>
                         <div className="flex-1 bg-slate-50 p-4 flex flex-col justify-center items-center text-slate-400">
                             {selectedChat ? (
                                 <div className="w-full h-full flex flex-col justify-end space-y-2">
                                     <div className="self-center text-xs text-slate-300 mb-4">Start of secure conversation</div>
                                     {/* Mock history */}
                                     <div className="self-end bg-blue-600 text-white p-2 rounded-lg text-sm max-w-[80%]">Salam, labass?</div>
                                     <div className="self-start bg-white p-2 rounded-lg text-sm border shadow-sm max-w-[80%]">Hamdoulah, do you have Doliprane?</div>
                                 </div>
                             ) : (
                                 <>
                                     <MessageCircle size={48} className="mb-2 opacity-20"/>
                                     <p className="text-sm">Select a pharmacy to chat.</p>
                                 </>
                             )}
                         </div>
                         <div className="p-3 bg-white border-t flex gap-2">
                             <input className="flex-1 border p-2 rounded-lg text-sm outline-none" placeholder="Your message..." disabled={!selectedChat}/>
                             <Button className="p-2 h-10 w-10 bg-blue-600 hover:bg-blue-700" disabled={!selectedChat}><Send size={16}/></Button>
                         </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

const B2BMarketplace = ({ onOrderPlaced }) => {
    const [cartCount, setCartCount] = useState(0);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [b2bCart, setB2bCart] = useState([]);
    const [showCartModal, setShowCartModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');

    const offers = SEED_B2B_OFFERS;

    const filteredOffers = offers.filter(offer => {
        const matchesFilter = activeFilter === 'All' || offer.category === activeFilter;
        const matchesSearch = offer.product.toLowerCase().includes(searchTerm.toLowerCase()) || offer.supplier.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const addToB2BCart = (offer) => {
        setB2bCart([...b2bCart, { ...offer, qty: offer.min }]); 
        setCartCount(prev => prev + 1);
    };

    const cartTotal = b2bCart.reduce((total, item) => total + (item.price * item.qty), 0);

    const handleCheckout = () => {
        if (onOrderPlaced) {
            onOrderPlaced(b2bCart, cartTotal);
        }
        setShowCartModal(false);
        setB2bCart([]);
        setCartCount(0);
        alert("B2B Order sent to importer!");
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Flash Deal Banner */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg">
                <div>
                    <span className="bg-yellow-400 text-purple-900 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">FLASH DEAL ⚡</span>
                    <h3 className="text-2xl font-bold">Winter Pack -30%</h3>
                    <p className="text-purple-100 text-sm">On a selection of 50 products. Ends in 2h.</p>
                </div>
                <Button className="bg-white text-purple-600 hover:bg-purple-50 text-xs">View Offer</Button>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18}/>
                    <input 
                        className="w-full pl-10 p-2 border rounded-xl outline-none text-sm" 
                        placeholder="Search product, lab..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full md:w-auto">
                    {['All', 'Medicines', 'Parapharmacy', 'Equipment'].map(f => (
                        <button 
                            key={f} 
                            onClick={() => setActiveFilter(f)}
                            className={`px-4 py-2 border rounded-xl text-sm font-medium transition whitespace-nowrap ${activeFilter === f ? 'bg-purple-600 text-white border-purple-600' : 'bg-white hover:border-purple-500 hover:text-purple-600'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative cursor-pointer" onClick={() => setShowCartModal(true)}>
                    <ShoppingCart size={24} className="text-slate-600"/>
                    {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
                </div>
            </div>

            {/* Marketplace Grid */}
            <div className="grid md:grid-cols-2 gap-4">
                {filteredOffers.map(offer => (
                    <div key={offer.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1"><Truck size={10}/> {offer.supplier}</span>
                                {offer.promo && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">{offer.promo}</span>}
                            </div>
                            <h4 className="font-bold text-slate-800">{offer.product}</h4>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-lg font-bold text-purple-700">{offer.price.toFixed(2)} DH</span>
                                <span className="text-xs text-slate-500">Min: {offer.min} units</span>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <div className="flex-1 bg-slate-50 rounded-lg flex items-center justify-center text-sm font-bold text-slate-600 border border-slate-200">
                                <span className="px-2 cursor-pointer hover:bg-slate-200 rounded">-</span> {offer.min} <span className="px-2 cursor-pointer hover:bg-slate-200 rounded">+</span>
                            </div>
                            <Button onClick={() => addToB2BCart(offer)} className="flex-1 py-2 text-xs bg-slate-900 text-white h-auto">Add</Button>
                        </div>
                    </div>
                ))}
            </div>
            
             {/* Cart Modal */}
             {showCartModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg flex items-center gap-2"><ShoppingCart size={20}/> B2B Cart</h3>
                            <button onClick={() => setShowCartModal(false)}><X size={20}/></button>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1">
                            {b2bCart.length === 0 ? (
                                <p className="text-center text-slate-400 py-8">Your cart is empty.</p>
                            ) : (
                                <div className="space-y-3">
                                    {b2bCart.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 border rounded-lg">
                                            <div>
                                                <p className="font-bold text-sm">{item.product}</p>
                                                <p className="text-xs text-slate-500">{item.supplier} • Qty: {item.qty}</p>
                                            </div>
                                            <p className="font-bold text-purple-700">{(item.price * item.qty).toFixed(2)} DH</p>
                                        </div>
                                    ))}
                                    <div className="border-t pt-4 mt-4">
                                        <div className="flex justify-between font-bold text-lg mb-4">
                                            <span>Total (Excl. Tax)</span>
                                            <span>{cartTotal.toFixed(2)} DH</span>
                                        </div>
                                        
                                        <h4 className="font-bold text-sm mb-2">Payment Method:</h4>
                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            {['Bank Transfer', 'Check (Delivery)', 'Credit 30d', 'Credit Card'].map(m => (
                                                <button 
                                                    key={m} 
                                                    onClick={() => setPaymentMethod(m)}
                                                    className={`p-2 text-xs border rounded-lg font-medium transition ${paymentMethod === m ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t bg-slate-50">
                            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={b2bCart.length === 0 || !paymentMethod} onClick={handleCheckout}>Confirm Order</Button>
                        </div>
                    </div>
                </div>
             )}
        </div>
    );
};

const FinanceDashboard = () => {
  // Real transaction fetching from Local DB simulated
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(1250430);

  useEffect(() => {
      const syncData = () => {
          // Simulate fetching live orders from DB
          const storedOrders = db.get(DB_KEYS.B2B_ORDERS, []);
          const dbTx = storedOrders.map(o => ({
              id: o.id,
              entity: o.from,
              date: new Date(o.date).toLocaleDateString(),
              amount: `+${o.total}`,
              status: 'Received',
              type: 'in'
          }));
          
          const staticTx = [
            { id: 'TX-991', entity: 'Tangier Med Customs', date: '13 Dec, 14:30', amount: '-450,000', status: 'Paid', type: 'out' },
            { id: 'TX-989', entity: 'Logistics Express', date: '11 Dec, 18:00', amount: '-2,300', status: 'Pending', type: 'pending' },
          ];

          setTransactions([...dbTx, ...staticTx]);
          
          // Update balance based on incoming orders
          const income = storedOrders.reduce((acc, curr) => acc + parseFloat(curr.total), 0);
          setBalance(1250430 + income);
      };

      syncData();
      window.addEventListener('storage', syncData); // Listen for updates from other tabs/components
      return () => window.removeEventListener('storage', syncData);
  }, []);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      {/* Top Section: Cards & Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Virtual Card Swiper */}
        <div className="relative h-56 w-full">
            <div className="absolute top-0 left-0 w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 via-gray-800 to-black text-white p-6 shadow-2xl flex flex-col justify-between border border-slate-600 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="relative z-10 flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <div className="w-4 h-4 bg-orange-500 rounded-full opacity-80"></div>
                            <div className="w-4 h-4 bg-yellow-500 rounded-full opacity-80 -ml-2"></div>
                        </div>
                        <span className="font-mono text-xs tracking-widest opacity-80">CORPORATE ELITE</span>
                    </div>
                    <Wifi size={20} className="rotate-90 opacity-50"/>
                </div>
                <div className="relative z-10">
                    <p className="font-mono text-2xl tracking-widest mb-4 shadow-black drop-shadow-md">5412 7512 3412 8899</p>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[10px] uppercase opacity-60">Available Balance</p>
                            <p className="text-3xl font-bold tracking-tight">{balance.toLocaleString()} <span className="text-sm font-normal opacity-70">MAD</span></p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase opacity-60">Valid Thru</p>
                            <p className="font-mono text-sm">12/28</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
            <Card className="flex flex-col justify-between bg-emerald-50 border-emerald-100 hover:shadow-md transition cursor-pointer">
                <div className="flex justify-between items-start">
                    <div className="p-2 bg-emerald-100 w-fit rounded-lg text-emerald-700"><TrendingUp size={20}/></div>
                    <span className="text-[10px] bg-white px-2 py-1 rounded text-emerald-600 font-bold">+12%</span>
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Revenue (Dec)</p>
                    <p className="text-2xl font-black text-slate-800">4.5M <span className="text-xs text-slate-400 font-normal">DH</span></p>
                </div>
            </Card>
            <Card className="flex flex-col justify-between bg-red-50 border-red-100 hover:shadow-md transition cursor-pointer">
                <div className="flex justify-between items-start">
                    <div className="p-2 bg-red-100 w-fit rounded-lg text-red-700"><TrendingDown size={20}/></div>
                    <span className="text-[10px] bg-white px-2 py-1 rounded text-red-600 font-bold">-5%</span>
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Expenses (Dec)</p>
                    <p className="text-2xl font-black text-slate-800">1.2M <span className="text-xs text-slate-400 font-normal">DH</span></p>
                </div>
            </Card>
        </div>
      </div>

      {/* Middle Section: Chart & AI Insights */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Activity className="text-purple-600"/> Cashflow Analytics</h3>
                <div className="flex gap-2">
                    <button className="text-xs font-bold bg-slate-900 text-white px-3 py-1 rounded-full">Week</button>
                    <button className="text-xs font-bold text-slate-400 hover:bg-slate-100 px-3 py-1 rounded-full transition">Month</button>
                </div>
            </div>
            {/* CSS Bar Chart Simulation */}
            <div className="h-48 flex items-end justify-between gap-3 px-2">
                {[45, 70, 30, 85, 50, 95, 60].map((h, i) => (
                    <div key={i} className="w-full bg-slate-100 rounded-t-md relative group overflow-hidden h-full flex items-end">
                        <div className="w-full bg-gradient-to-t from-purple-600 to-indigo-400 rounded-t-md transition-all duration-1000 ease-out group-hover:opacity-80" style={{height: `${h}%`}}>
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg transition-all duration-300 mb-2">
                                {h}k
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-3 text-xs text-slate-400 font-mono border-t pt-2">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
        </Card>

        <Card className="bg-slate-900 text-white border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 bg-purple-500/20 blur-3xl rounded-full"></div>
            <h3 className="font-bold flex items-center gap-2 mb-6 text-yellow-400 relative z-10"><Sparkles size={16}/> AI CFO Insights</h3>
            <div className="space-y-4 relative z-10">
                <div className="p-3 bg-white/10 rounded-xl border border-white/5 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-1">
                        <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Optimization</p>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">Cash surplus detected (+200k MAD). Suggestion: Early payment to supplier "Pfizer" for 2% discount.</p>
                </div>
                <div className="p-3 bg-white/10 rounded-xl border border-white/5 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-1">
                        <p className="text-[10px] text-red-300 font-bold uppercase tracking-wider">Due Date Alert</p>
                        <AlertTriangle size={12} className="text-red-400"/>
                    </div>
                    <p className="text-sm font-medium mb-2">Customs invoice "Tangier Med" (-450k) expires in 48h.</p>
                    <Button className="w-full py-2 text-xs bg-white text-slate-900 hover:bg-slate-200 font-bold border-none">Activate Transfer</Button>
                </div>
            </div>
        </Card>
      </div>

      {/* Bottom Section: Transactions */}
      <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">Recent Financial Flows</h3>
            <Button variant="outline" className="text-xs h-8">Export CSV</Button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <tr>
                        <th className="p-3 rounded-l-lg font-medium">Transaction ID</th>
                        <th className="p-3 font-medium">Counterparty</th>
                        <th className="p-3 font-medium">Date</th>
                        <th className="p-3 font-medium">Amount</th>
                        <th className="p-3 rounded-r-lg font-medium">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {transactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                            <td className="p-3 font-mono text-slate-500 text-xs group-hover:text-purple-600 transition-colors">{tx.id}</td>
                            <td className="p-3 font-bold text-slate-800">{tx.entity}</td>
                            <td className="p-3 text-slate-500 text-xs">{tx.date}</td>
                            <td className={`p-3 font-bold font-mono ${tx.type === 'in' ? 'text-emerald-600' : tx.type === 'out' ? 'text-slate-800' : 'text-orange-500'}`}>
                                {tx.amount} DH
                            </td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                                    tx.status === 'Received' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                    tx.status === 'Paid' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                    'bg-orange-50 text-orange-700 border-orange-200'
                                }`}>
                                    {tx.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};

const AdminChart = () => (
    <div className="flex items-end justify-between h-32 gap-2 mt-4">
        {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
            <div key={i} className="w-full bg-blue-100 rounded-t-sm relative group">
                <div className="absolute bottom-0 w-full bg-blue-600 rounded-t-sm transition-all duration-1000" style={{height: `${h}%`}}></div>
            </div>
        ))}
    </div>
);

// Logistics Map 3D
const LogisticsMap = () => {
    const containerRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (window.THREE) {
            setIsLoaded(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.async = true;
        script.onload = () => setIsLoaded(true);
        document.body.appendChild(script);
        return () => {
            if(document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        if (!isLoaded || !containerRef.current || !window.THREE) return;

        const THREE = window.THREE;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        camera.position.z = 200;
        camera.position.y = 50;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(renderer.domElement);

        // Earth Particles
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 1500;
        const particles = new Float32Array(particleCount * 3);
        const radius = 60;

        for (let i = 0; i < particleCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / particleCount);
            const theta = Math.sqrt(particleCount * Math.PI) * phi;
            const particlesI3 = i * 3;
            particles[particlesI3] = radius * Math.cos(theta) * Math.sin(phi);
            particles[particlesI3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
            particles[particlesI3 + 2] = radius * Math.cos(phi);
        }
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));
        const particleMaterial = new THREE.PointsMaterial({ color: 0x818cf8, size: 1.5 }); // Indigo
        const earthParticles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(earthParticles);

        const animate = () => {
            requestAnimationFrame(animate);
            earthParticles.rotation.y += 0.002;
            renderer.render(scene, camera);
        };
        animate();
    }, [isLoaded]);

    return (
        <div className="relative w-full h-[400px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl group">
             {!isLoaded && <div className="absolute inset-0 flex items-center justify-center text-slate-500">Loading 3D...</div>}
             <div ref={containerRef} className="w-full h-full" />
             <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-full text-xs text-cyan-400 font-mono border border-cyan-500/30 pointer-events-none">LIVE 3D TRACKING ●</div>
        </div>
    );
};

const MarketIntelligence = () => (
    <div className="grid md:grid-cols-2 gap-6 animate-in fade-in">
        <Card className="bg-slate-900 text-white border-slate-700">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2"><Brain className="text-purple-400"/> AI Market Prediction</h3>
                    <p className="text-xs text-slate-400">National Predictive Analysis (Big Data)</p>
                </div>
                <Badge status="Live" />
            </div>
            <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold">Insulin (National Need)</span>
                        <span className="text-red-400 text-xs font-bold">+240% vs N-1</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-red-500 h-full w-[85%] animate-pulse"></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">Recommendation: Immediate import recommended (Critical stock in 3 regions).</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold">Vitamin C (Trend)</span>
                        <span className="text-green-400 text-xs font-bold">+15% Stable</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[45%]"></div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex gap-2">
                 <Button className="w-full bg-purple-600 hover:bg-purple-700 text-xs">Generate PDF Report</Button>
            </div>
        </Card>

        <Card>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Globe2 className="text-blue-600"/> Global Sourcing</h3>
            <div className="space-y-3">
                 <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 cursor-pointer">
                     <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-xl">🇨🇳</div>
                         <div><p className="font-bold text-sm">Shanghai Lab</p><p className="text-xs text-slate-500">Delay: 15d • Price: $$</p></div>
                     </div>
                     <Button className="py-1 px-3 text-xs h-8" variant="outline">Contact</Button>
                 </div>
                 <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 cursor-pointer">
                     <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-xl">🇩🇪</div>
                         <div><p className="font-bold text-sm">Berlin Pharma</p><p className="text-xs text-slate-500">Delay: 5d • Price: $$$</p></div>
                     </div>
                     <Button className="py-1 px-3 text-xs h-8" variant="outline">Contact</Button>
                 </div>
            </div>
        </Card>
    </div>
);

const ImporterNetworkHub = () => {
    const [viewMode, setViewMode] = useState('radar'); // radar, wall, chat, broadcast
    const [selectedChat, setSelectedChat] = useState(null);
    const [broadcastMsg, setBroadcastMsg] = useState("");

    const clients = [
        { id: 1, name: "Pharma Al Amal", status: "Gold", orders: "High", dist: "2km", online: true },
        { id: 2, name: "Pharma Centre", status: "Silver", orders: "Med", dist: "5km", online: false },
        { id: 3, name: "Grande Pharma", status: "Platinum", orders: "Very High", dist: "1km", online: true },
    ];

    const liveFeeds = [
        { id: 1, author: "Pharma Al Amal", content: "Urgent need for 500 boxes of Insulin.", time: "2m", tag: "Urgent" },
        { id: 2, author: "Pharma Centre", content: "Looking for supplier for orthopedic equipment.", time: "15m", tag: "Tender" },
    ];

    return (
        <div className="grid md:grid-cols-3 gap-6 h-[550px] animate-in fade-in">
            <Card className="col-span-1 border-r border-slate-200 flex flex-col p-0 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-purple-800 to-indigo-900 text-white">
                    <h3 className="font-bold flex items-center gap-2"><Globe/> Importer Hub</h3>
                    <p className="text-xs opacity-70">National B2B Network</p>
                </div>
                <div className="flex-1 p-2 space-y-1">
                     <button onClick={()=>setViewMode('radar')} className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${viewMode==='radar'?'bg-purple-50 text-purple-700':'hover:bg-slate-50'}`}>
                         <Radar size={20}/> <div className="text-left"><p className="font-bold text-sm">Global View</p><p className="text-[10px] text-slate-400">Client Map</p></div>
                     </button>
                     <button onClick={()=>setViewMode('wall')} className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${viewMode==='wall'?'bg-purple-50 text-purple-700':'hover:bg-slate-50'}`}>
                         <Activity size={20}/> <div className="text-left"><p className="font-bold text-sm">Tenders</p><p className="text-[10px] text-slate-400">Pharmacy Requests</p></div>
                     </button>
                     <button onClick={()=>setViewMode('chat')} className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${viewMode==='chat'?'bg-purple-50 text-purple-700':'hover:bg-slate-50'}`}>
                         <MessageCircle size={20}/> <div className="text-left"><p className="font-bold text-sm">B2B Messaging</p><p className="text-[10px] text-slate-400">Negotiations</p></div>
                     </button>
                     <button onClick={()=>setViewMode('broadcast')} className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${viewMode==='broadcast'?'bg-purple-50 text-purple-700':'hover:bg-slate-50'}`}>
                         <Megaphone size={20}/> <div className="text-left"><p className="font-bold text-sm">Broadcast</p><p className="text-[10px] text-slate-400">Send Promos</p></div>
                     </button>
                </div>
            </Card>

            <Card className="col-span-2 relative overflow-hidden p-0 bg-slate-50">
                {viewMode === 'radar' && (
                    <div className="h-full flex flex-col">
                        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                            <h3 className="font-bold flex gap-2"><MapPin size={18}/> Active Clients</h3>
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded animate-pulse">Live Data</span>
                        </div>
                        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                             {clients.map(c => (
                                 <div key={c.id} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center hover:shadow-md transition">
                                     <div className="flex items-center gap-3">
                                         <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${c.status === 'Gold' ? 'bg-yellow-500' : c.status === 'Platinum' ? 'bg-slate-700' : 'bg-slate-400'}`}>
                                             {c.name.charAt(0)}
                                         </div>
                                         <div>
                                             <p className="font-bold text-slate-800">{c.name} {c.online && <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-1"></span>}</p>
                                             <p className="text-xs text-slate-500">Vol: {c.orders} • Dist: {c.dist}</p>
                                         </div>
                                     </div>
                                     <Button className="h-8 text-xs px-3 bg-purple-600 text-white hover:bg-purple-700" onClick={()=>{setSelectedChat(c); setViewMode('chat')}}>Contact</Button>
                                 </div>
                             ))}
                        </div>
                    </div>
                )}

                {viewMode === 'wall' && (
                      <div className="h-full flex flex-col">
                          <div className="bg-white border-b p-4"><h3 className="font-bold text-slate-700">Market Demands</h3></div>
                          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                              {liveFeeds.map(feed => (
                                  <div key={feed.id} className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-l-purple-500">
                                      <div className="flex justify-between mb-2">
                                          <div className="flex items-center justify-between w-full">
                                              <span className="font-bold text-sm">{feed.author}</span>
                                              <span className="text-[10px] text-slate-400">{feed.time}</span>
                                          </div>
                                      </div>
                                      <p className="text-sm text-slate-700 mb-3">{feed.content}</p>
                                      <div className="flex justify-end gap-2">
                                          <Button className="h-7 text-[10px] px-3 bg-slate-100 text-slate-600 hover:bg-slate-200">Ignore</Button>
                                          <Button className="h-7 text-[10px] px-3 bg-purple-600 text-white hover:bg-purple-700">Make Offer</Button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                )}

                {viewMode === 'chat' && (
                    <div className="h-full flex flex-col">
                        <div className="bg-white border-b p-3 flex justify-between items-center">
                             <div className="flex items-center gap-2">
                                 <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">{selectedChat ? selectedChat.name.charAt(0) : '#'}</div>
                                 <span className="font-bold text-sm">{selectedChat ? selectedChat.name : "Select a client"}</span>
                             </div>
                             <button onClick={()=>setViewMode('radar')}><X size={18} className="text-slate-400"/></button>
                         </div>
                         <div className="flex-1 p-4 flex flex-col justify-center items-center text-slate-400">
                             {selectedChat ? (
                                 <div className="w-full h-full flex flex-col justify-end space-y-2">
                                     <div className="self-start bg-white p-2 rounded-lg text-sm border shadow-sm max-w-[80%]">Hello, do you have stock on Insulin?</div>
                                     <div className="self-end bg-purple-600 text-white p-2 rounded-lg text-sm max-w-[80%]">Yes, a new delivery arrives tomorrow.</div>
                                 </div>
                             ) : (
                                 <>
                                     <MessageCircle size={48} className="mb-2 opacity-20"/>
                                     <p className="text-sm">B2B Secure Messaging</p>
                                 </>
                             )}
                         </div>
                         <div className="p-3 bg-white border-t flex gap-2">
                             <input className="flex-1 border p-2 rounded-lg text-sm outline-none" placeholder="Your message..." disabled={!selectedChat}/>
                             <Button className="p-2 h-10 w-10 bg-purple-600 hover:bg-purple-700" disabled={!selectedChat}><Send size={16}/></Button>
                         </div>
                    </div>
                )}

                {viewMode === 'broadcast' && (
                    <div className="h-full flex flex-col p-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                            <Megaphone size={40} className="mx-auto text-purple-600 mb-4"/>
                            <h3 className="text-lg font-bold mb-2">Broadcast Offers</h3>
                            <p className="text-sm text-slate-500 mb-6">Send a push notification to all connected pharmacies (12,450) instantly.</p>
                            <textarea 
                                className="w-full border p-3 rounded-xl mb-4 text-sm" 
                                rows="4" 
                                placeholder="Ex: Massive arrival of Doliprane. -10% for any order > 1000 Units."
                                value={broadcastMsg}
                                onChange={e=>setBroadcastMsg(e.target.value)}
                            ></textarea>
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white" onClick={()=>alert("Broadcast sent to 12,450 pharmacies!")}>
                                <Send size={16} className="mr-2"/> Send to entire network
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

// --- 5. MODALS & SECTIONS (RESTORED FROM V19) ---

const ContactModal = ({ onClose, lang }) => {
    const t = TRANSLATIONS[lang] || TRANSLATIONS['fr'];
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', contact: '', message: '' });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // --- ADMIN INTEGRATION: Save External Message to DB ---
        const { priority, tags } = classifyMessage("Contact Form", formData.message);
        
        const newTicket = {
            id: `EXT-${Date.now().toString().slice(-4)}`,
            from: `${formData.name} (Visitor)`,
            role: 'guest',
            subject: 'Web Contact Form',
            message: `${formData.message} [Contact: ${formData.contact}]`,
            date: new Date().toISOString(),
            status: 'open',
            priority: priority,
            tags: [...tags, 'External']
        };

        const allTickets = db.get(DB_KEYS.TICKETS, SEED_TICKETS);
        db.set(DB_KEYS.TICKETS, [...allTickets, newTicket]);
        
        // Simulate Email
        console.log(`[EMAIL SERVER] Sending email to admin@findawa.ma from ${formData.name}`);
        
        setSubmitted(true);
    };

    return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Mail className="text-green-600"/> {t.contact_title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition"><X size={20}/></button>
            </div>
            {!submitted ? (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input className="w-full border border-slate-200 p-3 rounded-xl outline-none" placeholder="Your full name" required onChange={e => setFormData({...formData, name: e.target.value})}/>
                    <input className="w-full border border-slate-200 p-3 rounded-xl outline-none" placeholder="Email / Phone" required onChange={e => setFormData({...formData, contact: e.target.value})}/>
                    <textarea className="w-full border border-slate-200 p-3 rounded-xl outline-none h-32" placeholder="How can we help you?" required onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                    <Button type="submit" className="w-full py-4 text-lg">{t.contact_btn}</Button>
                    <p className="text-[10px] text-center text-slate-400">A copy will be sent to FinDawa administration.</p>
                </form>
            ) : (
                <div className="p-10 text-center animate-in zoom-in">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32}/></div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Message Sent!</h3>
                    <p className="text-sm text-slate-500 mb-4">The support team has received your request.</p>
                    <Button onClick={onClose} className="w-full">Close</Button>
                </div>
            )}
        </div>
    </div>
    );
};

const LegalModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Shield className="text-green-600"/> Legal Notices & Compliance</h2>
           <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition"><X size={20}/></button>
        </div>
        <div className="p-8 overflow-y-auto text-slate-600 space-y-8 leading-relaxed text-left" dir="ltr">
            {/* Same Legal Content as V19 */}
            <section>
                <h3 className="text-lg font-bold text-slate-900 mb-3 border-l-4 border-green-500 pl-3">1. Publisher Identification</h3>
                <p><strong>FinDawa S.A.R.L</strong>, technology company under Moroccan law.</p>
                <p>Headquarters: Faculty of Sciences, Meknes.</p>
                <p>RC: 00000 | ICE: 000000000 | Tax ID: 000000</p>
              
                <p><strong>Director of publication:</strong> Mr. EL MAHMI YOUSSEF.</p>
                <p className="text-xs text-slate-500 mt-2 italic bg-slate-100 p-2 rounded">
                   "Submitted to the <strong>Gemini 3 Hackathon</strong>,
                  FinDawa is an AI-powered healthcare platform developed by <strong>EL MAHMI YOUSSEF</strong>, 
                  leveraging the advanced capabilities of the Gemini ecosystem. This project stands as a testament to the synergy between technological innovation and academic excellence. We extend our sincere gratitude for the <strong>academic supervision provided at the Faculty of Sciences of Meknes</strong> during the 'Innovation Management' module. This strategic guidance provided the essential framework that allowed this initiative to grow from a classroom concept into a scalable reality." concept into a global competitive solution."
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-slate-900 mb-3 border-l-4 border-green-500 pl-3">2. Compliance with Law 17-04 (Medicine Code)</h3>
                <p className="mb-2">FinDawa operates in strict compliance with Dahir No. 1-06-151 promulgating <strong>Law No. 17-04</strong> bearing the medicine and pharmacy code.</p>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm">
                    <p className="font-bold text-yellow-800 mb-1">Article 30:</p>
                    <p className="italic">"No one may offer, put on sale or sell medicines and non-medicinal pharmaceutical products to the public outside a pharmacy."</p>
                </div>
                <p className="mt-2"><strong>Operation:</strong> FinDawa acts exclusively as a <strong>geolocation</strong> and <strong>reservation (Click & Collect)</strong> platform. No financial transaction related to medicine is made on the application. Delivery, advice, and payment are made physically within the pharmacy by a qualified pharmacist.</p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-slate-900 mb-3 border-l-4 border-green-500 pl-3">3. Data Protection (Law 09-08)</h3>
                <p className="mb-2">In accordance with Law No. 09-08 relating to the protection of individuals with regard to the processing of personal data.</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Processing notified to the <strong>CNDP</strong> (National Commission for the Control of Personal Data Protection).</li>
                    <li>Your health data (sensitive) is hosted on secure servers and is never shared with third parties without explicit consent.</li>
                    <li>Right of access and rectification: contact@findawa.ma or contact.findawa.ma@gmail.com</li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-bold text-slate-900 mb-3 border-l-4 border-green-500 pl-3">4. Reference Institutions and Regulations</h3>
                <p>FinDawa recognizes the authority of the following organizations in regulating the sector:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-600"/> <strong>DMP:</strong> Directorate of Medicine and Pharmacy.</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-600"/> <strong>CNOP:</strong> National Council of the Order of Pharmacists.</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-600"/> <strong>ANAM:</strong> National Health Insurance Agency.</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-600"/> <strong>Ministry of Health</strong> of Morocco.</li>
                </ul>
            </section>

             <section>
                <h3 className="text-lg font-bold text-slate-900 mb-3 border-l-4 border-green-500 pl-3">5. Limitation of Liability</h3>
                <p>Information on stocks is provided in real-time by partner pharmacies. FinDawa does not guarantee absolute availability in case of inventory lag. The pharmacist's advice always prevails over AI suggestions.</p>
            </section>
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3"><Button onClick={onClose}>I certify having read and understood</Button></div>
      </div>
  </div>
);

// --- 6. DASHBOARDS (THE MAJOR CHANGE ADMIN) ---

// --- HELPER COMPONENTS FOR ADMIN ---
const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</h3>
            <p className="text-2xl font-black text-slate-800 mt-1">{value}</p>
            {trend && <p className={`text-[10px] flex items-center gap-1 mt-1 font-bold ${trend.includes('+') ? 'text-green-600' : 'text-red-500'}`}>
                {trend.includes('+') ? <TrendingUp size={10}/> : <Activity size={10}/>} {trend}
            </p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={20} />
        </div>
    </div>
);

const MOCK_USERS = [
    { id: 1, name: "Dr. Amina Tazi", role: "Pharmacist", status: "Active", location: "Casablanca", joinDate: "12/01/2025" },
    { id: 2, name: "Youssef El Mahmi", role: "Patient", status: "Active", location: "Fes", joinDate: "14/01/2025" },
    { id: 3, name: "Pharma du Centre", role: "Pharmacy Entity", status: "Pending", location: "Rabat", joinDate: "15/01/2025" },
    { id: 4, name: "Karim Bennani", role: "Patient", status: "Inactive", location: "Tangier", joinDate: "10/01/2025" },
    { id: 5, name: "Dr. Sara Benyazid", role: "Pharmacist", status: "Active", location: "Meknes", joinDate: "15/01/2025" },
    { id: 6, name: "Grossisterie Atlas", role: "Importer", status: "Active", location: "Casablanca", joinDate: "16/01/2025" },
];

// ** FIXED ADMIN DASHBOARD **
const AdminDashboard = ({ user }) => {
    // State
    const [activeView, setActiveView] = useState('overview');
    const [devMode, setDevMode] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [userSearch, setUserSearch] = useState("");
    const [logs, setLogs] = useState([
        "[SYSTEM] Booting FinDawa Core v24.0...",
        "[AI-KERNEL] Connecting to Gemini API Gateway...",
        "[AI-KERNEL] Model 'gemini-1.5-flash' Active & Monitoring.",
        "[DB] Connection established: findawa_users_v1",
        "[AUTH] Token refreshed for UserID: ADMIN-001"
    ]);

    // LOAD DATA (Using Global DB)
    useEffect(() => {
        // Fallback mock data if DB is empty or fails
        const SEED_TICKETS_MOCK = [
             { id: 'T-101', from: "Dr. Tazi (Pharmacie)", subject: "Problème de Stock Bloqué", priority: "Urgent", date: new Date().toISOString(), message: "Bonjour, notre stock de Doliprane est bloqué sur 'Réservé' alors que la commande est annulée. C'est urgent SVP." },
             { id: 'T-102', from: "Ahmed (Patient)", subject: "Remboursement non reçu", priority: "Medium", date: new Date().toISOString(), message: "J'ai acheté un médicament mais je ne vois pas les points de fidélité." },
             { id: 'T-103', from: "Visitor (Externe)", subject: "Partenariat Publicité", priority: "Low", date: new Date().toISOString(), message: "Proposition de partenariat B2B." }
        ];

        try {
            // Attempt to fetch from global db object
            const storedTickets = db.get(DB_KEYS.TICKETS, SEED_TICKETS_MOCK);
            setTickets(storedTickets);
        } catch (e) {
            console.error("DB Load Error", e);
            setTickets(SEED_TICKETS_MOCK);
        }

        // Live Logs Simulation
        const logInterval = setInterval(() => {
            if(devMode) {
                const processes = ["VectorDB_Scan", "OCR_Process", "Gemini_Reasoning", "B2B_Sync"];
                const proc = processes[Math.floor(Math.random() * processes.length)];
                const systemLoad = Math.floor(Math.random() * 30);
                const newLog = `[${proc}] Status: OK - CPU: ${systemLoad}% - Latency: ${Math.floor(Math.random() * 50)}ms`;
                setLogs(prev => [...prev.slice(-12), newLog]);
            }
        }, 2500);
        return () => clearInterval(logInterval);
    }, [devMode]);

    // Helpers
    const getPriorityColor = (p) => {
        if (p === 'Urgent') return 'bg-red-100 text-red-700 animate-pulse border border-red-200';
        if (p === 'Medium') return 'bg-orange-100 text-orange-700 border border-orange-200';
        return 'bg-slate-100 text-slate-600 border border-slate-200';
    };

    const generateAIReply = () => {
        if(!selectedTicket) return;
        setIsGenerating(true);
        setReplyText("Gemini is analyzing the ticket context...");
        setTimeout(() => {
            const aiResponse = `Hello ${selectedTicket.from.split(' ')[0]},\n\nThank you for reaching out regarding "${selectedTicket.subject}". We have analyzed your request with our AI system.\n\nRegarding your issue: The technical team has been notified and a patch is being deployed. Please try again in 10 minutes.\n\nBest regards,\nFinDawa Support Team`;
            setReplyText(aiResponse);
            setIsGenerating(false);
        }, 1500);
    };

    const filteredUsers = MOCK_USERS.filter(u => 
        u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
        u.role.toLowerCase().includes(userSearch.toLowerCase())
    );

    return (
        <div className="flex h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 font-sans text-slate-800 animate-in fade-in">
            {/* === SIDEBAR === */}
            <div className="w-64 bg-slate-900 text-white flex flex-col transition-all duration-300 z-20">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="font-black text-xl tracking-tight flex items-center gap-2">
                        {devMode ? <Terminal className="text-green-500 animate-pulse"/> : <Shield className="text-blue-500"/>} 
                        Admin OS
                    </h2>
                    <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 font-mono uppercase">
                        v24.0 | {devMode ? <span className="text-green-400 font-bold">ROOT_ACCESS</span> : "Super User"}
                    </p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveView('overview')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeView === 'overview' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/20' : 'hover:bg-white/5 text-slate-400'}`}>
                        <LayoutDashboard size={18}/> Overview
                    </button>
                    <button onClick={() => setActiveView('inbox')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeView === 'inbox' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/20' : 'hover:bg-white/5 text-slate-400'}`}>
                        <div className="relative"><Inbox size={18}/> {tickets.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>}</div> Inbox
                    </button>
                    <button onClick={() => setActiveView('users')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeView === 'users' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/20' : 'hover:bg-white/5 text-slate-400'}`}>
                        <Users size={18}/> Users
                    </button>
                    
                    <div className="mt-8 pt-4 border-t border-slate-800">
                        <div className="flex items-center justify-between px-3 cursor-pointer group" onClick={() => setDevMode(!devMode)}>
                            <span className={`text-xs font-bold uppercase flex items-center gap-2 transition ${devMode ? 'text-green-400' : 'text-slate-400 group-hover:text-white'}`}>
                                <Code size={12}/> Dev Mode
                            </span>
                            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-300 ${devMode ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-700'}`}>
                                <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 ${devMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                        {devMode && (
                            <button onClick={() => setActiveView('console')} className={`w-full flex items-center gap-3 p-3 mt-3 rounded-xl transition animate-in slide-in-from-left ${activeView === 'console' ? 'bg-green-900/20 text-green-400 border border-green-900/50' : 'hover:bg-green-900/10 text-green-600'}`}>
                                <Terminal size={18}/> Root Console
                            </button>
                        )}
                    </div>
                </nav>
            </div>

            {/* === MAIN CONTENT === */}
            <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className={`${devMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b p-4 flex justify-between items-center shadow-sm z-10 transition-colors duration-300`}>
                    <h3 className={`font-bold capitalize flex items-center gap-2 ${devMode ? 'text-green-400 font-mono' : 'text-slate-800'}`}>
                        {activeView} {devMode && <span className="text-[9px] bg-green-900 text-green-400 px-2 rounded-full border border-green-700">DEV_ENV</span>}
                    </h3>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[1,2,3].map(i=><div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">A{i}</div>)}
                        </div>
                        <button className="p-2 hover:bg-slate-100 rounded-full"><Filter size={18} className="text-slate-400"/></button>
                    </div>
                </header>

                {/* --- 1. OVERVIEW VIEW --- */}
                {activeView === 'overview' && (
                    <div className="p-6 overflow-y-auto h-full">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <StatCard title="Total Users" value="14,250" trend="+12%" icon={Users} color="bg-blue-100 text-blue-600" />
                            <StatCard title="Active Pharmacies" value="850" trend="+5 New" icon={Activity} color="bg-green-100 text-green-600" />
                            <StatCard title="B2B Volume (MAD)" value="1.2M" trend="+8%" icon={Database} color="bg-purple-100 text-purple-600" />
                            <StatCard title="AI Queries" value="3,452" trend="Gemini Pro" icon={Sparkles} color="bg-yellow-100 text-yellow-600" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-96">
                            <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-800">Live Activity Feed</h3>
                                    <span className="text-xs flex items-center gap-1 text-green-600"><span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Real-time</span>
                                </div>
                                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                                    {[
                                        { text: "New pharmacy 'Pharma Atlas' registered in Marrakech.", time: "2 min ago", icon: CheckCircle, color: "text-green-500" },
                                        { text: "Ticket #T-101 (Urgent) resolved by AI Agent.", time: "15 min ago", icon: Sparkles, color: "text-purple-500" },
                                        { text: "Spike in searches for 'Doliprane 1000mg'.", time: "1 hour ago", icon: Activity, color: "text-blue-500" },
                                        { text: "System backup completed successfully.", time: "3 hours ago", icon: Database, color: "text-slate-400" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm">
                                            <div className={`mt-0.5 ${item.color}`}><item.icon size={16} /></div>
                                            <div>
                                                <p className="text-slate-700 font-medium">{item.text}</p>
                                                <p className="text-xs text-slate-400">{item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                                <h3 className="font-bold text-slate-800 mb-4">User Growth</h3>
                                <div className="flex-1 flex items-end justify-between gap-2 px-2">
                                    {[40, 65, 45, 90, 75, 100, 85].map((h, i) => (
                                        <div key={i} className="w-full bg-slate-100 rounded-t-md relative group overflow-hidden" style={{ height: '80%' }}>
                                            <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-md transition-all duration-1000 group-hover:bg-blue-600" style={{ height: `${h}%` }}></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 mt-2"><span>Mon</span><span>Sun</span></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- 2. USERS VIEW --- */}
               {/* --- 2. USERS VIEW (INTERACTIVE & WOW EFFECT) --- */}
                {activeView === 'users' && (
                    <div className="p-6 h-full flex flex-col">
                        {/* Header Modernisé */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 animate-in slide-in-from-top duration-500">
                            <div className="relative w-full md:w-96 group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-50 blur transition duration-500"></div>
                                <div className="relative bg-white rounded-xl flex items-center">
                                    <Search className="absolute left-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input 
                                        className="w-full pl-10 pr-4 py-3 bg-transparent border border-slate-200 rounded-xl text-sm outline-none focus:ring-0 placeholder:text-slate-400 font-medium relative z-10" 
                                        value={userSearch} 
                                        onChange={e => setUserSearch(e.target.value)} 
                                        placeholder="Search network..."
                                    />
                                </div>
                            </div>
                            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 active:scale-95">
                                <UserPlus size={18} /> <span>New Member</span>
                            </button>
                        </div>

                        {/* Interactive Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 overflow-y-auto pr-2">
                            {filteredUsers.map((u, index) => (
                                <div 
                                    key={u.id} 
                                    className="group relative bg-white rounded-3xl p-1 border border-slate-100 hover:border-transparent transition-all duration-300 hover:-translate-y-2"
                                    style={{ animationDelay: `${index * 100}ms` }} // Stagger animation
                                >
                                    {/* Gradient Border on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition duration-500"></div>
                                    
                                    {/* Card Content */}
                                    <div className="relative bg-white rounded-[22px] p-6 h-full flex flex-col justify-between overflow-hidden">
                                        
                                        {/* Background Pattern Decoration */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 group-hover:bg-blue-50 duration-500"></div>

                                        <div className="relative z-10">
                                            {/* Header: Avatar & Status */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-md transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${
                                                    u.role === 'Pharmacist' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 
                                                    u.role === 'Importer' ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 
                                                    u.role === 'Admin' ? 'bg-slate-800' :
                                                    'bg-gradient-to-br from-blue-400 to-blue-600'
                                                }`}>
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1.5 ${
                                                    u.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                    'bg-slate-50 text-slate-500 border-slate-200'
                                                }`}>
                                                    {u.status === 'Active' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>}
                                                    {u.status}
                                                </div>
                                            </div>

                                            {/* User Info */}
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{u.name}</h4>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{u.role}</p>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <MapPin size={14} className="text-slate-300 group-hover:text-blue-400 transition-colors"/> 
                                                        {u.location}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Calendar size={14} className="text-slate-300 group-hover:text-purple-400 transition-colors"/> 
                                                        Joined: {u.joinDate}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Actions (Slide Up on Hover) */}
                                        <div className="mt-6 pt-4 border-t border-slate-50 flex gap-2 relative z-10">
                                            <button className="flex-1 py-2 rounded-lg bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center justify-center gap-2">
                                                Profile
                                            </button>
                                            <button className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-blue-500/30">
                                                <MessageCircle size={14}/> Chat
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* --- 3. INBOX VIEW --- */}
                {activeView === 'inbox' && (
                    <div className="flex h-full">
                        <div className={`${selectedTicket ? 'hidden md:block w-1/3' : 'w-full'} bg-white border-r border-slate-200 overflow-y-auto`}>
                            {tickets.map(t => (
                                <div key={t.id} onClick={() => setSelectedTicket(t)} className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition ${selectedTicket?.id === t.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${getPriorityColor(t.priority)}`}>{t.priority}</span>
                                        <span className="text-[10px] text-slate-400">{new Date(t.date).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="font-bold text-sm text-slate-800 truncate">{t.from}</h4>
                                    <p className="text-xs font-medium text-slate-600 truncate">{t.subject}</p>
                                </div>
                            ))}
                        </div>
                        {selectedTicket ? (
                            <div className="flex-1 bg-slate-50 flex flex-col h-full animate-in slide-in-from-right duration-200">
                                <div className="p-6 bg-white border-b flex justify-between items-center shadow-sm z-10">
                                    <div><h2 className="text-xl font-bold text-slate-900">{selectedTicket.subject}</h2><p className="text-sm text-slate-500">From: <span className="font-bold">{selectedTicket.from}</span></p></div>
                                    <button className="md:hidden" onClick={()=>setSelectedTicket(null)}><X size={18}/></button>
                                </div>
                                <div className="flex-1 p-8 overflow-y-auto">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedTicket.message}</p></div>
                                </div>
                                <div className="p-4 bg-white border-t">
                                    <div className="flex justify-end mb-2">
                                        <button onClick={generateAIReply} disabled={isGenerating} className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-full transition font-bold shadow-sm ${isGenerating ? 'bg-purple-100 text-purple-400' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105'}`}>
                                            <Sparkles size={12}/> {isGenerating ? "Gemini Thinking..." : "Auto-Draft with Gemini"}
                                        </button>
                                    </div>
                                    <textarea className="w-full border p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-3 bg-slate-50" rows="4" placeholder="Type your reply..." value={replyText} onChange={e=>setReplyText(e.target.value)}></textarea>
                                    <div className="flex justify-end"><button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold" onClick={()=>alert("Sent!")}>Send Reply</button></div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 hidden md:flex bg-slate-50/50">
                                <Inbox size={64} className="mb-4 opacity-20"/><p>Select a ticket to view details</p>
                            </div>
                        )}
                    </div>
                )}

                {/* --- 4. CONSOLE VIEW --- */}
                {activeView === 'console' && (
                    devMode ? (
                        <div className="flex-1 bg-black text-green-400 p-6 font-mono overflow-hidden flex flex-col relative">
                            <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/dummy/giphy.gif')] opacity-5 pointer-events-none"></div>
                            <div className="flex justify-between items-end mb-4 border-b border-green-900 pb-2 z-10">
                                <div><h2 className="text-xl font-bold flex items-center gap-2"><Terminal/> FinDawa_Root_Console v1.0</h2><p className="text-xs opacity-70">Access Level: God Mode</p></div>
                                <div className="flex gap-2"><button className="px-3 py-1 border border-green-900 rounded hover:bg-green-900/30 text-xs" onClick={()=>setLogs([])}>CLEAR</button><button className="px-3 py-1 border border-green-900 rounded hover:bg-green-900/30 text-xs" onClick={()=>setLogs(p=>[...p,"[SYSTEM] Manual refresh trigger..."])}><RefreshCw size={12}/></button></div>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-1 mb-4 p-4 bg-gray-900/50 rounded-lg border border-green-900/50 shadow-inner z-10">
                                {logs.map((log, i) => (
                                    <div key={i} className="text-sm opacity-90 hover:opacity-100 hover:bg-green-900/20 px-1 border-l-2 border-transparent hover:border-green-500 transition-all cursor-default"><span className="opacity-50 mr-2 text-[10px]">{i}</span>{log}</div>
                                ))}
                                <div className="animate-pulse text-green-500">_</div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                            <Lock size={64} className="mb-4 text-red-400 animate-pulse"/><h3 className="text-lg font-bold text-slate-700">Access Denied</h3><p className="text-sm">Please enable <span className="font-mono bg-slate-200 px-1 rounded text-slate-600">Developer Mode</span> to access the Root Console.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

// ... [Existing PharmacistDashboard Updated] ...

const PharmacistDashboard = ({ onB2BOrderPlaced }) => {
    const [tab, setTab] = useState('stock');
    const [showStockForm, setShowStockForm] = useState(false);
    const [showSaleModal, setShowSaleModal] = useState(false); // NEW
    const [saleQuery, setSaleQuery] = useState(""); // NEW
    const [foundProduct, setFoundProduct] = useState(null); // NEW
    const [patientOrders, setPatientOrders] = useState([]);
    const [salesTotal, setSalesTotal] = useState(4250); // Simulated Wallet
    
    // --- REAL STOCK STATE LINKED TO LOCAL DB ---
    const [stockList, setStockList] = useState(db.get(DB_KEYS.STOCK, SEED_STOCK));
    const [newItem, setNewItem] = useState({ name: '', rayon: '', exp: '', qty: '' });

    // Sync stock with local DB whenever it changes
    useEffect(() => {
        db.set(DB_KEYS.STOCK, stockList);
    }, [stockList]);

    // Load Patient Orders
    useEffect(() => {
        const loadPatientOrders = () => {
            const stored = db.get(DB_KEYS.PATIENT_ORDERS, []);
            // Sort: Urgent first, then Date
            const sorted = [...stored].sort((a, b) => {
                 if (a.urgent && !b.urgent) return -1;
                 if (!a.urgent && b.urgent) return 1;
                 return new Date(a.date) - new Date(b.date); // FIFO
            });
            setPatientOrders(sorted);
        };
        loadPatientOrders();
        window.addEventListener('storage', loadPatientOrders);
        return () => window.removeEventListener('storage', loadPatientOrders);
    }, [tab]);

    const handleSearchForSale = () => {
        const product = stockList.find(s => s.name.toLowerCase().includes(saleQuery.toLowerCase()));
        if (product) setFoundProduct(product);
        else alert("Product not found!");
    };

    const confirmSale = () => {
        if (!foundProduct) return;
        setStockList(prev => prev.map(item => {
             if(item.id === foundProduct.id && item.qty > 0) {
                 const newQty = item.qty - 1;
                 const newStatus = newQty === 0 ? "Out of Stock" : newQty < 10 ? "Low" : "Available";
                 // Update Date Out to Today
                 return { ...item, qty: newQty, status: newStatus, dateOut: new Date().toLocaleDateString() };
             }
             return item;
        }));
        setSalesTotal(prev => prev + (foundProduct.price || 0));
        setShowSaleModal(false);
        setFoundProduct(null);
        setSaleQuery("");
        alert("Sale validated! Stock updated. +Revenue");
    };

    const handleAddStock = () => {
        if(newItem.name && newItem.qty) {
            setStockList([...stockList, { 
                id: Date.now(), 
                name: newItem.name, 
                rayon: newItem.rayon || 'Z1', 
                exp: newItem.exp || '12/2025', 
                qty: parseInt(newItem.qty), 
                status: 'Available',
                dateIn: new Date().toLocaleDateString(), // NEW
                dateOut: '-',
                price: 0 // Default
            }]);
            setShowStockForm(false);
            setNewItem({ name: '', rayon: '', exp: '', qty: '' });
        }
    };
    
    // Status Workflow for Orders
    const updateOrderStatus = (orderId, newStatus) => {
        const updatedOrders = patientOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
        setPatientOrders(updatedOrders);
        db.set(DB_KEYS.PATIENT_ORDERS, updatedOrders);
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 rounded-2xl shadow-lg flex justify-between items-end">
                <div><h2 className="text-3xl font-bold">Al Amal Pharmacy</h2><p className="opacity-90">Dr. Youssef El Mahmi</p></div>
                <div className="text-right">
                    <p className="text-xs opacity-70">Today's Sales (Wallet)</p>
                    <p className="text-2xl font-bold">{salesTotal} DH</p>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {['stock', 'patients', 'b2b', 'network', 'tickets'].map(t => (
                    <button key={t} onClick={()=>setTab(t)} className={`px-5 py-2 rounded-full font-bold text-sm capitalize transition ${tab===t?'bg-blue-600 text-white shadow':'bg-white text-slate-500 hover:bg-slate-100'}`}>
                        {t === 'patients' ? 'Patient Orders' : t}
                    </button>
                ))}
            </div>

            {tab === 'stock' && (
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                         <div className="flex justify-between items-center mb-4">
                             <h3 className="font-bold text-slate-700 flex items-center gap-2"><Package className="text-blue-500"/> Advanced Stock</h3>
                             <div className="flex gap-2">
                                <Button onClick={()=>setShowSaleModal(true)} className="py-1 px-3 text-xs h-8 bg-slate-800 text-white"><QrCodeIcon size={14} className="mr-1"/> Scan Sale</Button>
                                <Button onClick={()=>setShowStockForm(true)} className="py-1 px-3 text-xs h-8"><Plus size={14}/> Stock Entry</Button>
                             </div>
                         </div>
                         <div className="overflow-x-auto">
                             <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Product</th><th className="p-3">Shelf</th><th className="p-3">Exp</th><th className="p-3">Qty</th><th className="p-3">In</th><th className="p-3">Out</th><th className="p-3">Status</th></tr></thead>
                                <tbody className="divide-y">
                                    {stockList.map(s => (
                                        <tr key={s.id} className="hover:bg-slate-50">
                                            <td className="p-3 font-bold">{s.name}</td>
                                            <td className="p-3 font-mono text-slate-500">{s.rayon}</td>
                                            <td className="p-3">{s.exp}</td>
                                            <td className="p-3 font-bold">{s.qty}</td>
                                            <td className="p-3 text-xs text-slate-500">{s.dateIn || '-'}</td>
                                            <td className="p-3 text-xs text-slate-500">{s.dateOut || '-'}</td>
                                            <td className="p-3"><Badge status={s.status}/></td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                         </div>

                         {/* Sale Modal */}
                         {showSaleModal && (
                             <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                                 <div className="bg-white p-6 rounded-2xl w-full max-w-md animate-in zoom-in">
                                     <h3 className="font-bold text-lg mb-4">Scan / Quick Sale</h3>
                                     {!foundProduct ? (
                                         <div className="flex gap-2">
                                             <input className="flex-1 p-2 border rounded outline-none" placeholder="Product Name or Code" value={saleQuery} onChange={e=>setSaleQuery(e.target.value)} />
                                             <Button onClick={handleSearchForSale}>Search</Button>
                                         </div>
                                     ) : (
                                         <div className="space-y-4">
                                             <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                                 <p className="font-bold text-lg text-green-900">{foundProduct.name}</p>
                                                 <div className="flex justify-between mt-2 text-sm">
                                                     <span>Current Stock: <span className="font-bold">{foundProduct.qty}</span></span>
                                                     <span>Price: <span className="font-bold">{foundProduct.price || 0} DH</span></span>
                                                 </div>
                                             </div>
                                             <Button className="w-full bg-slate-900 text-white" onClick={confirmSale}>Confirm Sale (-1)</Button>
                                             <button onClick={()=>setFoundProduct(null)} className="w-full text-center text-xs text-slate-400 mt-2">Cancel</button>
                                         </div>
                                     )}
                                     {!foundProduct && <button onClick={()=>setShowSaleModal(false)} className="absolute top-4 right-4"><X/></button>}
                                 </div>
                             </div>
                         )}

                         {/* Stock Form Modal (Unchanged logic, just ensure dates included) */}
                         {showStockForm && (
                             <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                                 <div className="bg-white p-6 rounded-2xl w-full max-w-md animate-in zoom-in">
                                     <h3 className="font-bold text-lg mb-4">Quick Stock Add</h3>
                                     <div className="space-y-3">
                                         <div className="flex gap-2"><input className="flex-1 p-2 border rounded" placeholder="Scan Barcode"/><Button className="p-2"><Camera size={16}/></Button></div>
                                         <input className="w-full p-2 border rounded" placeholder="Product Name" value={newItem.name} onChange={e=>setNewItem({...newItem, name: e.target.value})}/>
                                         <div className="flex gap-2">
                                             <input type="date" className="flex-1 p-2 border rounded" value={newItem.exp} onChange={e=>setNewItem({...newItem, exp: e.target.value})}/>
                                             <input className="w-20 p-2 border rounded" placeholder="Qty" type="number" value={newItem.qty} onChange={e=>setNewItem({...newItem, qty: e.target.value})}/>
                                         </div>
                                         <input className="w-full p-2 border rounded" placeholder="Shelf (ex: A1)" value={newItem.rayon} onChange={e=>setNewItem({...newItem, rayon: e.target.value})}/>
                                         <div className="flex justify-end gap-2 mt-4"><Button variant="secondary" onClick={()=>setShowStockForm(false)}>Cancel</Button><Button onClick={handleAddStock}>Confirm</Button></div>
                                     </div>
                                 </div>
                             </div>
                         )}
                    </Card>
                    <div className="space-y-6">
                        <Card className="bg-purple-50 border-purple-200">
                            <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2"><Zap size={18}/> B2B Intelligence Alerts</h3>
                            <div className="bg-white p-3 rounded-xl shadow-sm mb-2 border-l-4 border-green-500">
                                <p className="text-xs text-slate-500 mb-1">Morocco Logistics</p>
                                <p className="font-bold text-sm">Insulin: Back in Stock!</p>
                                <p className="text-[10px] text-green-600 mt-1">Auto-Reservation: 50 units (Based on your sales)</p>
                                <Button className="w-full mt-2 text-xs bg-purple-600 text-white">Confirm Purchase</Button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {tab === 'patients' && (
                <Card>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><ShoppingBag className="text-blue-600"/> Patient Orders (B2C)</h3>
                            <p className="text-xs text-slate-500">Sort: Urgency (Priority) &rarr; FIFO (Date)</p>
                        </div>
                        <Badge status="Live" />
                    </div>
                    {patientOrders.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <ShoppingBag className="mx-auto text-slate-300 mb-2" size={48}/>
                            <p className="text-slate-500">No patient orders pending.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {patientOrders.map((order, idx) => (
                                <div key={idx} className={`bg-white border ${order.urgent ? 'border-red-300 shadow-red-100' : 'border-slate-200'} p-4 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in slide-in-from-bottom`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${order.urgent ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'}`}>
                                            {order.patientName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{order.patientName} {order.urgent && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded ml-2">URGENT</span>}</h4>
                                            <p className="text-xs text-slate-500 flex items-center gap-2">
                                                <Clock size={12}/> {new Date(order.date).toLocaleString()} • Status: <span className="font-bold text-blue-600">{order.status || 'Pending'}</span>
                                            </p>
                                            {order.hasPrescription && <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-bold"><FileText size={10}/> Prescription Included</span>}
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 w-full md:w-auto bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <p className="text-xs font-bold text-slate-500 mb-1 uppercase">Contents</p>
                                        <ul className="text-sm space-y-1">
                                            {order.items.map((item, i) => (
                                                <li key={i} className="flex justify-between">
                                                    <span>{item.name}</span>
                                                    <span className="font-bold">{item.price} DH</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between font-bold text-sm">
                                            <span>Total</span>
                                            <span className="text-green-600">{order.total.toFixed(2)} DH</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 w-full md:w-auto">
                                        {(!order.status || order.status === 'Pending') && (
                                            <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700 h-8 text-xs" onClick={()=>updateOrderStatus(order.id, 'Ready (Encoded)')}>Prepare</Button>
                                        )}
                                        {order.status === 'Ready (Encoded)' && (
                                            <Button className="flex-1 bg-green-600 text-white hover:bg-green-700 h-8 text-xs" onClick={()=>updateOrderStatus(order.id, 'Delivered (Archived)')}>Validate & Archive</Button>
                                        )}
                                        {order.status === 'Delivered (Archived)' && (
                                            <span className="text-xs text-center text-slate-400 font-bold"><CheckCircle size={12} className="inline mr-1"/> Archived</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            )}
            
            {tab === 'b2b' && (
                <B2BMarketplace onOrderPlaced={onB2BOrderPlaced}/>
            )}

            {tab === 'network' && <PharmacyNetworkHub />}

            {tab === 'tickets' && <TicketSystem role="Pharmacist" suggestions={["Out of Stock", "Delivery Error", "Insurance Issue"]} user={{name: "Al Amal Pharmacy"}}/>}
        </div>
    );
};

// ... [ImporterDashboard remains same as before] ...
const ImporterDashboard = () => {
    const [tab, setTab] = useState('dashboard');
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const loadOrders = () => {
            const stored = db.get(DB_KEYS.B2B_ORDERS, []);
            if(stored.length > 0) {
                setOrders(stored);
            } else {
                setOrders([
                    { id: 'CMD-992', from: 'Pharma Al Amal (Demo)', total: 12500, status: 'Pending' },
                    { id: 'CMD-993', from: 'Pharma Centre (Demo)', total: 45000, status: 'Validated' }
                ]);
            }
        };
        loadOrders();
        window.addEventListener('storage', loadOrders);
        return () => window.removeEventListener('storage', loadOrders);
    }, []);
    
    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Ultra Premium Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white p-8 rounded-3xl shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Globe size={200}/></div>
                <div className="relative z-10 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-purple-500/20 border border-purple-400/30 px-3 py-1 rounded-full text-xs font-bold text-purple-200 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> SYSTEM ONLINE
                            </span>
                            <span className="text-slate-300 text-xs font-mono">ID: IMP-8821-X</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight mb-1">Morocco Logistics Corp</h1>
                        <p className="text-purple-200 text-sm">Casablanca Hub • Import-Export License A+</p>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Turnover (Month)</p>
                        <p className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">4.5M <span className="text-lg text-slate-400">DH</span></p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {[
                    { id: 'dashboard', icon: LayoutDashboard, label: 'Control' },
                    { id: 'orders', icon: ShoppingCart, label: 'Orders' },
                    { id: 'logistics', icon: Truck, label: '3D Logistics' },
                    { id: 'intelligence', icon: Brain, label: 'Market AI' },
                    { id: 'network', icon: Users, label: 'Network' },
                    { id: 'finance', icon: Wallet, label: 'Finance' }
                ].map(t => (
                    <button 
                        key={t.id} 
                        onClick={()=>setTab(t.id)} 
                        className={`
                            px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all
                            ${tab===t.id 
                                ? 'bg-purple-600 text-white shadow-lg' 
                                : 'bg-white text-slate-500 hover:bg-slate-50'}
                        `}
                    >
                        <t.icon size={16}/>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {tab === 'dashboard' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card><h3 className="text-xs text-slate-400 uppercase">Orders</h3><p className="text-3xl font-bold text-indigo-600">{orders.length + 1200}</p></Card>
                        <Card><h3 className="text-xs text-slate-400 uppercase">In Transit</h3><p className="text-3xl font-bold text-green-600">45</p></Card>
                        <Card><h3 className="text-xs text-slate-400 uppercase">Monthly Revenue</h3><p className="text-3xl font-bold text-purple-600">4.5M</p></Card>
                        <Card><h3 className="text-xs text-slate-400 uppercase">Alerts</h3><p className="text-3xl font-bold text-red-500">2</p></Card>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <MarketIntelligence />
                        <TicketSystem role="Importer" suggestions={["Customs", "Transport", "Billing"]} user={{name: "Morocco Logistics"}}/>
                    </div>
                </div>
            )}

            {tab === 'orders' && (
                <Card>
                    <h3 className="font-bold text-slate-800 mb-4">Recent Orders (Live Data)</h3>
                     <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">ID</th><th className="p-3">Client</th><th className="p-3">Amount</th><th className="p-3">Status</th></tr></thead>
                        <tbody className="divide-y">
                            {orders.map((o, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition">
                                    <td className="p-3 font-mono text-xs">{o.id}</td>
                                    <td className="p-3 font-bold">{o.from}</td>
                                    <td className="p-3 font-bold text-purple-700">{typeof o.total === 'number' ? o.total.toFixed(2) : o.total} DH</td>
                                    <td className="p-3"><Badge status={o.status || 'Pending'}/></td>
                                </tr>
                            ))}
                        </tbody>
                     </table>
                </Card>
            )}

            {tab === 'logistics' && <LogisticsMap />}
            {tab === 'intelligence' && <MarketIntelligence />}
            {tab === 'network' && <ImporterNetworkHub />}
            {tab === 'finance' && <FinanceDashboard />}
        </div>
    );
};


// ** NEW COMPONENT: DOCTOR DASHBOARD (WITH TELEMED) **
const DoctorDashboard = ({ user }) => {
    const [view, setView] = useState('create');
    const [patientName, setPatientName] = useState("");
    const [meds, setMeds] = useState([]);
    const [currentMed, setCurrentMed] = useState("");
    const [note, setNote] = useState("");
    const [showCall, setShowCall] = useState(false); // NEW CALL STATE

    const addMed = () => {
        if(currentMed) {
            setMeds([...meds, currentMed]);
            setCurrentMed("");
        }
    };

    const sendPrescription = () => {
        if(!patientName || meds.length === 0) return alert("Fill in all fields!");
        
        const newPrescription = {
            id: `ORD-${Date.now().toString().slice(-4)}`,
            doctor: user?.name || "Dr. Tazi",
            patient: patientName,
            meds: meds,
            note: note,
            date: new Date().toISOString(),
            status: 'Signed'
        };

        const existing = db.get(DB_KEYS.PRESCRIPTIONS, []);
        db.set(DB_KEYS.PRESCRIPTIONS, [...existing, newPrescription]);
        
        alert("Prescription sent successfully to the patient!");
        setMeds([]);
        setPatientName("");
        setNote("");
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            {showCall && <TelemedicineModal onClose={()=>setShowCall(false)} role="doctor" targetName="Patient: Ahmed Benali" />}

            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-8 rounded-3xl shadow-xl flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3"><StethoscopeIcon size={32}/> Doctor Area</h2>
                    <p className="opacity-90">Dr. {user?.name || "Youssef"}</p>
                </div>
                <div className="bg-white/20 p-4 rounded-xl text-center backdrop-blur-sm">
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs uppercase">Patients Today</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><FilePlus className="text-cyan-600"/> New Digital Prescription</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-1 block">Patient</label>
                            <div className="flex gap-2">
                                <input 
                                    className="flex-1 p-3 bg-slate-50 border rounded-xl outline-none" 
                                    placeholder="Patient name (ex: Ahmed...)"
                                    value={patientName}
                                    onChange={e=>setPatientName(e.target.value)}
                                />
                                <Button variant="secondary"><UserPlus size={18}/></Button>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-1 block">Medicines</label>
                            <div className="flex gap-2 mb-2">
                                <input 
                                    className="flex-1 p-3 bg-slate-50 border rounded-xl outline-none" 
                                    placeholder="Medicine name + Dosage"
                                    value={currentMed}
                                    onChange={e=>setCurrentMed(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && addMed()}
                                />
                                <Button onClick={addMed}>Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {meds.map((m, i) => (
                                    <span key={i} className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                        {m} <button onClick={()=>setMeds(meds.filter((_,idx)=>idx!==i))}><X size={14}/></button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-1 block">Note / Dosage</label>
                            <textarea 
                                className="w-full p-3 bg-slate-50 border rounded-xl outline-none h-24" 
                                placeholder="Instructions for the patient..."
                                value={note}
                                onChange={e=>setNote(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="pt-4 border-t">
                            <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-4 text-lg" onClick={sendPrescription}>
                                <Send size={20} className="mr-2"/> Sign & Send
                            </Button>
                            <p className="text-center text-xs text-slate-400 mt-2 flex items-center justify-center gap-1"><Lock size={10}/> Secure e-Sign Signature</p>
                        </div>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <h3 className="font-bold mb-4">Agenda & Tele-Med</h3>
                        <div className="space-y-3">
                            {['09:00 - Ahmed Benali', '10:30 - Fatima Zahra', '14:00 - Yassine Tazi'].map((rdv, i) => (
                                <div key={i} className="p-3 bg-slate-50 border-l-4 border-cyan-500 rounded text-sm font-medium flex justify-between items-center group">
                                    <span>{rdv}</span>
                                    <button onClick={()=>setShowCall(true)} className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 transition" title="Start Video Call">
                                        <Video size={16}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <TicketSystem role="Doctor" suggestions={["Network Issue", "Patient Error"]} />
                </div>
            </div>
        </div>
    );
};

const PatientDashboard = ({ onOrderPlaced, user }) => {
    const [activeTab, setActiveTab] = useState('map');
    const [cart, setCart] = useState([]);
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeRoute, setActiveRoute] = useState(false);
    const [insurance, setInsurance] = useState(false);
    const [scannedDocs, setScannedDocs] = useState([]);
    const [digitalPrescriptions, setDigitalPrescriptions] = useState([]);
    const [showCall, setShowCall] = useState(false); // NEW CALL STATE

    // Load prescriptions
    useEffect(() => {
        const loadP = () => {
            const all = db.get(DB_KEYS.PRESCRIPTIONS, []);
            // Filter roughly by name match for demo
            setDigitalPrescriptions(all); 
        };
        loadP();
        window.addEventListener('storage', loadP);
        return () => window.removeEventListener('storage', loadP);
    }, []);

    const checkInteractions = (items) => items.some(i => i.name === 'Sirop Toux Sucré');

    const handleVoiceSearch = () => {
        setSearchQuery("Dwa dyal rass (Doliprane)");
        setActiveRoute(true);
    };

    const simulateScan = () => {
        setIsScanning(true);
        setTimeout(() => { 
            setIsScanning(false); 
            const newDoc = { id: Date.now(), name: 'Prescription - Dr. Tazi', price: 15, qty: 1, date: 'Today' };
            setScanResult([newDoc]); 
            setScannedDocs([...scannedDocs, newDoc]);
        }, 2000);
    };

    const handlePatientCheckout = () => {
        if (cart.length === 0) return;
        const total = cart.reduce((a,b)=>a+b.price,0) + (insurance ? 2 : 0);
        
        onOrderPlaced({
            items: cart,
            total: total,
            pharmacy: "Pharma Al Amal", // In real app, this comes from selected pharmacy
            hasPrescription: !!scanResult,
            patientName: user?.name || "Anonymous Patient",
            urgent: false // Default
        });

        setCart([]);
        setScanResult(null);
        alert("Order sent to the pharmacy!");
    };

    return (
        <div className="space-y-6 animate-in fade-in pb-20">
            {showCall && <TelemedicineModal onClose={()=>setShowCall(false)} role="patient" targetName="Dr. Youssef" />}

            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 rounded-3xl text-white shadow-xl flex justify-between items-center">
                <div><h2 className="text-2xl font-bold">Hello {user?.name || "Guest"},</h2><p className="opacity-90 text-sm">Health Tracking & Orders</p></div>
                <div className="flex gap-3">
                    {/* Telemed Button Trigger */}
                    <button onClick={()=>setShowCall(true)} className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition flex items-center justify-center border border-white/30">
                        <Video size={20}/>
                    </button>
                    <div className="relative cursor-pointer" onClick={()=>setActiveTab('cart')}>
                        <ShoppingBag/><span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>
                    </div>
                    <Button variant="sos" className="h-10 px-4 text-xs rounded-full">SOS</Button>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {['map', 'prescriptions', 'health', 'scan', 'cart', 'loyalty'].map(t => (
                    <button key={t} onClick={()=>setActiveTab(t)} className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap capitalize transition ${activeTab===t?'bg-slate-900 text-white shadow':'bg-white text-slate-500'}`}>
                        {t === 'map' ? 'Search' : t === 'prescriptions' ? 'My Prescriptions' : t === 'health' ? 'Booklet' : t === 'scan' ? 'AI Scanner' : t === 'cart' ? 'Cart' : 'Loyalty'}
                    </button>
                ))}
            </div>

            {activeTab === 'map' && (
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <div className="flex gap-2 mb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                                <input 
                                    className="w-full pl-10 p-3 border rounded-xl outline-none" 
                                    placeholder="Search for a medicine..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <VoiceSearchButton onSearch={(txt) => alert(`Voice Search: ${txt}`)} />
                        </div>
                        <SmartMap activeRoute={activeRoute || searchQuery.length > 0} targetPharmacy="Pharma Al Amal"/>
                    </div>
                    <div className="space-y-4">
                        {searchQuery && (
                            <Card className="bg-green-50 border-green-200 animate-in slide-in-from-right">
                                <h3 className="font-bold text-green-800 flex gap-2"><Sparkles size={16}/> AI Result</h3>
                                <p className="text-sm mt-2"><strong>Doliprane 1000mg</strong> available at <strong>Al Amal Pharmacy</strong> (0.5km).</p>
                                <Button className="w-full mt-3 text-xs" onClick={() => { setCart([...cart, {name: 'Doliprane 1000mg', pharmacy: 'Pharma Al Amal', price: 15}]); setActiveTab('cart'); }}>Add to Cart</Button>
                            </Card>
                        )}
                        <Card><h3 className="font-bold mb-2">On-Duty Pharmacies</h3><div className="p-3 bg-slate-50 rounded border flex justify-between items-center text-sm"><div><span className="font-bold block">Pharma Al Quds</span><span className="text-xs text-slate-500">Open until 08:00</span></div><Badge status="Open"/></div></Card>
                        
                        {/* Telemedicine Promo Card */}
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-4 text-white shadow-lg cursor-pointer transform hover:scale-105 transition" onClick={()=>setShowCall(true)}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold flex items-center gap-2"><Video size={18}/> Tele-Dawa</h3>
                                    <p className="text-xs opacity-90">Consult a doctor via video</p>
                                </div>
                                <div className="bg-white/20 p-2 rounded-full animate-pulse"><Phone size={20}/></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* NEW PRESCRIPTIONS TAB */}
            {activeTab === 'prescriptions' && (
                <Card>
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-2"><FileText className="text-cyan-600"/> Digital Prescriptions (Received)</h3>
                    {digitalPrescriptions.length === 0 ? (
                        <p className="text-center text-slate-400 py-8">No prescriptions received.</p>
                    ) : (
                        <div className="space-y-4">
                            {digitalPrescriptions.map((p, i) => (
                                <div key={i} className="bg-cyan-50 border border-cyan-100 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge status="Signed"/>
                                            <span className="text-xs text-slate-500">{new Date(p.date).toLocaleString()}</span>
                                        </div>
                                        <h4 className="font-bold text-lg">{p.doctor}</h4>
                                        <p className="text-sm text-slate-600 mb-2">Note: {p.note}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {p.meds.map(m=><span key={m} className="text-xs bg-white px-2 py-1 rounded border border-cyan-200">{m}</span>)}
                                        </div>
                                    </div>
                                    <Button className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-700" onClick={()=>{
                                        const newItems = p.meds.map(m => ({ name: m, pharmacy: 'Pharma Al Amal', price: 50 })); // Mock price
                                        setCart([...cart, ...newItems]);
                                        setActiveTab('cart');
                                    }}>Order (Click & Collect)</Button>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            )}

            {activeTab === 'health' && (
                <div className="grid md:grid-cols-2 gap-6">
                    <Card><h3 className="font-bold mb-4 text-slate-700 flex gap-2"><FileHeart/> Medical Record</h3><p className="text-sm text-slate-500 italic">No major history recorded.</p></Card>
                    <DigitalWallet balance="1,250" type="Se7ti" />
                    <HealthBooklet scannedDocs={scannedDocs} onUpload={(file) => setScannedDocs([...scannedDocs, file])} />
                </div>
            )}

            {activeTab === 'scan' && (
                <div className="bg-slate-100 h-80 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300 relative overflow-hidden">
                    <div className="bg-white p-6 rounded-full shadow-lg mb-4 z-10"><Camera size={48} className="text-green-600"/></div>
                    <h3 className="font-bold text-lg z-10">{isScanning ? 'AI Analysis...' : 'Scan Prescription'}</h3>
                    <p className="text-slate-500 text-sm mb-4 z-10 text-center px-6">The AI will analyze the prescription to check availability.</p>
                    {!isScanning && !scanResult && <Button onClick={simulateScan}>Take Photo (Simulation)</Button>}
                    {scanResult && <Button onClick={()=>{setCart([...cart, {name: 'Prescription Dr. Tazi', pharmacy: 'Pharma Al Amal', price: 150}]); setActiveTab('cart')}}>Add to Cart (150 DH)</Button>}
                </div>
            )}

             {activeTab === 'cart' && (
                <Card>
                    <h3 className="font-bold mb-4">Cart (Click & Collect)</h3>
                    {cart.length === 0 ? <p className="text-center text-slate-400 py-8">Your cart is empty.</p> : (
                        <div>
                            {checkInteractions(cart) && (
                                <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-4 flex items-center gap-2 text-red-700 text-sm">
                                    <AlertTriangle size={16}/> Warning: Interaction detected with your medical record.
                                </div>
                            )}
                            <div className="space-y-3">
                                {cart.map((i,k)=>(
                                    <div key={k} className="flex justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div>
                                            <span className="font-bold block text-sm">{i.name}</span>
                                            <span className="text-xs text-slate-500">{i.pharmacy}</span>
                                        </div>
                                        <span className="font-bold text-green-700">{i.price} DH</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 rounded-lg cursor-pointer" onClick={() => setInsurance(!insurance)}>
                                <div className={`w-5 h-5 rounded border ${insurance ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'} flex items-center justify-center`}>
                                    {insurance && <CheckCircle size={14} className="text-white"/>}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-blue-900">Delivery Insurance (+2 DH) 🛡️</p>
                                    <p className="text-[10px] text-blue-700">Breakage insurance and delivery delay.</p>
                                </div>
                            </div>

                            <div className="flex justify-between font-bold text-xl mt-6 pt-4 border-t"><span>Total</span><span>{(cart.reduce((a,b)=>a+b.price,0) + (insurance ? 2 : 0)).toFixed(2)} DH</span></div>
                            <Button className="w-full mt-4 bg-green-700" onClick={handlePatientCheckout}>Reserve (Payment on site)</Button>
                            <p className="text-[10px] text-slate-400 text-center mt-2">In accordance with Law 17-04, payment is made at the pharmacy.</p>
                        </div>
                    )}
                </Card>
            )}

            {activeTab === 'loyalty' && (
                 <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-none">
                     <div className="flex justify-between items-start mb-6">
                         <div>
                             <h3 className="text-2xl font-bold">My Loyalty Points</h3>
                             <p className="opacity-90">"Se7ti" Program</p>
                         </div>
                         <Gift size={32} className="opacity-80"/>
                     </div>
                     <div className="text-5xl font-black mb-4">1,250 <span className="text-lg font-medium">Pts</span></div>
                     <Button className="w-full bg-white text-orange-600 hover:bg-orange-50">Convert to Voucher (50 DH)</Button>
                 </Card>
            )}
        </div>
    );
};

// ... [Existing AuthScreen, HeroSlider, PublicToolsSection, MoroccoMapSection, LandingPage remain the same] ...

const HeroSlider = ({ onLogin }) => (
    <div className="relative h-[600px] w-full bg-slate-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl animate-in slide-in-from-bottom duration-1000">
            <div className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur border border-white/20 mb-6 font-bold text-sm">The #1 digital network of the pharmaceutical sector in Morocco 🇲🇦</div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">Your Health, <br/>Our Priority.</h1>
            <p className="text-xl opacity-90 mb-8 font-light">Find a medicine, an on-duty pharmacy, or manage your pharmacy in one click.</p>
            <div className="flex gap-4 justify-center">
                <Button onClick={() => window.location.href='#features'} className="bg-green-600 hover:bg-green-700 border-none shadow-xl text-lg px-8 py-4">Free Services</Button>
                <Button variant="outline" className="text-lg px-8 py-4 border-2 border-white hover:bg-white hover:text-slate-900" onClick={() => onLogin('login')}>Pro Area</Button>
            </div>
        </div>
    </div>
);

const PublicToolsSection = ({ onLogin }) => {
    const [tool, setTool] = useState('patient'); 
    const [search, setSearch] = useState('');
    const [result, setResult] = useState(null);

    const handleSimulate = () => {
        if(!search) return;
        setResult('loading');
        setTimeout(() => {
            if (tool === 'patient') setResult({ name: search, price: '45.00 DH', refund: '31.50 DH' });
            else if (tool === 'pharma') setResult({ score: '94/100', status: 'Hot Zone' });
            else setResult({ trend: '+45%', desc: 'Imminent shortage' });
        }, 1000);
    };

    return (
        <section id="features" className="py-24 bg-white relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <span className="text-green-600 font-bold text-sm uppercase tracking-wide">Free & No Registration</span>
                    <h2 className="text-3xl font-extrabold text-slate-900 mt-2">Test the power of FinDawa</h2>
                </div>
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col md:flex-row h-auto md:h-[400px]">
                    <div className="w-full md:w-1/3 bg-slate-50 p-6 flex flex-col gap-2 border-r border-slate-200">
                        <button onClick={()=>{setTool('patient'); setResult(null)}} className={`p-4 rounded-xl text-left flex gap-3 transition ${tool==='patient'?'bg-white shadow text-green-700 font-bold':'text-slate-500'}`}><Coins size={20}/> Price & Refund</button>
                        <button onClick={()=>{setTool('pharma'); setResult(null)}} className={`p-4 rounded-xl text-left flex gap-3 transition ${tool==='pharma'?'bg-white shadow text-blue-700 font-bold':'text-slate-500'}`}><MapIcon size={20}/> Zone Potential</button>
                        <button onClick={()=>{setTool('importer'); setResult(null)}} className={`p-4 rounded-xl text-left flex gap-3 transition ${tool==='importer'?'bg-white shadow text-purple-700 font-bold':'text-slate-500'}`}><TrendingUp size={20}/> Market Trends</button>
                    </div>
                    <div className="flex-1 p-8 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold mb-4">{tool === 'patient' ? "How much does this cost?" : tool === 'pharma' ? "Analyze your neighborhood" : "Import Trends"}</h3>
                        <div className="flex gap-2 mb-6">
                            <input className="flex-1 p-4 bg-slate-50 border rounded-xl outline-none" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
                            <Button onClick={handleSimulate}>{result === 'loading' ? '...' : 'Check'}</Button>
                        </div>
                        {result && result !== 'loading' && (
                            <div className="bg-slate-50 border rounded-xl p-4 animate-in zoom-in">
                                {tool === 'patient' && <div><p className="font-bold text-lg">{result.name}</p><p className="text-green-600 font-bold text-3xl">{result.price}</p><p className="text-xs text-slate-500 mt-1">CNSS Refund: {result.refund}</p></div>}
                                {tool === 'pharma' && <div><div className="text-4xl font-bold text-blue-600">{result.score}</div><p className="font-bold">{result.status}</p></div>}
                                {tool === 'importer' && <div><div className="text-4xl font-bold text-purple-600">{result.trend}</div><p>{result.desc}</p></div>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

const MoroccoMapSection = ({ lang }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [mapFilters, setMapFilters] = useState({});

    useEffect(() => {
        if (activeFilter === '24/7 Duty') setMapFilters({ status: 'garde' });
        else if (activeFilter === 'Open') setMapFilters({ status: 'open' });
        else if (activeFilter === 'Laboratories') setMapFilters({ type: 'Laboratoire' });
        else setMapFilters({});
    }, [activeFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
    };

    return (
        <section className="py-24 bg-white" id="map">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-extrabold mb-8">Everywhere in Morocco</h2>
                
                <div className="relative w-full h-[600px] bg-slate-100 rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                    
                    <AdvancedMapComponent searchQuery={searchQuery} activeFilters={mapFilters} lang={lang} />

                    <div className="absolute top-6 left-6 z-[1000] w-full max-w-sm pointer-events-none">
                        <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 pointer-events-auto">
                            <form onSubmit={handleSearch} className="flex items-center gap-2 px-2">
                                <Search size={20} className="text-slate-400"/>
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search city or pharmacy..." 
                                    className="flex-1 py-3 outline-none text-sm font-medium text-slate-700"
                                />
                                <button type="submit" className="bg-slate-100 hover:bg-slate-200 p-2 rounded-lg transition">
                                    <ArrowRight size={18} className="text-slate-600"/>
                                </button>
                            </form>
                        </div>
                        <div className="flex gap-2 mt-3 overflow-x-auto pointer-events-auto">
                            {['All', '24/7 Duty', 'Open', 'Laboratories'].map(f => (
                                <button 
                                    key={f} 
                                    onClick={() => setActiveFilter(f)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-full border shadow-sm transition whitespace-nowrap ${activeFilter === f ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-500 hover:text-emerald-600'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const LanguageSelector = ({ lang, setLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇲🇦' }
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition text-slate-600 font-medium"
      >
        <Globe size={20} />
        <span className="uppercase hidden md:inline">{lang}</span>
        <ChevronDown size={16} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white/90 backdrop-blur-md border border-slate-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 z-[60]">
           {languages.map(l => (
             <button
               key={l.code}
               onClick={() => { setLang(l.code); setIsOpen(false); }}
               className={`w-full text-left px-4 py-3 text-sm hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition ${lang === l.code ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600'}`}
             >
               <span>{l.flag}</span>
               {l.label}
             </button>
           ))}
        </div>
      )}
    </div>
  );
};

const LandingPage = ({ onNavigateToLogin, lang, setLang }) => {
    const [showLegal, setShowLegal] = useState(false);
    const [showContact, setShowContact] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            {showLegal && <LegalModal onClose={()=>setShowLegal(false)}/>}
            {showContact && <ContactModal onClose={()=>setShowContact(false)}/>}

            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex items-center justify-between px-6 transition-all">
                <ImageWithFallback src={image_e2d0b789f57092492a3652d0d5838719d9b8f1fb} alt="FinDawa" className="h-20 w-auto" />
                <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                    <a href="#features" className="hover:text-green-600">Services</a>
                    <a href="#map" className="hover:text-green-600">Network</a>
                    <a href="#pricing" className="hover:text-green-600">Offers</a>
                </div>
                <div className="flex items-center gap-3">
                    <LanguageSelector lang={lang} setLang={setLang} />
                    <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block"></div>
                    <Button variant="secondary" className="hidden md:flex py-2 text-sm" onClick={() => onNavigateToLogin('login')}>Login</Button>
                    <Button variant="primary" className="py-2 text-sm" onClick={() => window.location.href='#pricing'}>Register</Button>
                </div>
            </nav>
            <HeroSlider onLogin={onNavigateToLogin}/>
            <PublicToolsSection onLogin={onNavigateToLogin}/>
            <MoroccoMapSection lang={lang}/>
            <section id="pricing" className="py-24 bg-slate-50 container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12">Our Offers</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {PRICING_PLANS.map((plan, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border hover:shadow-xl transition relative overflow-hidden flex flex-col">
                            <h3 className="font-bold text-xl mb-2">{plan.title}</h3>
                            <p className="text-4xl font-extrabold mb-6">{plan.price}</p>
                            <ul className="space-y-2 mb-8 flex-1">{plan.features.map(f=><li key={f} className="flex gap-2 text-sm"><CheckCircle size={16} className="text-green-500"/> {f}</li>)}</ul>
                            <Button className="w-full" onClick={() => onNavigateToLogin('signup', plan.role)}>{plan.cta}</Button>
                        </div>
                    ))}
                </div>
            </section>
            
            <div className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8 mb-8">
                    <div><h3 className="text-white font-bold mb-4">FinDawa</h3><p className="text-sm">Your health, our priority.</p></div>
                    <div><h4 className="text-white font-bold mb-4">Legal</h4><ul className="space-y-2 text-sm"><li><button onClick={()=>setShowLegal(true)}>Legal Notices</button></li></ul></div>
                    <div><h4 className="text-white font-bold mb-4">Help</h4><ul className="space-y-2 text-sm"><li><button onClick={()=>setShowContact(true)}>Contact Us</button></li></ul></div>
                </div>
                <div className="text-center text-xs text-slate-500 border-t border-slate-800 pt-6">
                    &copy; 2026 FinDawa. All rights reserved. CNDP Compliance No. A-GC-2026.
                </div>
            </div>
        </div>
    );
};

const AuthScreen = ({ onLogin, onBack, initialMode, initialRole, lang = 'fr', onShowLegal }) => {
    const t = TRANSLATIONS[lang];
    const [mode, setMode] = useState(initialMode);
    const [role, setRole] = useState(initialRole);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', city: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(mode === 'signup' && !termsAccepted) return alert("Please accept the terms.");
        
        setLoading(true);
        
        setTimeout(() => {
            // -- REAL LOCAL AUTH LOGIC --
            if (mode === 'signup') {
                const newUser = { id: Date.now().toString(), ...formData, role };
                const users = db.get(DB_KEYS.USERS, []);
                users.push(newUser);
                db.set(DB_KEYS.USERS, users);
                
                if (role === 'pharmacist' || role === 'importer' || role === 'doctor') {
                    setMode('payment');
                    setLoading(false);
                    return;
                }
                
                db.set(DB_KEYS.SESSION, newUser);
                onLogin(newUser);
            } else {
                // Login simulation
                const users = db.get(DB_KEYS.USERS, []);
                const found = users.find(u => u.email === formData.email && u.password === formData.password);
                // For demo simplicity, accept any login if user not found (as guest) or correct credentials
                const userToLogin = found || { name: "Demo User", role: role || 'patient' }; 
                
                db.set(DB_KEYS.SESSION, userToLogin);
                onLogin(userToLogin);
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <button onClick={onBack} className="absolute top-6 left-6 font-bold text-slate-500 flex gap-2 hover:text-slate-900 transition"><ChevronLeft/> Back</button>
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="p-8">
                    <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-6">{mode === 'payment' ? 'Secure Payment' : mode === 'login' ? 'Login' : 'Create Account'}</h2>
                    
                    {mode !== 'payment' && (
                        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                            {['patient', 'pharmacist', 'importer', 'doctor', 'admin'].map(r => (
                                <button key={r} onClick={() => setRole(r)} className={`flex-1 py-2 text-[10px] font-bold rounded-lg capitalize transition-all ${role === r ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{r}</button>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'payment' ? (
                            <div className="space-y-4 animate-in slide-in-from-right">
                                {/* Payment Form Simplified */}
                                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex justify-between items-center">
                                    <div><p className="text-xs text-slate-500 font-bold uppercase">Total to pay</p><p className="font-bold text-slate-900">Monthly Subscription</p></div>
                                    <span className="text-xl font-black text-green-600">{role === 'pharmacist' ? '199' : role === 'doctor' ? '299' : '999'} DH</span>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1">Credit Card</label>
                                    <div className="relative"><CardIcon className="absolute left-3 top-3.5 text-slate-400" size={18}/><input className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="0000 0000 0000 0000"/></div>
                                </div>
                                <div className="flex gap-2">
                                    <input className="flex-1 p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="MM/YY"/>
                                    <input className="flex-1 p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="CVC"/>
                                </div>
                                <Button type="button" onClick={()=>{
                                    const user = db.get(DB_KEYS.USERS, []).pop(); // Get last added user
                                    db.set(DB_KEYS.SESSION, user);
                                    onLogin(user);
                                }} className="w-full bg-slate-900 text-white mt-2">{loading ? 'Processing...' : 'Pay & Activate'}</Button>
                            </div>
                        ) : (
                            <>
                                {mode === 'signup' && (
                                    <div className="space-y-3 animate-in slide-in-from-right">
                                        <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} />
                                        <div className="flex gap-2">
                                            <input required className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="City" onChange={e => setFormData({...formData, city: e.target.value})} />
                                            <input required className="flex-[2] p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder={role === 'patient' ? "Address / District" : "Pharmacy Address"} onChange={e => setFormData({...formData, address: e.target.value})} />
                                        </div>
                                        <div className="flex items-start gap-2 mt-4">
                                            <input type="checkbox" required className="mt-1" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />
                                            <label className="text-xs text-slate-500 leading-tight">I certify having read and approved the <span className="text-green-600 font-bold cursor-pointer underline" onClick={onShowLegal}>Legal Notices</span> and the privacy policy.</label>
                                        </div>
                                    </div>
                                )}
                                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} />
                                <input type="password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} />
                                
                                <Button type="submit" className="w-full mt-2" disabled={mode === 'signup' && !termsAccepted}>
                                    {loading ? 'Loading...' : (mode === 'login' ? 'Log in' : role === 'patient' ? "Register (Free)" : "Continue")}
                                </Button>
                                <p className="text-center text-xs text-slate-400 mt-4 cursor-pointer" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                                    {mode === 'login' ? "No account? Register" : "Already registered? Log in"}
                                </p>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- 7. CHATBOT COMPONENT (REPLACE OLD ONE) ---
const ChatBot = ({ onClose }) => {
  // State management for interactive chat
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // 2. Simulate Gemini AI Response (Scripted for Demo)
    setTimeout(() => {
      const responses = [
        "Analyzing stock in real-time... 🔍",
        "Based on your location, I found 'Doliprane 1000mg' at 3 nearby pharmacies. The closest is Pharma Al Amal (0.5km).",
        "Would you like me to reserve it for you via Click & Collect?",
        "I can also check for drug interactions if you upload your prescription."
      ];
      
      // Pick a response based on conversation length to simulate flow
      const replyText = messages.length === 0 ? responses[1] : responses[2];

      const botMsg = { 
        text: replyText, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="fixed bottom-24 right-6 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col z-50 h-[450px] overflow-hidden animate-in slide-in-from-bottom duration-300">
      
      {/* Header: Gemini Branding */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 p-4 flex justify-between items-center text-white rounded-t-3xl shadow-md">
        <h3 className="font-bold text-sm flex items-center gap-2">
            FinDawa AI <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] border border-white/10 flex items-center gap-1"><Sparkles size={10} className="text-yellow-300 fill-yellow-300 animate-pulse"/> Gemini</span>
        </h3>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition"><X size={18}/></button>
      </div>

      {/* Body: Messages Area */}
      <div className="flex-1 p-4 bg-slate-50 overflow-y-auto flex flex-col gap-3">
         {/* Empty State */}
         {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs italic gap-3 opacity-70">
                <div className="bg-white p-4 rounded-full shadow-sm text-3xl animate-bounce">🤖</div>
                <p>Powered by <span className="font-bold text-green-600">Google Gemini</span></p>
                <p className="text-center max-w-[200px]">Ask about symptoms, availability, or scan a prescription.</p>
            </div>
         )}

         {/* Message History */}
         {messages.map((msg, index) => (
            <div key={index} className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-green-600 text-white self-end rounded-br-none' : 'bg-white text-slate-700 self-start rounded-bl-none border border-slate-100'}`}>
                {msg.text}
            </div>
         ))}
         
         {/* Typing Indicator */}
         {isTyping && (
            <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm self-start border border-slate-100 w-14 flex items-center justify-center gap-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
            </div>
         )}
         <div ref={messagesEndRef} />
      </div>

      {/* Footer: Input */}
      <div className="p-3 bg-white border-t flex gap-2 items-center">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 p-2 bg-slate-100 rounded-lg text-sm outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-green-500 transition" 
            placeholder="Ask Gemini..."
          />
          <button 
            onClick={handleSend}
            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition shadow-md hover:scale-105 active:scale-95 disabled:opacity-50"
            disabled={!input.trim()}
          >
            <Send size={18}/> 
          </button>
      </div>
    </div>
  );
};

// --- ROOT ---
export default function App() {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [authProps, setAuthProps] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [lang, setLang] = useState('fr');
  const [notification, setNotification] = useState(null);

  // CHECK SESSION ON LOAD (The "Real" Feeling)
  useEffect(() => {
      const session = db.get(DB_KEYS.SESSION);
      if (session) {
          setUser(session);
          setView('dashboard');
      }
  }, []);

  const handleLogout = () => {
      localStorage.removeItem(DB_KEYS.SESSION);
      setUser(null);
      setView('landing');
  };

  // REAL B2B ORDER HANDLER (Pharmacy -> Importer)
  const handleB2BOrderPlaced = (items, total) => {
      const newOrder = {
          id: `CMD-${Date.now().toString().slice(-4)}`,
          from: user?.name || "Unknown Pharmacist",
          items,
          total,
          date: new Date().toISOString(),
          status: 'Pending'
      };
      
      const orders = db.get(DB_KEYS.B2B_ORDERS, []);
      orders.push(newOrder);
      db.set(DB_KEYS.B2B_ORDERS, orders);
      
      setNotification(`B2B Order ${newOrder.id} sent successfully!`);
      setTimeout(() => setNotification(null), 3000);
  };

  // REAL PATIENT ORDER HANDLER (Patient -> Pharmacy)
  const handlePatientOrderPlaced = (orderData) => {
      const newOrder = {
          id: `P-CMD-${Date.now().toString().slice(-4)}`,
          date: new Date().toISOString(),
          status: 'Pending',
          ...orderData
      };

      const orders = db.get(DB_KEYS.PATIENT_ORDERS, []);
      orders.push(newOrder);
      db.set(DB_KEYS.PATIENT_ORDERS, orders);

      setNotification("Your order has been sent to the pharmacy!");
      setTimeout(() => setNotification(null), 3000);
  };

  const handleNavigateToLogin = (mode = 'login', role = 'patient') => {
      setAuthProps({ initialMode: mode, initialRole: role });
      setView('auth');
  };

  useEffect(() => { 
      document.dir = lang === 'ar' ? 'rtl' : 'ltr'; 
      // SIMULATION: Live Notifications
      const timer = setInterval(() => {
          if(view === 'dashboard') {
              const msgs = ["New order received (B2B)", "Stock Alert: Doliprane low", "Update: Law 17-04"];
              const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
              // Only simulate random notifications if no real ones
              if(!notification) {
                  setNotification(randomMsg);
                  setTimeout(() => setNotification(null), 4000);
              }
          }
      }, 30000);
      return () => clearInterval(timer);
  }, [lang, view, notification]);

  return (
    <div className="font-sans text-slate-800">
      {notification && <NotificationToast message={notification} onClose={() => setNotification(null)} />}
      {showLegal && <LegalModal onClose={()=>setShowLegal(false)}/>}
      {showContact && <ContactModal onClose={()=>setShowContact(false)}/>}

      {view === 'landing' && <LandingPage onNavigateToLogin={handleNavigateToLogin} lang={lang} setLang={setLang} />}
      {view === 'auth' && <AuthScreen onLogin={(u) => { setUser(u); setView('dashboard'); }} onBack={() => setView('landing')} onShowLegal={() => setShowLegal(true)} {...authProps} />}
      {view === 'dashboard' && (
          <div className="min-h-screen bg-slate-50 flex flex-col">
              <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
                  <div className="flex items-center gap-2"><Pill className="text-green-600 rotate-45"/><span className="font-bold text-xl">FinDawa <span className="text-xs font-normal text-slate-400">| {user?.role}</span></span></div>
                  <Button onClick={handleLogout} variant="secondary" className="h-8 px-3 text-xs"><LogOut size={14} className="mr-1"/> Logout</Button>
              </header>
              <main className="flex-1 p-6 overflow-y-auto">
                  <div className="max-w-6xl mx-auto">
                      {user?.role === 'admin' && <AdminDashboard user={user} />}
                      {user?.role === 'pharmacist' && <PharmacistDashboard onB2BOrderPlaced={handleB2BOrderPlaced} />}
                      {user?.role === 'doctor' && <DoctorDashboard user={user} />}
                      {user?.role === 'patient' && <PatientDashboard onOrderPlaced={handlePatientOrderPlaced} user={user} />}
                      {user?.role === 'importer' && <ImporterDashboard />}
                  </div>
              </main>
          </div>
      )}
      
      <div className="fixed bottom-6 right-6 z-50">
          {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}
          <button onClick={() => setIsChatOpen(!isChatOpen)} className="p-4 rounded-full shadow-2xl bg-green-700 text-white hover:bg-green-800 flex items-center justify-center transition hover:scale-110"><MessageCircle size={24} /></button>
      </div>
      
      {/* Footer Links Global Trigger (For Demo) */}
      {view === 'landing' && (
        <div className="fixed bottom-2 left-2 flex gap-2 text-[10px] text-slate-400 z-50">
            <button onClick={()=>setShowLegal(true)}>Legal Notices</button>
            <button onClick={()=>setShowContact(true)}>Contact</button>
        </div>
      )}
    </div>
  );
}