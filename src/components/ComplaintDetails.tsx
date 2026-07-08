import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, ThumbsUp, Share2, MapPin, Sparkles, 
  ExternalLink, User, Phone, CheckCircle, ShieldAlert 
} from "lucide-react";
import { Complaint } from "../types";

interface ComplaintDetailsProps {
  complaint: Complaint;
  onBack: () => void;
  onUpvote: (id: string) => void;
}

export default function ComplaintDetails({ complaint, onBack, onUpvote }: ComplaintDetailsProps) {
  const [escalated, setEscalated] = useState(false);

  const handleEscalate = () => {
    setEscalated(true);
    alert(`Complaint ${complaint.id} has been escalated directly to the Superintendent Municipal Engineer!`);
  };

  const handleShare = () => {
    alert(`Complaint URL copied to clipboard! (civicsphere.gov.in/report/${complaint.id})`);
  };

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Breadcrumbs / Back button */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition text-slate-600"
          id="btn-details-back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-xs text-slate-400 font-semibold uppercase">Reports Registry</span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Complaint ID #{complaint.id}</h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Column: Complaint Details and Visuals */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Visual Image Card */}
          {complaint.image ? (
            <div className="h-80 w-full overflow-hidden rounded-2xl relative border border-slate-100">
              <img 
                src={complaint.image} 
                alt="original evidence photo" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1.5 rounded-lg">
                Original Evidence Photo
              </div>
            </div>
          ) : (
            <div className="h-44 bg-slate-100 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs">
              <p className="font-bold">No Visual Evidence Uploaded</p>
              <p>GPS positioning holds primary verification record.</p>
            </div>
          )}

          {/* Description Block */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex flex-wrap gap-2.5">
              <span className="bg-slate-100 text-slate-800 font-bold px-3 py-1 rounded-xl text-xs">
                {complaint.category}
              </span>
              <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${
                complaint.priority === "High" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
              }`}>
                {complaint.priority} Urgency Priority
              </span>
              {complaint.isHazard && (
                <span className="bg-rose-100 text-rose-700 font-extrabold px-3 py-1 rounded-xl text-xs flex items-center">
                  <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Public Safety Risk
                </span>
              )}
            </div>

            <h3 className="text-xl font-extrabold text-slate-950">{complaint.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{complaint.description}</p>

            {/* Support Actions: Upvotes, Share */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-150 text-xs">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onUpvote(complaint.id)}
                  className={`flex items-center font-bold px-4 py-2.5 rounded-xl transition ${
                    complaint.hasUpvoted 
                      ? "bg-rose-50 text-rose-600 border border-rose-100" 
                      : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
                  }`}
                  id="btn-details-upvote"
                >
                  <ThumbsUp className={`w-4 h-4 mr-2 ${complaint.hasUpvoted ? "fill-current text-rose-500" : ""}`} />
                  <span>{complaint.upvotes} Citizens upvoted this</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 transition"
                  id="btn-details-share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <span className="text-slate-400 font-medium">Logged by {complaint.citizenName}</span>
            </div>
          </div>

          {/* AI Priority suggestion card */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3 relative">
            <div className="absolute top-4 right-4 text-blue-300">
              <Sparkles className="w-8 h-8 opacity-40" />
            </div>
            
            <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center">
              <Sparkles className="w-4 h-4 text-blue-600 mr-2" /> AI Priority Assessment
            </h4>
            
            <p className="text-xs text-blue-800 leading-relaxed font-semibold">
              {complaint.aiExplanation || "Our machine learning routing classifier flagged this issue for immediate executive engineer assignment due to critical structural safety impacts."}
            </p>

            <div className="pt-3 border-t border-blue-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-900">AI Priority Match: High (94% confidence)</span>
              <button
                onClick={handleEscalate}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition ${
                  escalated 
                    ? "bg-emerald-600 text-white" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                id="btn-escalate-complaint"
              >
                {escalated ? "Escalated ✓" : "Escalate Issue"}
              </button>
            </div>
          </div>

          {/* Location details */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-900 text-sm">Location Details</h4>
              <a
                href={`https://www.google.com/maps?q=${complaint.coordinates.lat},${complaint.coordinates.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
              >
                Open in Google Maps <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>

            <div className="text-xs text-slate-600 font-medium flex items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
              <MapPin className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              {complaint.address}
            </div>

            <div className="h-44 bg-[#e5e9f0] rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:15px_15px]" />
              <div className="absolute top-[40%] left-0 right-0 h-4 bg-white/70" />
              <div className="absolute left-[30%] top-0 bottom-0 w-4 bg-white/70" />
              <div className="absolute top-1/2 left-1/3 text-rose-500">
                <MapPin className="w-7 h-7 fill-red-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: tracking timeline and authorities */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Tracking Timeline */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-5">
            <h4 className="font-extrabold text-slate-900 text-sm">Tracking Timeline</h4>

            <div className="relative pl-6 space-y-6">
              {/* Vertical line connector */}
              <div className="absolute left-2.5 top-2 bottom-2 w-[2px] bg-slate-100" />

              {complaint.trackingTimeline.map((step, idx) => (
                <div key={idx} className="relative text-xs">
                  {/* Outer circle */}
                  <div className={`absolute left-[-22px] top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                    step.completed ? "border-emerald-600 text-emerald-600" : "border-slate-300 text-slate-300"
                  }`}>
                    {step.completed && <CheckCircle className="w-3 h-3 fill-emerald-50 text-emerald-600" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center font-bold">
                      <span className={step.completed ? "text-slate-900" : "text-slate-400"}>
                        {step.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{step.timestamp}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Responsible Authority Block */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm">Responsible Authority</h4>

            <div className="space-y-3.5">
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Officer In-Charge</span>
                  <h5 className="text-xs font-bold text-slate-900">{complaint.assignedOfficer || "Review Pending"}</h5>
                  <p className="text-[10px] text-slate-400 font-semibold">{complaint.assignedAuthority}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Resolution target</span>
                  <span className="font-bold text-slate-800 block text-[11px]">
                    {complaint.resolutionTimeEstimate || "Awaiting Schedule"}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Feedback score</span>
                  <span className="font-bold text-slate-800 block text-[11px]">96% Satisfactory</span>
                </div>
              </div>

              <button
                onClick={() => alert(`Connecting with Ward Engineer ${complaint.assignedOfficer || "office"}...`)}
                className="w-full text-center py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition"
                id="btn-details-contact"
              >
                Contact Ward Authority Office
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
