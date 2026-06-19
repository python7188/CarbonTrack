import React from 'react';
import {
  Bell,
  ArrowDown,
  Home,
  BarChart3,
  Plus,
  Gift,
  User,
  Leaf,
  Globe,
  Trophy,
  Award,
} from 'lucide-react';
import { QUICK_ACTIONS } from '../../constants';

export const PhoneMockup: React.FC = () => {
  return (
    <div
      className="hidden lg:flex w-[300px] h-[640px] bg-[#0A110F] rounded-[48px] shadow-[0_30px_60px_rgba(0,0,0,0.3),inset_0_0_0_8px_#1C2A26,inset_0_0_0_10px_#000] border border-white/20 relative overflow-hidden flex-col py-8 px-6 font-sans"
      aria-label="Mobile app preview"
      role="img"
    >
      {/* Dynamic Island */}
      <div
        className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full flex items-center justify-between px-3 z-30"
        aria-hidden="true"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-[#2EEA8B]/20" />
      </div>

      <div className="w-full h-full flex flex-col mt-6 z-10 text-white">
        {/* Greeting row */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-medium text-[#EAF6F0]">
            Hello, Ananya 👋
          </span>
          <button aria-label="Notifications" className="relative">
            <Bell className="w-5 h-5 text-[#8FA99D]" aria-hidden="true" />
            <span
              className="absolute top-0 right-0 w-2 h-2 bg-[#2EEA8B] rounded-full"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Today's Footprint card */}
        <div className="bg-gradient-to-br from-[#122A23] to-[#0A1814] rounded-3xl p-6 mb-6 border border-white/5 relative overflow-hidden shadow-xl">
          <div
            className="absolute -top-10 -right-10 w-32 h-32 bg-[#2EEA8B]/10 blur-3xl rounded-full"
            aria-hidden="true"
          />
          <p className="text-xs text-[#8FA99D] mb-1 relative z-10">
            Today&apos;s Footprint
          </p>
          <h2 className="text-4xl font-bold text-white relative z-10 mb-3 tracking-tight">
            12.4{' '}
            <span className="text-sm font-normal text-[#8FA99D]">
              kg CO₂e
            </span>
          </h2>
          <div className="inline-flex items-center gap-1 bg-[#2EEA8B]/10 text-[#2EEA8B] px-2.5 py-1 rounded-full text-[11px] font-semibold relative z-10">
            <ArrowDown className="w-3 h-3" aria-hidden="true" />
            15% vs yesterday
          </div>
        </div>

        {/* Quick Actions */}
        <p className="text-[11px] font-bold text-[#8FA99D] mb-4 uppercase tracking-widest">
          Quick Actions
        </p>
        <div className="grid grid-cols-4 gap-3 mb-8">
          {QUICK_ACTIONS.map((item, i) => {
            const IconComponent = item.icon;
            return (
              <button
                key={i}
                aria-label={`Log ${item.label} activity`}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center border border-white/5 shadow-inner`}
                >
                  <IconComponent
                    className={`w-6 h-6 ${item.color}`}
                    aria-hidden="true"
                  />
                </div>
                <span className="text-[11px] font-medium text-[#8FA99D]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Weekly Goal */}
        <div className="bg-[#122A23] rounded-2xl p-5 border border-white/5 mb-6">
          <div className="flex justify-between text-xs mb-3">
            <span className="text-[#8FA99D]">Weekly Goal</span>
            <span className="text-white font-medium">62 / 100 kg</span>
          </div>
          <div
            className="w-full bg-[#0A1814] rounded-full h-2"
            role="progressbar"
            aria-valuenow={62}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Weekly goal progress"
          >
            <div
              className="bg-[#2EEA8B] h-2 rounded-full shadow-[0_0_8px_rgba(46,234,139,0.5)]"
              style={{ width: '62%' }}
            />
          </div>
        </div>

        {/* Badges */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
            <Leaf className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          </div>
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
            <Globe className="w-5 h-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 opacity-50">
            <Trophy
              className="w-5 h-5 text-gray-500"
              aria-hidden="true"
            />
          </div>
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 opacity-50">
            <Award className="w-5 h-5 text-gray-500" aria-hidden="true" />
          </div>
        </div>

        {/* Bottom Nav Bar */}
        <div className="mt-auto bg-[#162923] rounded-3xl h-16 flex items-center justify-between px-6 border border-white/5 relative shadow-2xl">
          <button aria-label="Home">
            <Home className="w-5 h-5 text-[#2EEA8B]" aria-hidden="true" />
          </button>
          <button aria-label="Statistics">
            <BarChart3 className="w-5 h-5 text-[#8FA99D]" aria-hidden="true" />
          </button>

          {/* Floating Action Button */}
          <button
            aria-label="Add new activity"
            className="w-14 h-14 bg-gradient-to-b from-[#2EEA8B] to-[#1BA860] rounded-full absolute left-1/2 -translate-x-1/2 -top-5 shadow-[0_10px_20px_rgba(46,234,139,0.4)] flex items-center justify-center text-[#071612] hover:scale-105 transition-transform"
          >
            <Plus className="w-8 h-8" aria-hidden="true" />
          </button>

          <button aria-label="Rewards" className="ml-8">
            <Gift className="w-5 h-5 text-[#8FA99D]" aria-hidden="true" />
          </button>
          <button aria-label="Profile">
            <User className="w-5 h-5 text-[#8FA99D]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
