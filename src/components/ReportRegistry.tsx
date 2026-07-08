import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, SlidersHorizontal, MapPin, Grid, Map, 
  ChevronRight, ThumbsUp, Heart, AlertCircle, Sparkles 
} from "lucide-react";
import { Complaint, CivicCategory, CivicStatus } from "../types";

interface ReportRegistryProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onUpvote: (id: string) => void;
}

type ViewMode = "list" | "map";

export default function ReportRegistry({ 
  complaints, 
  onSelectComplaint, 
  onUpvote 
}: ReportRegistryProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  
  // Filtering & Sorting states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Selected marker on map
  const [selectedMapComplaint, setSelectedMapComplaint] = useState<Complaint | null>(complaints[0] || null);

  // Filter logic
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort logic
  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime();
    } else if (sortBy === "urgency") {
      const priorityWeight = { High: 3, Medium: 2, Low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    } else if (sortBy === "upvotes") {
      return b.upvotes - a.upvotes;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Title & View Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Report Registry</h2>
          <p className="text-sm text-slate-500">
            Browse verified citizen reports or inspect nearby structural hazards on our live map.
          </p>
        </div>

        {/* List vs Map Switcher */}
        <div className="inline-flex bg-slate-100 p-1.5 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center transition-all ${
              viewMode === "list"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
            id="tab-registry-list"
          >
            <Grid className="w-4 h-4 mr-1.5" /> List View
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center transition-all ${
              viewMode === "map"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
            id="tab-registry-map"
          >
            <Map className="w-4 h-4 mr-1.5" /> Interactive Map
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Control Area */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="relative md:col-span-1">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ID, road, keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm focus:outline-none placeholder-slate-400 text-slate-900"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm text-slate-700 font-semibold focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Roads & Infrastructure">Roads & Infra</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Electricity">Electricity</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm text-slate-700 font-semibold focus:outline-none"
          >
            <option value="All">Any Status</option>
            <option value="Pending">Pending Approval</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm text-slate-700 font-semibold focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="urgency">Urgency / Hazard</option>
            <option value="upvotes">Upvote Popularity</option>
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "list" ? (
          /* List View Grid */
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {sortedComplaints.length === 0 ? (
              <div className="col-span-2 bg-white text-center py-16 rounded-2xl border border-slate-100 space-y-2">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800">No matching reports found</h4>
                <p className="text-slate-500 text-xs">Try adjusting your filters or search keywords.</p>
              </div>
            ) : (
              sortedComplaints.map((c) => (
                <div 
                  key={c.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition flex flex-col overflow-hidden relative"
                >
                  {/* Category Pill Overlays */}
                  <div className="p-5 flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md uppercase">
                          {c.id}
                        </span>
                        <div className="text-xs text-slate-400 font-medium">Reported {new Date(c.reportedAt).toLocaleDateString()}</div>
                      </div>

                      {/* Priority Warning Flag */}
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                        c.priority === "High" ? "bg-red-50 text-red-700" :
                        c.priority === "Medium" ? "bg-amber-50 text-amber-700" :
                        "bg-slate-100 text-slate-600"
                      }`}>
                        {c.priority} Priority
                      </span>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <h4 className="text-base font-bold text-slate-900 line-clamp-1">{c.title}</h4>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{c.description}</p>
                    </div>

                    {/* Meta location and user */}
                    <div className="text-xs text-slate-400 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                      <p className="flex items-center text-slate-600 font-medium truncate">
                        <MapPin className="w-3.5 h-3.5 mr-1 shrink-0 text-slate-400" />
                        {c.address}
                      </p>
                      <p className="text-[10px]">Logged by: <span className="font-semibold text-slate-700">{c.citizenName}</span></p>
                    </div>
                  </div>

                  {/* Actions & Upvoting bar */}
                  <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center shrink-0">
                    <div className="flex space-x-4">
                      {/* Upvote Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpvote(c.id);
                        }}
                        className={`flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg transition ${
                          c.hasUpvoted 
                            ? "bg-rose-50 text-rose-600" 
                            : "text-slate-500 hover:text-slate-900 bg-white border border-slate-200"
                        }`}
                        id={`btn-upvote-${c.id}`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 mr-1.5 ${c.hasUpvoted ? "fill-current text-rose-500" : ""}`} />
                        <span>{c.upvotes}</span>
                      </button>

                      {/* Status */}
                      <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
                        c.status === "Resolved" ? "bg-emerald-50 text-emerald-700" :
                        c.status === "In Progress" ? "bg-blue-50 text-blue-700" :
                        "bg-amber-50 text-amber-700"
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectComplaint(c)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center cursor-pointer"
                      id={`btn-view-details-${c.id}`}
                    >
                      Inspect <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        ) : (
          /* Interactive Map View with local pulse side widget */
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid lg:grid-cols-12 gap-6"
          >
            {/* Map Canvas Frame */}
            <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden h-[450px] relative">
              
              {/* Simulated Map Background */}
              <div className="absolute inset-0 bg-[#e5e9f0] overflow-hidden">
                {/* Map Grid Lines */}
                <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:15px_15px]" />
                
                {/* Simulated Roads/Sectors */}
                <div className="absolute left-[20%] top-0 bottom-0 w-8 bg-white/70 shadow-sm rotate-12" />
                <div className="absolute left-0 right-0 top-[40%] h-6 bg-white/70 shadow-sm" />
                <div className="absolute left-0 right-0 top-[70%] h-8 bg-white/70 shadow-sm -rotate-6" />

                {/* HSR Water Tank marker */}
                <div className="absolute left-[45%] top-[25%] bg-slate-400/20 px-3 py-1 rounded-full text-[9px] font-bold text-slate-600 pointer-events-none">
                  HSR Sector 3 Layout
                </div>

                {/* Markers */}
                {complaints.map((c) => {
                  // Map mock lat/lng ratios to map width/height percentages
                  // We map coordinates approximately: Lat: 12.90 to 12.92, Lng: 77.63 to 77.65
                  const latPercent = ((12.92 - c.coordinates.lat) / 0.02) * 100;
                  const lngPercent = ((c.coordinates.lng - 77.63) / 0.02) * 100;
                  
                  const isSelected = selectedMapComplaint?.id === c.id;

                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedMapComplaint(c)}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none transition-transform hover:scale-110 z-10"
                      style={{ 
                        top: `${Math.min(Math.max(latPercent, 15), 85)}%`, 
                        left: `${Math.min(Math.max(lngPercent, 15), 85)}%` 
                      }}
                      id={`btn-map-pin-${c.id}`}
                    >
                      <div className="relative">
                        {/* Pulse for high urgency */}
                        {c.priority === "High" && (
                          <span className="absolute -inset-1.5 rounded-full bg-red-500/30 animate-ping" />
                        )}
                        <div className={`p-2 rounded-full border-2 text-white shadow-md flex items-center justify-center ${
                          isSelected ? "bg-blue-600 border-white scale-110 z-20" :
                          c.category === "Roads & Infrastructure" ? "bg-rose-500 border-white" :
                          c.category === "Sanitation" ? "bg-amber-500 border-white" :
                          c.category === "Water Supply" ? "bg-cyan-500 border-white" :
                          "bg-purple-500 border-white"
                        }`}>
                          <MapPin className="w-4 h-4" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Map Floating Legend overlay */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/50 text-xs space-y-2 max-w-[200px] z-10 shadow-md">
                <span className="font-bold text-slate-800 text-[10px] uppercase block">Marker Legend</span>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-600 font-semibold">
                  <div className="flex items-center"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full mr-1.5" /> Roads</div>
                  <div className="flex items-center"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full mr-1.5" /> Sanitation</div>
                  <div className="flex items-center"><span className="w-2.5 h-2.5 bg-cyan-500 rounded-full mr-1.5" /> Water</div>
                  <div className="flex items-center"><span className="w-2.5 h-2.5 bg-purple-500 rounded-full mr-1.5" /> Electricity</div>
                </div>
              </div>

              {/* Live GPS Lock Indicator */}
              <div className="absolute top-4 right-4 bg-emerald-500 text-white font-bold text-[10px] px-3 py-1.5 rounded-full shadow-md flex items-center space-x-1.5 z-10">
                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                <span>Live GPS Lock</span>
              </div>
            </div>

            {/* Right Sidebar: Selected Marker Detailed Summary */}
            <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl shadow-xs p-5 flex flex-col justify-between h-[450px]">
              {selectedMapComplaint ? (
                <>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md uppercase">
                          {selectedMapComplaint.id}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{selectedMapComplaint.title}</h4>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <p className="text-slate-500 leading-relaxed line-clamp-4">{selectedMapComplaint.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className="bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded text-[11px]">
                          {selectedMapComplaint.category}
                        </span>
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          selectedMapComplaint.status === "Resolved" ? "bg-emerald-50 text-emerald-700" :
                          selectedMapComplaint.status === "In Progress" ? "bg-blue-50 text-blue-700" :
                          "bg-amber-50 text-amber-700"
                        }`}>
                          {selectedMapComplaint.status}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 border border-slate-100">
                      <p className="text-xs font-semibold text-slate-700 flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-slate-400 shrink-0" />
                        {selectedMapComplaint.address.split(",").slice(0, 3).join(",")}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Assigned: {selectedMapComplaint.assignedAuthority}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100 shrink-0">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{selectedMapComplaint.upvotes} upvotes</span>
                      <button
                        onClick={() => onUpvote(selectedMapComplaint.id)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                          selectedMapComplaint.hasUpvoted ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {selectedMapComplaint.hasUpvoted ? "Liked" : "Upvote"}
                      </button>
                    </div>
                    <button
                      onClick={() => onSelectComplaint(selectedMapComplaint)}
                      className="w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-xs shadow-xs cursor-pointer"
                      id="btn-registry-map-inspect"
                    >
                      Inspect Full Report Details
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-20 text-slate-400 space-y-2">
                  <MapPin className="w-12 h-12 text-slate-200 mx-auto" />
                  <p className="text-xs font-semibold">Select a map pin to inspect local issues.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
