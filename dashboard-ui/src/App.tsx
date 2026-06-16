import React, { useState } from 'react';
import { 
  Leaf, Bell, Search, Trophy, Flame, Globe, Car, Zap, Trash, 
  Users, Map, Award, Plus, ChevronDown, ArrowDown, ArrowUp, 
  ArrowRight, CheckCircle2, Circle, Home, PieChart, User, 
  BarChart3, Target, Gift, MoreHorizontal 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart as RechartsPieChart, Pie, Cell 
} from 'recharts';
import { motion } from 'framer-motion';

// --- Dummy Data ---
const donutData = [
  { name: 'Transport', value: 41, color: '#2EEA8B' },
  { name: 'Energy', value: 28, color: '#60A5FA' },
  { name: 'Food', value: 16, color: '#FBBF24' },
  { name: 'Shopping', value: 10, color: '#A78BFA' },
  { name: 'Waste', value: 5, color: '#FB7185' },
];

const trendData = [
  { name: 'May 1', value: 200 },
  { name: 'May 8', value: 300 },
  { name: 'May 15', value: 220 },
  { name: 'May 22', value: 410 },
  { name: 'May 29', value: 360 },
  { name: 'Jun 5', value: 432 },
];

const sparklineData = [
  { value: 40 }, { value: 30 }, { value: 45 }, { value: 35 }, { value: 50 }, { value: 42 }
];

// --- Custom Components ---
const CircularProgress = ({ value, max, label }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / max) * circumference;
  
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="56" cy="56" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
        <circle 
          cx="56" cy="56" r={radius} 
          stroke="#2EEA8B" strokeWidth="8" fill="none" 
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
          strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(46,234,139,0.5)]" 
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        <span className="text-[10px] text-[#8FA99D] uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
};

const GlobeIllustration = () => (
  <div className="relative w-80 h-80 rounded-full shadow-[0_0_100px_rgba(45,212,191,0.25)] bg-gradient-to-br from-[#1b4332] via-[#041a12] to-[#000000] overflow-hidden border border-[#2EEA8B]/20 flex items-center justify-center">
    {/* Abstract landmass texture simulation */}
    <div className="absolute inset-0 opacity-40 mix-blend-color-dodge">
      <svg width="100%" height="100%">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" />
          <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 7 -3" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" fill="#2EEA8B" />
      </svg>
    </div>
    
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#2EEA8B]/10 to-[#60A5FA]/20 mix-blend-overlay"></div>
    
    {/* 3D Shading */}
    <div className="absolute inset-0 rounded-full shadow-[inset_-30px_-30px_70px_rgba(0,0,0,0.9),inset_10px_10px_40px_rgba(255,255,255,0.2)]"></div>
    
    {/* Atmosphere glow */}
    <div className="absolute -inset-1 rounded-full border-[1px] border-[#60A5FA]/30 blur-[2px]"></div>
  </div>
);

