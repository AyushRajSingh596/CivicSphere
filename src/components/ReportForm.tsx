import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Camera, MapPin, Upload, Sparkles, Mic, 
  Trash2, AlertCircle, Loader2, CheckCircle2 
} from "lucide-react";
import { CivicCategory, CivicPriority, Complaint, UserProfile } from "../types";

interface ReportFormProps {
  user: UserProfile;
  onSubmitReport: (newComplaint: Complaint) => void;
  onCancel: () => void;
}

export default function ReportForm({ user, onSubmitReport, onCancel }: ReportFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CivicCategory>("Roads & Infrastructure");
  const [priority, setPriority] = useState<CivicPriority>("Medium");
  
  // AI Analysis States
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    category: CivicCategory;
    priority: CivicPriority;
    isHazard: boolean;
    explanation: string;
  } | null>(null);

  // Microphone/Speech Simulation state
  const [isRecording, setIsRecording] = useState(false);

  // Image Upload simulation states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Address simulation states
  const [addressInput, setAddressInput] = useState("14th Main Road, Sector 3, HSR Layout, Bengaluru, Karnataka 560102");
  const [gpsAccuracy, setGpsAccuracy] = useState("Live GPS Lock (±3 meters)");

  // Run AI analysis on description change (debounce or on blur)
  const triggerAiAnalysis = async () => {
    if (description.trim().length < 15) return;
    setIsAiAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
      });
      const data = await res.json();
      if (res.ok) {
        setCategory(data.category);
        setPriority(data.priority);
        setAiSuggestion({
          category: data.category,
          priority: data.priority,
          isHazard: data.isHazard,
          explanation: data.aiExplanation
        });
      }
    } catch (err) {
      console.error("AI Analysis error:", err);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // Simulate Mic Dictation
  const handleMicClick = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    setIsRecording(true);
    setTimeout(() => {
      setDescription("Large potholes have emerged on the main road after last night's heavy downpour. It is creating a traffic hazard and might cause accidents for bike riders.");
      setTitle("Heavy pothole damage on HSR main road");
      setIsRecording(false);
      // Trigger AI analysis with a timeout
      setTimeout(() => {
        triggerAiAnalysis();
      }, 500);
    }, 2500);
  };

  // Simulate Image Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Standard mock image file
    setSelectedImage("https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600");
  };

  const selectMockImage = () => {
    setSelectedImage("https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please fill in the title and description.");
      return;
    }

    const uniqueId = "CIV-" + Math.floor(1000 + Math.random() * 9000);
    
    const newComplaint: Complaint = {
      id: uniqueId,
      title,
      description,
      category,
      priority,
      isHazard: aiSuggestion?.isHazard || false,
      status: "Pending",
      reportedAt: new Date().toISOString(),
      address: addressInput,
      coordinates: { lat: 12.9105, lng: 77.6480 }, // HSR center
      image: selectedImage,
      upvotes: 1,
      hasUpvoted: false,
      citizenId: user.id,
      citizenName: user.name,
      notes: null,
      assignedAuthority: category === "Roads & Infrastructure" ? "BBMP Road Infrastructure Division" :
                         category === "Sanitation" ? "BBMP Solid Waste Management Division" :
                         category === "Water Supply" ? "BWSSB Water Supply Division" :
                         category === "Electricity" ? "BESCOM Ward Maintenance Unit" : "Municipal Zone Authority",
      aiExplanation: aiSuggestion?.explanation || "Analyzed by CivicSphere Smart Classifier.",
      trackingTimeline: [
        {
          status: "Reported",
          title: "Complaint Lodged",
          timestamp: "Just Now",
          completed: true,
          description: "Citizen reported via CivicSphere App with verified GPS coordinates."
        },
        {
          status: "AI Analysis Complete",
          title: "AI Analysis & Verification",
          timestamp: "Just Now",
          completed: true,
          description: `AI routed to ${category === "Roads & Infrastructure" ? "BBMP" : category === "Sanitation" ? "SWM" : "Municipal"} Ward Engineer under ${priority} Priority.`
        },
        {
          status: "Assigned",
          title: "Awaiting Officer Designation",
          timestamp: "Pending",
          completed: false,
          description: "Ward officer review scheduled."
        }
      ]
    };

    onSubmitReport(newComplaint);
  };

  const categories: { label: CivicCategory; color: string }[] = [
    { label: "Roads & Infrastructure", color: "bg-rose-50 text-rose-700 hover:bg-rose-100/50" },
    { label: "Sanitation", color: "bg-amber-50 text-amber-700 hover:bg-amber-100/50" },
    { label: "Water Supply", color: "bg-cyan-50 text-cyan-700 hover:bg-cyan-100/50" },
    { label: "Electricity", color: "bg-purple-50 text-purple-700 hover:bg-purple-100/50" },
    { label: "Other", color: "bg-slate-100 text-slate-700 hover:bg-slate-200/50" }
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Report a Civic Issue</h2>
          <p className="text-sm text-slate-500">
            Submit localized complaints. CivicSphere uses neural models to verify and dispatch field squads instantly.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-sm font-semibold text-slate-500 hover:text-slate-900 px-4 py-2 hover:bg-slate-50 rounded-xl transition"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-6 text-left">
        {/* Left Column: Issue Form Fields */}
        <div className="lg:col-span-8 space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          
          {/* Issue Title */}
          <div>
            <label htmlFor="issue-title" className="block text-sm font-bold text-slate-800 mb-1.5">
              Issue Title
            </label>
            <input
              type="text"
              id="issue-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep Pothole outside Sector 3 Post Office"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm focus:outline-none placeholder-slate-400 text-slate-900 font-medium"
              required
            />
          </div>

          {/* Category Selector */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-slate-800">
                Issue Category
              </label>
              {aiSuggestion && (
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" /> Verified by AI
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {categories.map((cat) => {
                const isSelected = category === cat.label;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setCategory(cat.label)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                      isSelected 
                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10" 
                        : `${cat.color} border-transparent`
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description & Speech input */}
          <div className="space-y-1.5 relative">
            <div className="flex justify-between items-center">
              <label htmlFor="issue-desc" className="block text-sm font-bold text-slate-800">
                Detailed Description
              </label>
              
              {/* Mic transcription button */}
              <button
                type="button"
                onClick={handleMicClick}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center transition ${
                  isRecording 
                    ? "bg-red-100 text-red-600 animate-pulse" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                id="btn-mic-dictate"
              >
                <Mic className="w-3.5 h-3.5 mr-1 text-slate-500" />
                {isRecording ? "Listening..." : "Speak (Hindi/Kannada/Eng)"}
              </button>
            </div>

            <div className="relative">
              <textarea
                id="issue-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={triggerAiAnalysis}
                rows={5}
                placeholder="Describe what is broken, size estimates, duration, and safety hazards..."
                className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm focus:outline-none placeholder-slate-400 text-slate-900 leading-relaxed font-medium"
                required
              />

              {isAiAnalyzing && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center rounded-xl space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  <span className="text-xs font-bold text-slate-700">Gemini analyzing text urgency...</span>
                </div>
              )}
            </div>
          </div>

          {/* Drag & Drop Visual Evidence container */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              Visual Evidence
            </label>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center cursor-pointer ${
                isDragging 
                  ? "border-blue-500 bg-blue-50/20" 
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100/50"
              }`}
              onClick={selectMockImage}
            >
              {selectedImage ? (
                <div className="space-y-3 relative w-full max-w-[200px]">
                  <img 
                    src={selectedImage} 
                    alt="evidence preview" 
                    className="w-full h-32 object-cover rounded-xl border border-slate-100 shadow-xs"
                  />
                  <div className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition"
                       onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold block">✓ Image Captured Successfully</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto text-slate-500">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Drag & Drop or Click to Upload</p>
                  <p className="text-[10px] text-slate-400">Supports JPG, PNG up to 10MB (GPS tags auto-extracted)</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Location Map & Coordinates */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Issue Location</h3>
            
            {/* Search address bar */}
            <div>
              <label htmlFor="addr-search" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Pin Location Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  id="addr-search"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs focus:outline-none text-slate-800 font-semibold"
                />
              </div>
            </div>

            {/* GPS Pulse and Accuracy Info */}
            <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl flex items-center space-x-2 text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span className="text-[10px] font-bold">{gpsAccuracy}</span>
            </div>

            {/* Mini Map simulation */}
            <div className="h-44 bg-[#e5e9f0] rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:12px_12px]" />
              {/* Roads mockup */}
              <div className="absolute top-[40%] left-0 right-0 h-4 bg-white/85 shadow-sm" />
              <div className="absolute left-[50%] top-0 bottom-0 w-4 bg-white/85 shadow-sm" />
              
              {/* Center Lock Pin */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-red-600">
                <MapPin className="w-8 h-8 fill-red-200" />
              </div>
            </div>

            {/* Address summary card */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 font-medium">
              <span className="font-bold text-slate-700 block mb-0.5">Detected Ward Address:</span>
              Sector 3 HSR Layout, BBMP Ward 174, Zone South.
            </div>
          </div>

          {/* AI Priority analysis card */}
          {aiSuggestion && (
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl space-y-2">
              <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center">
                <Sparkles className="w-4 h-4 text-blue-600 mr-1.5" /> AI Dispatch Decision
              </h4>
              <p className="text-[11px] text-blue-800 font-semibold leading-relaxed">
                {aiSuggestion.explanation}
              </p>
              <div className="flex space-x-3 text-[10px] font-bold pt-1.5 border-t border-blue-100/60">
                <span>Priority: <span className="text-blue-900">{aiSuggestion.priority}</span></span>
                <span>Category: <span className="text-blue-900">{aiSuggestion.category}</span></span>
                {aiSuggestion.isHazard && <span className="text-red-700 bg-red-100/50 px-2 py-0.5 rounded">Hazard Flagged</span>}
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3 shrink-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ready to Submit?</span>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer flex items-center justify-center"
              id="btn-submit-report-form"
            >
              Submit Civic Report
            </button>
            <p className="text-[10px] text-slate-400 text-center leading-normal">
              Submissions are permanently logged in public IPFS registries and tracked by regional BBMP officials.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
