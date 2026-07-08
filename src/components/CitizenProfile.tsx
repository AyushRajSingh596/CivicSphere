import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Award, Trophy, MapPin, Phone, Mail, 
  Settings, Check, Bell, Sparkles, Languages, CheckSquare 
} from "lucide-react";
import { UserProfile } from "../types";

interface CitizenProfileProps {
  user: UserProfile;
}

export default function CitizenProfile({ user }: CitizenProfileProps) {
  const [lang, setLang] = useState("English");
  const [smartAlerts, setSmartAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Badge list data
  const badges = [
    { id: "b1", name: "Pothole Buster", desc: "Successfully reported and verified 5 road complaints.", icon: "🚗", date: "June 2026" },
    { id: "b2", name: "Solid Waste Warrior", desc: "First responder for localized community cleanup drives.", icon: "🧹", date: "May 2026" },
    { id: "b3", name: "Active Contributor", desc: "Earned more than 1,000 impact points in Ward 174.", icon: "🌟", date: "April 2026" },
    { id: "b4", name: "Safety Guardian", desc: "Reported an immediate electrical wire / drain hazard.", icon: "⚡", date: "March 2026" }
  ];

  // Calculate level progress percentage
  const pointsProgress = (user.points / user.nextLevelPoints) * 100;

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-100">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Citizen Profile & Impact</h2>
        <p className="text-sm text-slate-500">
          Track your local neighborhood contributions, check points status, or adjust alerts.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Column: Impact Card & Badges */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Contributor Impact Section */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 rounded-2xl relative overflow-hidden shadow-xl">
            <div className="absolute top-[-30%] right-[-10%] w-[300px] h-[300px] bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center space-x-4">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-16 h-16 rounded-2xl border-2 border-white/20 object-cover"
                />
                <div>
                  <div className="inline-flex items-center bg-blue-500/20 text-blue-300 text-[10px] font-black px-2.5 py-0.5 rounded-full mb-1">
                    <Trophy className="w-3 h-3 mr-1" /> ACTIVE CONTRIBUTOR
                  </div>
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <p className="text-slate-400 text-xs font-semibold">{user.city}, India</p>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Citizen Level</p>
                <h4 className="text-2xl font-black text-blue-400">{user.impactLevel}</h4>
                <p className="text-xs text-slate-300">{user.points} total impact points</p>
              </div>
            </div>

            {/* Level progress bar */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Silver Level Progress</span>
                <span className="font-semibold">{user.points} / {user.nextLevelPoints} Points to Gold</span>
              </div>
              
              <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${pointsProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Badges Earned achievements */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center">
                <Award className="w-5 h-5 text-blue-600 mr-2" /> Badges & Achievements
              </h3>
              <span className="text-xs text-slate-400 font-bold uppercase">{badges.length} Unlocked</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {badges.map((b) => (
                <div key={b.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex space-x-3.5 items-start">
                  <span className="text-3xl shrink-0 p-1 bg-white rounded-xl shadow-xs">{b.icon}</span>
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-900 text-sm leading-none">{b.name}</h5>
                    <p className="text-slate-500 text-xs leading-relaxed">{b.desc}</p>
                    <span className="text-[10px] text-slate-400 font-semibold block pt-1">Earned {b.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Account settings and Preferences */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Account Details */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Account Verification</h4>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Email Address</span>
                  <span className="font-semibold text-slate-800">{user.email}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Mobile Number</span>
                  <span className="font-semibold text-slate-800">{user.phone}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Primary Residence</span>
                  <span className="font-semibold text-slate-800">HSR Layout, Sector 3, Bengaluru, KA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Settings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center">
              <Settings className="w-4 h-4 text-slate-400 mr-2" /> App Preferences
            </h4>

            <div className="space-y-4 text-xs">
              
              {/* Language Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Dashboard Language
                </label>
                <div className="relative">
                  <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  >
                    <option>English</option>
                    <option>ಕನ್ನಡ (Kannada)</option>
                    <option>हिन्दी (Hindi)</option>
                    <option>தமிழ் (Tamil)</option>
                    <option>मराठी (Marathi)</option>
                  </select>
                </div>
              </div>

              {/* Alert Toggles */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Smart GPS Alerts</span>
                    <span className="text-[10px] text-slate-400 block max-w-[180px]">Receive notifications about local ward shutdowns or repairs.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smartAlerts}
                    onChange={(e) => setSmartAlerts(e.target.checked)}
                    className="h-4.5 w-8 rounded-full bg-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                  <div>
                    <span className="font-bold text-slate-800 block">Weekly SWM Digest</span>
                    <span className="text-[10px] text-slate-400 block max-w-[180px]">Monthly report card of Ward 174 cleanup achievements.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={weeklyDigest}
                    onChange={(e) => setWeeklyDigest(e.target.checked)}
                    className="h-4.5 w-8 rounded-full bg-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