const PhoneMockup = () => (
  <div className="w-[300px] h-[640px] bg-[#0A110F] rounded-[48px] shadow-[0_30px_60px_rgba(0,0,0,0.3),inset_0_0_0_8px_#1C2A26,inset_0_0_0_10px_#000] border border-white/20 relative overflow-hidden flex flex-col py-8 px-6 font-sans">
    {/* Dynamic Island */}
    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full flex items-center justify-between px-3 z-30">
      <div className="w-2.5 h-2.5 rounded-full bg-[#2EEA8B]/20"></div>
    </div>
    
    <div className="w-full h-full flex flex-col mt-6 z-10 text-white">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-medium text-[#EAF6F0]">Hello, Ananya 👋</span>
        <div className="relative">
          <Bell className="w-5 h-5 text-[#8FA99D]" />
          <span className="absolute 0 right-0 w-2 h-2 bg-[#2EEA8B] rounded-full"></span>
        </div>
      </div>
      
      {/* Phone Stat Card */}
      <div className="bg-gradient-to-br from-[#122A23] to-[#0A1814] rounded-3xl p-6 mb-6 border border-white/5 relative overflow-hidden shadow-xl">
         <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#2EEA8B]/10 blur-3xl rounded-full" />
         <p className="text-xs text-[#8FA99D] mb-1 relative z-10">Today's Footprint</p>
         <h2 className="text-4xl font-bold text-white relative z-10 mb-3 tracking-tight">12.4 <span className="text-sm font-normal text-[#8FA99D]">kg CO₂e</span></h2>
         <div className="inline-flex items-center gap-1 bg-[#2EEA8B]/10 text-[#2EEA8B] px-2.5 py-1 rounded-full text-[11px] font-semibold relative z-10">
           <ArrowDown className="w-3 h-3" /> 15% vs yesterday
         </div>
      </div>

      <p className="text-[11px] font-bold text-[#8FA99D] mb-4 uppercase tracking-widest">Quick Actions</p>
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { icon: Car, label: 'Travel', color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { icon: Leaf, label: 'Food', color: 'text-green-400', bg: 'bg-green-400/10' },
          { icon: Zap, label: 'Energy', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { icon: Trash, label: 'Waste', color: 'text-pink-400', bg: 'bg-pink-400/10' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2 cursor-pointer">
            <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center border border-white/5 shadow-inner`}>
               <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <span className="text-[11px] font-medium text-[#8FA99D]">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-[#122A23] rounded-2xl p-5 border border-white/5 mb-6">
        <div className="flex justify-between text-xs mb-3">
          <span className="text-[#8FA99D]">Weekly Goal</span>
          <span className="text-white font-medium">62 / 100 kg</span>
        </div>
        <div className="w-full bg-[#0A1814] rounded-full h-2">
          <div className="bg-[#2EEA8B] h-2 rounded-full shadow-[0_0_8px_rgba(46,234,139,0.5)]" style={{width: '62%'}}></div>
        </div>
      </div>

      {/* Badges */}
      <div className="grid grid-cols-4 gap-2 mb-4">
         <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10"><Leaf className="w-5 h-5 text-emerald-400"/></div>
         <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10"><Globe className="w-5 h-5 text-blue-400"/></div>
         <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 opacity-50"><Trophy className="w-5 h-5 text-gray-500"/></div>
         <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 opacity-50"><Award className="w-5 h-5 text-gray-500"/></div>
      </div>

      {/* Bottom Nav Bar */}
      <div className="mt-auto bg-[#162923] rounded-3xl h-16 flex items-center justify-between px-6 border border-white/5 relative shadow-2xl">
        <Home className="w-5 h-5 text-[#2EEA8B]" />
        <BarChart3 className="w-5 h-5 text-[#8FA99D]" />
        
        {/* Floating Action Button */}
        <div className="w-14 h-14 bg-gradient-to-b from-[#2EEA8B] to-[#1BA860] rounded-full absolute left-1/2 -translate-x-1/2 -top-5 shadow-[0_10px_20px_rgba(46,234,139,0.4)] flex items-center justify-center text-[#071612] cursor-pointer hover:scale-105 transition-transform">
          <Plus className="w-8 h-8" />
        </div>
        
        <Gift className="w-5 h-5 text-[#8FA99D] ml-8" />
        <User className="w-5 h-5 text-[#8FA99D]" />
      </div>
    </div>
  </div>
);

// --- Main Page Component ---
export default function PremiumDashboard() {
  const [activeTab, setActiveTab] = useState('Month');

  return (
    <div className="flex h-screen w-full bg-[#EEF4F5] overflow-hidden font-sans text-[#16211F]">
      
      {/* --- 1. LEFT SIDEBAR --- */}
      <aside className="w-[260px] bg-[#071612] text-white flex flex-col justify-between py-8 px-6 relative z-20 shadow-[20px_0_40px_rgba(0,0,0,0.05)] shrink-0">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-[#2EEA8B]/10 to-transparent pointer-events-none"></div>
        
        <div>
          {/* Branding */}
          <div className="flex items-center gap-3 mb-12 relative z-10 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2EEA8B]/20 to-transparent rounded-xl flex items-center justify-center border border-[#2EEA8B]/30 shadow-[0_0_15px_rgba(46,234,139,0.15)]">
              <Leaf className="w-6 h-6 text-[#2EEA8B]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">EcoTrack</h1>
              <p className="text-[10px] text-[#2EEA8B] font-semibold uppercase tracking-widest">Every Action Counts</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1.5 relative z-10">
            {[
              { label: 'Dashboard', icon: Home, active: true },
              { label: 'My Footprint', icon: BarChart3 },
              { label: 'Track Activities', icon: Target },
              { label: 'AI Insights', icon: Zap },
              { label: 'Reduce Impact', icon: Leaf },
              { label: 'Goals & Challenges', icon: Trophy },
              { label: 'Community', icon: Users },
              { label: 'Leaderboard', icon: Award },
              { label: 'Rewards', icon: Gift },
              { label: 'Impact Map', icon: Map },
            ].map((item, idx) => (
              <a 
                key={idx} 
                href="#" 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  item.active 
                  ? 'bg-gradient-to-r from-[#2EEA8B]/15 to-transparent text-white shadow-[inset_2px_0_0_#2EEA8B]' 
                  : 'text-[#8FA99D] hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.active ? 'text-[#2EEA8B]' : 'stroke-[1.5px]'}`} />
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Tip Card */}
        <div className="bg-[#0B1F1A] rounded-2xl p-5 border border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.2)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2EEA8B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-full h-24 rounded-lg bg-cover bg-center mb-4 opacity-80 mix-blend-luminosity bg-[#162923]"></div>
          <h4 className="text-sm font-semibold text-white mb-1">Small choices Big impact</h4>
          <p className="text-[11px] text-[#8FA99D] mb-4 leading-relaxed">Every action counts towards a greener tomorrow.</p>
          <button className="w-full py-2.5 bg-[#162923] hover:bg-[#1E3A31] text-[#2EEA8B] text-xs font-semibold rounded-lg transition-colors border border-[#2EEA8B]/20">
            Explore tips
          </button>
        </div>
      </aside>

      {/* --- MAIN CANVAS + RIGHT COLUMN --- */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Soft Background Blend */}
        <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/60 via-teal-50/20 to-transparent pointer-events-none z-0"></div>

        {/* --- 2. CENTRAL DASHBOARD --- */}
        <main className="flex-1 overflow-y-auto px-10 py-8 relative z-10">
          
          {/* HEADER */}
          <header className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-[32px] font-bold text-[#16211F] tracking-tight flex items-center gap-2">
                Good Morning, Ananya <Leaf className="w-6 h-6 text-[#2EEA8B]" fill="#2EEA8B" />
              </h2>
              <p className="text-[#5C6B68] text-sm font-medium mt-1">"Small choices today, a better planet tomorrow."</p>
            </div>
            
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-[#8FA99D]" />
                </div>
                <input 
                  type="text" 
                  className="bg-white/60 backdrop-blur-md border border-white shadow-sm rounded-full py-2.5 pl-11 pr-4 w-72 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EEA8B]/50 transition-all placeholder:text-[#8FA99D]" 
                  placeholder="Search anything..." 
                />
              </div>
              
              <div className="w-10 h-10 bg-white/60 backdrop-blur-md border border-white shadow-sm rounded-full flex items-center justify-center relative cursor-pointer hover:bg-white transition-colors">
                <Bell className="w-5 h-5 text-[#5C6B68]" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#FB7185] rounded-full border border-white"></span>
              </div>
              
              <div className="flex items-center gap-2 cursor-pointer bg-white/60 backdrop-blur-md border border-white shadow-sm rounded-full p-1.5 pr-3 hover:bg-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                <ChevronDown className="w-4 h-4 text-[#5C6B68]" />
              </div>
            </div>
          </header>

          {/* ROW 1: STAT CARDS */}
          <div className="grid grid-cols-4 gap-5 mb-6">
            {[
              { title: 'Your Carbon Footprint', subtitle: 'This Month', value: '432', unit: 'kg CO₂e', delta: '↓ 18% vs last month', deltaColor: 'text-[#059669]', deltaBg: 'bg-[#2EEA8B]/20', icon: null },
              { title: 'Global Average', subtitle: '', value: '910', unit: 'kg CO₂e', icon: <Globe className="w-6 h-6 text-blue-500" /> },
              { title: 'You Saved', subtitle: 'This Month', value: '78', unit: 'kg CO₂e', icon: <Leaf className="w-6 h-6 text-[#2EEA8B]" /> },
              { title: 'Rank', subtitle: 'Among active users', value: 'Top 12%', unit: '', icon: <Trophy className="w-6 h-6 text-[#F59E0B]" /> },
            ].map((stat, i) => (
              <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: i * 0.1}} key={i} 
                className="bg-white/70 backdrop-blur-xl rounded-[24px] p-5 border border-white shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden group hover:shadow-[0_10px_40px_rgba(0,0,0,0.04)] transition-all">
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-[13px] font-semibold text-[#5C6B68]">{stat.title}</h3>
                    {stat.subtitle && <p className="text-[11px] text-[#8FA99D] mt-0.5">{stat.subtitle}</p>}
                  </div>
                  {stat.icon && <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shadow-sm">{stat.icon}</div>}
                </div>
                
                <div className="mt-auto">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-[#16211F] tracking-tight">{stat.value}</span>
                    <span className="text-xs font-semibold text-[#5C6B68]">{stat.unit}</span>
                  </div>
                  
                  {stat.delta && (
                    <div className={`mt-3 inline-flex items-center gap-1 ${stat.deltaBg} ${stat.deltaColor} px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide`}>
                      {stat.delta}
                    </div>
                  )}
                </div>

                {i === 0 && (
                  <div className="absolute bottom-4 right-4 w-16 h-8 opacity-50">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparklineData}>
                        <Line type="monotone" dataKey="value" stroke="#2EEA8B" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* ROW 2: CENTRAL VISUAL FOCUS + ANALYTICS */}
          <div className="grid grid-cols-12 gap-5 mb-6 h-[380px]">
            
            {/* Left Analytics Card */}
            <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.3}} 
              className="col-span-4 bg-gradient-to-br from-[#0B1F1A] to-[#081612] rounded-[32px] p-7 border border-white/10 text-white shadow-2xl flex flex-col">
              <h3 className="font-semibold text-[15px] mb-6 tracking-wide">Your Footprint Breakdown</h3>
              
              <div className="flex-1 flex items-center justify-between">
                <div className="w-[140px] h-[140px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie data={donutData} innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                        {donutData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold">432</span>
                    <span className="text-[9px] text-[#8FA99D] uppercase tracking-wider">kg CO₂e</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 flex-1 ml-6">
                  {donutData.map(d => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-[#8FA99D]">
                        <span className="w-2 h-2 rounded-full shadow-sm" style={{backgroundColor: d.color}}></span>
                        {d.name}
                      </div>
                      <span className="font-semibold text-white">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button className="text-xs text-[#8FA99D] hover:text-white mt-6 text-left flex items-center gap-1.5 transition-colors w-fit font-medium">
                View detailed analysis <ArrowRight className="w-3 h-3" />
              </button>
            </motion.div>

            {/* Central Globe Focal Point */}
            <motion.div initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} transition={{delay: 0.4, duration: 0.8}} 
              className="col-span-5 relative flex items-center justify-center">
              
              {/* Orbit Rings */}
              <div className="absolute w-[360px] h-[360px] border border-[#2EEA8B]/10 rounded-full animate-[spin_60s_linear_infinite]" />
              <div className="absolute w-[420px] h-[420px] border border-[#60A5FA]/10 rounded-full animate-[spin_80s_linear_infinite_reverse] border-dashed" />
              
              <GlobeIllustration />
              
              {/* CO2 Chip */}
              <div className="absolute top-10 left-10 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-[#059669] shadow-lg border border-white flex items-center gap-1">
                <Target className="w-3 h-3" /> CO2 Neutral Goal
              </div>

              {/* AI Insight Bubble */}
              <motion.div animate={{y: [0, -10, 0]}} transition={{repeat: Infinity, duration: 6, ease: "easeInOut"}} 
                className="absolute top-1/4 -right-12 bg-[#0B1F1A]/90 backdrop-blur-xl border border-white/10 p-5 rounded-3xl w-64 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white z-20">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-[13px] tracking-wide text-[#EAF6F0]">AI Insight</h4>
                  <Zap className="w-4 h-4 text-[#2EEA8B] fill-[#2EEA8B] drop-shadow-[0_0_5px_rgba(46,234,139,0.8)]" />
                </div>
                <p className="text-xs text-[#8FA99D] mb-4 leading-relaxed">
                  Based on your lifestyle, you can reduce <strong className="text-[#2EEA8B] font-semibold">120 kg CO₂e/month</strong> by these smart actions
                </p>
                <div className="flex flex-col gap-2 mb-3">
                  <div className="bg-[#162923] text-[11px] px-3 py-2.5 rounded-xl border border-white/5 flex items-center gap-2.5 hover:bg-[#1C332B] cursor-pointer transition-colors text-[#EAF6F0]">
                    <Car className="w-3.5 h-3.5 text-blue-400"/> Use public transport more
                  </div>
                  <div className="bg-[#162923] text-[11px] px-3 py-2.5 rounded-xl border border-white/5 flex items-center gap-2.5 hover:bg-[#1C332B] cursor-pointer transition-colors text-[#EAF6F0]">
                    <Leaf className="w-3.5 h-3.5 text-[#2EEA8B]"/> Reduce meat consumption
                  </div>
                </div>
                <button className="text-[10px] text-[#8FA99D] hover:text-[#2EEA8B] transition-colors font-medium flex items-center gap-1">
                  See all recommendations <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>
            </motion.div>

            {/* Right Analytics Card */}
            <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.5}} 
              className="col-span-3 bg-gradient-to-br from-[#0B1F1A] to-[#081612] rounded-[32px] p-7 border border-white/10 text-white shadow-2xl flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-6">
                <h3 className="font-semibold text-[15px] tracking-wide">Daily Streak</h3>
                <Flame className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B] drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
              </div>
              
              <div className="flex-1 flex items-center justify-center my-2">
                <CircularProgress value={11} max={14} label="Days" />
              </div>
              
              <p className="text-[13px] font-semibold mt-6 text-[#EAF6F0]">Keep your streak alive!</p>
              
              <div className="flex justify-between w-full mt-5">
                {['M','T','W','T','F','S','S'].map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <span className="text-[9px] text-[#8FA99D] font-bold">{day}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${i < 5 ? 'bg-[#2EEA8B] text-[#071612] shadow-[0_0_8px_rgba(46,234,139,0.4)]' : 'bg-[#162923] text-[#8FA99D] border border-white/5'}`}>
                      {i < 5 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
          </div>

          {/* ROW 3: TREND / REWARDS / KPI */}
          <div className="grid grid-cols-12 gap-5 mb-6">
            
            {/* Trend Card */}
            <div className="col-span-5 bg-white/70 backdrop-blur-xl rounded-[24px] p-6 border border-white shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-[#16211F]">Footprint Trend</h3>
                <div className="bg-slate-100/80 p-1 rounded-full flex text-xs font-medium">
                  {['Week', 'Month', 'Year'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1 rounded-full transition-colors ${activeTab === tab ? 'bg-white shadow-sm text-[#059669]' : 'text-[#8FA99D] hover:text-[#5C6B68]'}`}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#8FA99D'}} dy={10} />
                    <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}} />
                    <Line type="monotone" dataKey="value" stroke="#2EEA8B" strokeWidth={3} dot={{r: 4, fill: '#fff', stroke: '#2EEA8B', strokeWidth: 2}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rewards Card */}
            <div className="col-span-4 bg-white/70 backdrop-blur-xl rounded-[24px] p-6 border border-white shadow-sm flex items-center gap-4">
               {/* Minimalist Eco Illustration */}
               <div className="w-28 h-28 bg-gradient-to-br from-green-100 to-blue-50 rounded-full flex items-center justify-center border border-white shadow-inner shrink-0 relative overflow-hidden">
                 <Leaf className="w-10 h-10 text-emerald-500 relative z-10" />
                 <div className="absolute bottom-0 w-full h-1/3 bg-emerald-200/50 blur-md"></div>
               </div>
               <div className="flex flex-col">
                 <h3 className="font-semibold text-[#16211F] mb-1">Reduce & Earn Rewards</h3>
                 <p className="text-[11px] text-[#5C6B68] font-medium mb-1">You've earned <span className="text-[#059669] font-bold text-sm">250 Eco Points</span></p>
                 <p className="text-[10px] text-[#8FA99D] mb-4 leading-relaxed">Redeem exciting rewards and plant more trees.</p>
                 <button className="bg-gradient-to-r from-[#2EEA8B] to-[#1BA860] text-[#071612] text-xs font-bold py-2 px-4 rounded-full w-fit shadow-[0_4px_12px_rgba(46,234,139,0.3)] hover:shadow-[0_6px_16px_rgba(46,234,139,0.4)] transition-all">
                   Explore Rewards
                 </button>
               </div>
            </div>

            {/* Impact KPI Card */}
            <div className="col-span-3 bg-white/70 backdrop-blur-xl rounded-[24px] p-6 border border-white shadow-sm flex flex-col justify-between">
               <h3 className="font-semibold text-[#16211F] mb-4">Impact You Created</h3>
               {[
                 { label: 'CO₂e Reduced', icon: CloudOff, color: 'text-teal-500', bg: 'bg-teal-50', val: '12.5 kg' },
                 { label: 'Trees Supported', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-50', val: '3' },
                 { label: 'Km Travelled Green', icon: Car, color: 'text-blue-500', bg: 'bg-blue-50', val: '45 km' },
               ].map((kpi, i) => (
                 <div key={i} className="flex items-center justify-between mb-3 last:mb-0">
                   <div className="flex items-center gap-3">
                     <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center`}><kpi.icon className={`w-4 h-4 ${kpi.color}`} /></div>
                     <span className="text-xs font-semibold text-[#5C6B68]">{kpi.label}</span>
                   </div>
                   <span className="text-sm font-bold text-[#16211F]">{kpi.val}</span>
                 </div>
               ))}
            </div>

          </div>

          {/* ROW 4: BOTTOM ROW */}
          <div className="grid grid-cols-12 gap-5">
             
             {/* Challenges Card */}
             <div className="col-span-4 bg-white/70 backdrop-blur-xl rounded-[24px] p-6 border border-white shadow-sm flex flex-col">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-semibold text-[#16211F]">Popular Challenges</h3>
                 <button className="text-[10px] font-bold text-[#2EEA8B] bg-[#2EEA8B]/10 px-2 py-1 rounded-md">View all</button>
               </div>
               <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-white shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-xl">🌎</div>
                 <div className="flex-1">
                   <h4 className="text-sm font-bold text-[#16211F]">7 Day Green Challenge</h4>
                   <p className="text-[10px] text-[#5C6B68] mt-0.5">Reduce your footprint every day this week!</p>
                   <div className="flex items-center justify-between mt-3">
                     <div className="w-full bg-white rounded-full h-1.5 mr-3 overflow-hidden border border-slate-100">
                       <div className="bg-[#2EEA8B] h-full rounded-full" style={{width: '57%'}}></div>
                     </div>
                     <span className="text-[9px] font-bold text-[#059669] whitespace-nowrap">4/7 Days</span>
                   </div>
                 </div>
               </div>
             </div>

             {/* Community Impact */}
             <div className="col-span-4 bg-white/70 backdrop-blur-xl rounded-[24px] p-6 border border-white shadow-sm flex flex-col justify-center items-center text-center">
               <h3 className="font-semibold text-[#16211F] mb-1">Community Impact</h3>
               <p className="text-[11px] text-[#5C6B68] mb-3">Together, we've reduced</p>
               <h2 className="text-3xl font-bold text-[#16211F] tracking-tight mb-1">2,345,678 <span className="text-sm font-medium text-[#5C6B68]">kg CO₂e</span></h2>
               <p className="text-[11px] text-[#059669] font-medium bg-[#2EEA8B]/10 px-3 py-1 rounded-full mb-4">That's like planting 195,472 trees 🌳</p>
               <div className="flex -space-x-2">
                 {[1,2,3,4,5].map(i => (
                   <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-7 h-7 rounded-full border-2 border-white shadow-sm" alt="User" />
                 ))}
                 <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-[#5C6B68]">+12K</div>
               </div>
             </div>

             {/* Impact Map */}
             <div className="col-span-4 bg-gradient-to-br from-[#0B1F1A] to-[#081612] rounded-[24px] p-6 border border-white/10 shadow-xl flex flex-col relative overflow-hidden group">
               <div className="flex justify-between items-center relative z-10 mb-4">
                 <h3 className="font-semibold text-white">Impact Map</h3>
                 <button className="text-[10px] text-[#8FA99D] flex items-center gap-1 hover:text-white transition-colors">Explore Map <ArrowRight className="w-3 h-3"/></button>
               </div>
               
               {/* CSS Dot Map Simulation */}
               <div className="flex-1 relative z-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                 <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(#2EEA8B 1px, transparent 1px)', backgroundSize: '8px 8px', maskImage: 'linear-gradient(to bottom, black, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)'}}></div>
                 {/* Glowing nodes */}
                 <div className="absolute top-4 left-1/4 w-2 h-2 bg-[#2EEA8B] rounded-full shadow-[0_0_10px_#2EEA8B]"></div>
                 <div className="absolute top-8 right-1/3 w-1.5 h-1.5 bg-[#60A5FA] rounded-full shadow-[0_0_8px_#60A5FA]"></div>
                 <div className="absolute bottom-4 left-1/2 w-2 h-2 bg-[#2EEA8B] rounded-full shadow-[0_0_10px_#2EEA8B]"></div>
               </div>
             </div>

          </div>

        </main>

        {/* --- 3. RIGHT COLUMN (PHONE MOCKUP) --- */}
        <aside className="w-[360px] shrink-0 pt-8 pb-8 pr-10 pl-6 flex flex-col items-center justify-center relative z-10 border-l border-white/40 bg-gradient-to-b from-white/30 to-transparent">
          <PhoneMockup />
          
          <div className="mt-10 text-center">
            <h3 className="text-xl font-bold text-[#16211F] tracking-tight mb-1">Track it. Reduce it.<br/>Change it.</h3>
            <p className="text-sm font-medium text-[#5C6B68]">For you. For your tomorrow.</p>
          </div>
        </aside>

      </div>
    </div>
  );
}

// Icon helper since CloudOff isn't imported from lucide above
function CloudOff(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m2 2 20 20"/><path d="M5.78 5.782a7 7 0 0 0 9.44 9.436"/><path d="M7 21h9.124"/><path d="M22 17v-1.127a3.5 3.5 0 0 0-1.745-3.031l-1.077-.618A5.5 5.5 0 0 0 17 5h-1.625"/><path d="M10 5a3.5 3.5 0 0 0-4.067 1.957"/></svg>
  );
}
