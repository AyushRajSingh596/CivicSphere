import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AlertTriangle, CheckCircle2, Clock, MapPin, 
  Send, Bot, Sparkles, ArrowRight, User, Loader2 
} from "lucide-react";
import { Complaint, UserProfile, ChatMessage } from "../types";

interface CitizenDashboardProps {
  user: UserProfile;
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onNavigateToReport: () => void;
}

export default function CitizenDashboard({ 
  user, 
  complaints, 
  onSelectComplaint, 
  onNavigateToReport 
}: CitizenDashboardProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: `Namaste ${user.name}! I am your CivicSphere AI assistant. Ask me anything about municipal schedules, active reports, or typical resolution timelines in Bengaluru.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to chat end
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      // Map to API history schema: array of { role: "user" | "model", text: string }
      const historyContext = chatMessages.map(msg => ({
        role: msg.role,
        text: msg.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          history: historyContext
        })
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            role: "model",
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(data.error || "Failed to call Gemini");
      }
    } catch (err) {
      console.error(err);
      // Fallback response
      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "model",
          text: "Oops! I had trouble connecting to my central ward database. For demo purposes, you can trust that typical potholes on main HSR routes are resolved within 24 to 48 hours.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Filter complaints logged by this user (or we display all as part of general civic list, but let's highlight active ones)
  const userReports = complaints.filter(c => c.citizenId === user.id);
  const totalFiled = complaints.length;
  const totalResolved = complaints.filter(c => c.status === "Resolved").length;
  const totalInProgress = complaints.filter(c => c.status === "In Progress").length;
  const totalPending = complaints.filter(c => c.status === "Pending").length;

  // Track the most crucial "active" complaint for the vertical tracker sidebar
  const activeTrackerComplaint = complaints.find(c => c.status === "In Progress") || complaints[0];

  return (
    <div className="space-y-6">
      {/* Header and Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Citizen Overview
          </h2>
          <p className="text-slate-500 text-sm">
            Monitor municipal service dispatch status and civic alerts in HSR Ward 174.
          </p>
        </div>

        <button
          onClick={onNavigateToReport}
          className="self-start md:self-auto inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer text-sm"
          id="btn-dash-new-report"
        >
          <AlertTriangle className="w-4 h-4 mr-2" /> Report New Civic Issue
        </button>
      </div>

      {/* AI Hotspot Warning Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-4 flex items-start space-x-3.5 shadow-xs">
        <div className="bg-amber-100 p-2.5 rounded-xl text-amber-800 shrink-0">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-md">AI Hotspot Detector</span>
            <span className="text-xs text-amber-800 font-medium">• 15m ago</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">Pre-Monsoon Solid Waste Alert (HSR Market Sector 15)</h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            Heavy rainfall is predicted for the next 48 hours. Our predictive model indicates a 92% risk of stormwater backup near the Sector 15 vegetable market. solid waste quick response team is scheduled to preemptively clear structural conduits.
          </p>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">{totalFiled}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Total Reports</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">{totalResolved}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Resolved Cases</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">{totalInProgress}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wide">In Progress</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">{totalPending}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Pending Dispatch</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Recent Complaints, Right = Live Tracker & AI Chat */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Recent complaints */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-50">
            <h3 className="font-extrabold text-slate-900 text-lg">Active Local Complaints</h3>
            <span className="text-xs text-slate-400 font-semibold uppercase">Ward 174</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-2">ID</th>
                  <th className="py-3 px-2">Complaint Details</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-2 font-semibold text-xs text-slate-400">{c.id}</td>
                    <td className="py-4 px-2 max-w-[240px]">
                      <div className="font-bold text-slate-900 truncate">{c.title}</div>
                      <div className="text-xs text-slate-400 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1 shrink-0 text-slate-400" />
                        <span className="truncate">{c.address.split(",")[0]}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-xs">
                      <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-1 rounded-md">
                        {c.category}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
                        c.status === "Resolved" ? "bg-emerald-50 text-emerald-700" :
                        c.status === "In Progress" ? "bg-blue-50 text-blue-700" :
                        "bg-amber-50 text-amber-700"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <button
                        onClick={() => onSelectComplaint(c)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-end w-full"
                        id={`btn-dash-view-${c.id}`}
                      >
                        Inspect <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Active Live Tracker & Chatbot */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Issue Tracking Timeline Card */}
          {activeTrackerComplaint && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                <h4 className="font-extrabold text-slate-950 text-sm">Active Tracker</h4>
                <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-md uppercase">
                  {activeTrackerComplaint.id}
                </span>
              </div>

              <div className="space-y-1">
                <h5 className="text-sm font-bold text-slate-900 line-clamp-1">{activeTrackerComplaint.title}</h5>
                <p className="text-[10px] text-slate-400">Assigned: {activeTrackerComplaint.assignedAuthority}</p>
              </div>

              {/* Vertical timeline stepper */}
              <div className="relative pl-6 space-y-4">
                {/* Visual Line */}
                <div className="absolute left-2.5 top-1.5 bottom-1.5 w-[2px] bg-slate-100" />

                {activeTrackerComplaint.trackingTimeline.map((step, idx) => (
                  <div key={idx} className="relative text-xs">
                    {/* Circle Node */}
                    <div className={`absolute left-[-21px] top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center ${
                      step.completed 
                        ? "border-emerald-600 bg-emerald-50 text-emerald-600" 
                        : "border-slate-300"
                    }`}>
                      {step.completed && <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex justify-between items-center">
                        <span className={`font-bold ${step.completed ? "text-slate-900" : "text-slate-400"}`}>
                          {step.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{step.timestamp}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onSelectComplaint(activeTrackerComplaint)}
                className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition"
                id="btn-tracker-full-history"
              >
                Inspect Complete History Log
              </button>
            </div>
          )}

          {/* AI Assistant Chat widget */}
          <div className="bg-slate-950 text-white rounded-2xl shadow-xl border border-slate-800 p-4 flex flex-col h-[340px]">
            <div className="flex items-center space-x-2.5 pb-2.5 border-b border-slate-800 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-500 flex items-center justify-center">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold flex items-center">
                  CivicSphere AI Bot <Sparkles className="w-3 h-3 text-blue-400 ml-1" />
                </h4>
                <p className="text-[9px] text-slate-400">Instant updates & typical timelines</p>
              </div>
            </div>

            {/* Chat message flow container */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 no-scrollbar text-xs">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] p-2.5 rounded-2xl ${
                    msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-slate-900 text-slate-200 rounded-tl-none border border-slate-800"
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-[8px] text-slate-400 block text-right mt-1 font-mono">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 text-slate-400 p-2.5 rounded-2xl rounded-tl-none border border-slate-800 flex items-center space-x-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                    <span className="text-[10px]">AI Classifier thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input bar */}
            <form onSubmit={handleSendChat} className="pt-2 border-t border-slate-800 flex space-x-1.5 shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me when CIV-8842 will close..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-white placeholder-slate-500"
                disabled={isChatLoading}
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center shrink-0 transition"
                disabled={isChatLoading}
                id="btn-chatbot-send"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
