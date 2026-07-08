import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldAlert, CheckCircle2, Clock, Users, MapPin, 
  Sparkles, Check, ChevronDown, ListFilter, Map, Search, AlertCircle 
} from "lucide-react";
import { Complaint, UserProfile, CivicPriority, CivicStatus } from "../types";
import { mockFieldUnits } from "../data";

interface AdminConsoleProps {
  adminUser: UserProfile;
  complaints: Complaint[];
  onUpdateComplaintStatus: (id: string, newStatus: CivicStatus, notes: string) => void;
  onUpdateComplaintPriority: (id: string, newPriority: CivicPriority) => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export default function AdminConsole({ 
  adminUser, 
  complaints, 
  onUpdateComplaintStatus, 
  onUpdateComplaintPriority,
  onSelectComplaint
}: AdminConsoleProps) {
  const [selectedUnit, setSelectedUnit] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pending and active complaints for admin action
  const activeComplaints = complaints.filter(
    (c) => (c.status === "Pending" || c.status === "In Progress") &&
    (c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDispatch = (complaintId: string) => {
    const unit = selectedUnit[complaintId] || "UNIT-1";
    const selectedUnitName = mockFieldUnits.find(u => u.id === unit)?.name || "Field Squad";
    
    // Auto-update complaint state to In Progress
    onUpdateComplaintStatus(
      complaintId, 
      "In Progress", 
      `Dispatched field unit "${selectedUnitName}". Repairs scheduled to begin.`
    );
    alert(`Success: Dispatched "${selectedUnitName}" to investigate complaint #${complaintId}.`);
  };

  const handleResolve = (complaintId: string) => {
    onUpdateComplaintStatus(
      complaintId,
      "Resolved",
      "Field engineers repaired structural fault. Resident verified and marked closed."
    );
    alert(`Success: Complaint #${complaintId} marked as RESOLVED.`);
  };

  // State to simulate merge duplicate action
  const [duplicateMerged, setDuplicateMerged] = useState(false);

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Municipal Administration Console</h2>
          <p className="text-sm text-slate-500">
            Designated Authority: <span className="font-semibold text-slate-700">{adminUser.name}</span> • Bengaluru South Zone Ward 174
          </p>
        </div>
        <div className="bg-red-50 text-red-700 border border-red-100 rounded-xl px-4 py-2 flex items-center space-x-2 text-xs font-bold">
          <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
          <span>Active Command Mode</span>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 font-extrabold text-lg">
            2,482
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">341</span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pending Action</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">18.4 hrs</span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Avg. Repair Time</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">1,894</span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Resolved Cases</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">94%</span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">SLA Compliance</span>
          </div>
        </div>
      </div>

      {/* Main Panel Content: Left = Dispatch Control Table, Right = Live Map & AI Merge Suggestion */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Column: Dispatch Control Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-950 text-base">Required Field Dispatches</h3>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID or roads..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 text-slate-950"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {activeComplaints.length === 0 ? (
              <div className="text-center py-12 space-y-2 text-slate-400">
                <AlertCircle className="w-10 h-10 mx-auto text-slate-200" />
                <p className="text-xs font-bold">All reports dispatched and resolved! Great job.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-black uppercase tracking-wider">
                    <th className="py-2.5 px-2">ID</th>
                    <th className="py-2.5 px-2">Complaint</th>
                    <th className="py-2.5 px-2">Category</th>
                    <th className="py-2.5 px-2">Urgency Priority</th>
                    <th className="py-2.5 px-2">Designated Squad</th>
                    <th className="py-2.5 px-2 text-right">Dispatch Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {activeComplaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-2 font-bold text-[10px] text-slate-400">{c.id}</td>
                      <td className="py-3 px-2 max-w-[200px]">
                        <button 
                          onClick={() => onSelectComplaint(c)}
                          className="font-bold text-slate-900 hover:underline block text-left"
                        >
                          {c.title}
                        </button>
                        <span className="text-[10px] text-slate-400 block truncate">{c.address.split(",")[0]}</span>
                      </td>
                      <td className="py-3 px-2 font-semibold text-slate-600">{c.category}</td>
                      
                      {/* Priority selector dropdown */}
                      <td className="py-3 px-2">
                        <select
                          value={c.priority}
                          onChange={(e) => onUpdateComplaintPriority(c.id, e.target.value as CivicPriority)}
                          className={`font-bold rounded px-2 py-1 text-[10px] focus:outline-none ${
                            c.priority === "High" ? "bg-red-50 text-red-700" :
                            c.priority === "Medium" ? "bg-amber-50 text-amber-700" :
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          <option value="Low">Low Priority</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High Urgency</option>
                        </select>
                      </td>

                      {/* Squad assignment dropdown */}
                      <td className="py-3 px-2">
                        {c.status === "Pending" ? (
                          <select
                            value={selectedUnit[c.id] || "UNIT-1"}
                            onChange={(e) => setSelectedUnit({ ...selectedUnit, [c.id]: e.target.value })}
                            className="bg-slate-50 border border-slate-200 rounded p-1 text-[10px] text-slate-700 focus:outline-none font-semibold"
                          >
                            {mockFieldUnits.map((u) => (
                              <option key={u.id} value={u.id}>
                                {u.name.split(" ")[0]} ({u.members} men)
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-slate-500 font-bold italic">Squad Active</span>
                        )}
                      </td>

                      {/* Dispatch Control Action */}
                      <td className="py-3 px-2 text-right">
                        {c.status === "Pending" ? (
                          <button
                            onClick={() => handleDispatch(c.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
                            id={`btn-admin-dispatch-${c.id}`}
                          >
                            Dispatch Squad
                          </button>
                        ) : (
                          <button
                            onClick={() => handleResolve(c.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
                            id={`btn-admin-resolve-${c.id}`}
                          >
                            Mark Repaired
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Dispatch Live Map & AI Duplicate Merger */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Duplicate Detection block */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-950 text-white p-5 rounded-2xl shadow-md border border-indigo-800 space-y-3 relative">
            <div className="absolute top-4 right-4 text-indigo-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>

            <h4 className="text-[11px] font-black text-indigo-300 uppercase tracking-wider flex items-center">
              <Sparkles className="w-4 h-4 text-indigo-400 mr-2" /> AI Smart Duplicate Resolver
            </h4>

            {duplicateMerged ? (
              <div className="space-y-2">
                <p className="text-xs text-indigo-200 leading-normal">
                  ✓ Successfully merged reports into <span className="font-bold text-white">CIV-8842</span>. Consolidated engineering order generated and dispatched to Ward Solid Waste unit.
                </p>
                <span className="text-[10px] text-emerald-400 font-bold block">✓ 180 Municipal points rewarded</span>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-indigo-200 leading-normal">
                  Our algorithm discovered <span className="font-bold text-white">2 duplicate reports</span> regarding the main access road sinkhole.
                </p>
                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-indigo-800 text-[10px] text-slate-300">
                  <span className="font-bold block text-white mb-0.5">Duplicates Identified:</span>
                  • ID CIV-8241: Large road collapse ORR Block C<br />
                  • ID CIV-9912: Road deep hole warning
                </div>

                <button
                  onClick={() => setDuplicateMerged(true)}
                  className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-indigo-600/30 cursor-pointer"
                  id="btn-admin-bulk-merge"
                >
                  Merge & Consolidated Dispatch
                </button>
              </div>
            )}
          </div>

          {/* Active Field Units lists */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm">Nearby Field Units Status</h4>
            
            <div className="space-y-3 text-xs">
              {mockFieldUnits.map((u) => (
                <div key={u.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{u.name}</span>
                    <span className="text-[9px] bg-slate-200 text-slate-600 font-semibold px-2 py-0.5 rounded">
                      {u.vehicle.split(" ")[0]}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[10px] font-semibold">Active: {u.currentTask}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
