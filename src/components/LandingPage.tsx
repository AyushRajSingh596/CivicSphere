import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, Shield, Sparkles, MapPin, CheckCircle2, 
  Smartphone, BarChart3, Globe, Zap, Clock, ThumbsUp, Building2 
} from "lucide-react";
import { initialCities } from "../data";

interface LandingPageProps {
  onGetStarted: () => void;
  onExplorePublic: () => void;
}

export default function LandingPage({ onGetStarted, onExplorePublic }: LandingPageProps) {
  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg tracking-tighter">
            CS
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            CivicSphere
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition">How It Works</a>
          <a href="#cities" className="hover:text-blue-600 transition">Impact Hubs</a>
        </nav>

        <div className="flex items-center space-x-4">
          <button 
            onClick={onExplorePublic}
            className="hidden sm:inline-flex text-sm font-semibold text-slate-700 hover:text-slate-900 px-4 py-2"
            id="btn-nav-public-dashboard"
          >
            Public Registry
          </button>
          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
            id="btn-nav-get-started"
          >
            Sign In / Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient background blur circles */}
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-blue-100 rounded-full blur-[100px] -z-10 opacity-75" />
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-orange-100 rounded-full blur-[100px] -z-10 opacity-75" />

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live in 20+ Indian Cities</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Transforming Indian Cities with <span className="text-blue-600">AI-Powered</span> Civic Action.
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Join the digital revolution in urban governance. Report local issues, track resolutions in real-time, and help build smarter, cleaner, and safer neighborhoods in Bengaluru, Indore, Pune, and beyond.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 flex items-center justify-center cursor-pointer"
                id="btn-hero-report"
              >
                Report an Issue
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button
                onClick={onExplorePublic}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold px-8 py-4 rounded-xl transition shadow-xs flex items-center justify-center cursor-pointer"
                id="btn-hero-explore"
              >
                View Public Dashboard
              </button>
            </div>

            {/* Micro Rating */}
            <div className="flex items-center justify-center lg:justify-start space-x-8 pt-4">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="avatar" />
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" alt="avatar" />
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="avatar" />
                </div>
                <div>
                  <div className="flex text-amber-500 text-sm">★★★★★</div>
                  <div className="text-xs text-slate-500 font-medium">Joined by 1.2M+ citizens</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Mockup Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-[340px] sm:max-w-[380px] bg-slate-900 rounded-[40px] p-3.5 shadow-2xl border-4 border-slate-800">
              {/* Inner screen simulation */}
              <div className="bg-slate-900 rounded-[30px] overflow-hidden aspect-[9/19] flex flex-col relative text-white">
                {/* Simulated Header */}
                <div className="h-8 bg-slate-900 px-5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>9:41 AM</span>
                  <div className="w-20 h-4 bg-black rounded-full absolute left-1/2 transform -translate-x-1/2 top-1.5" />
                  <div className="flex space-x-1.5">
                    <span>5G</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="flex-1 bg-slate-950 p-4 space-y-4 overflow-y-auto no-scrollbar text-left">
                  {/* Mock Screen Content */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400">Welcome back,</p>
                      <h4 className="text-sm font-bold">Arjun Sharma 👋</h4>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">AS</div>
                  </div>

                  {/* Stat Card */}
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3.5 rounded-2xl space-y-1">
                    <p className="text-[10px] text-blue-100">Your Citizen Impact Points</p>
                    <h3 className="text-xl font-black">1,240 pts</h3>
                    <p className="text-[9px] text-blue-200">Silver Level Guardian • Bengaluru</p>
                  </div>

                  {/* Small Live Map preview */}
                  <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-300">Live GPS Hotspots</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                    <div className="h-20 bg-slate-800 rounded-lg overflow-hidden relative">
                      {/* Grid background representing map */}
                      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:10px_10px]" />
                      <div className="absolute top-1/2 left-1/3 h-2.5 w-2.5 rounded-full bg-red-500 border border-white" />
                      <div className="absolute top-1/3 right-1/4 h-2.5 w-2.5 rounded-full bg-amber-500 border border-white" />
                      <div className="absolute bottom-1/4 left-1/2 h-2.5 w-2.5 rounded-full bg-blue-500 border border-white" />
                    </div>
                  </div>

                  {/* Complaint Item */}
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded-md text-blue-400 font-semibold">CIV-8842</span>
                      <span className="text-[9px] text-amber-400 font-semibold">In Progress</span>
                    </div>
                    <p className="text-[11px] font-bold line-clamp-1">Sinkhole on ORR HSR Block C</p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[80%]" />
                    </div>
                    <p className="text-[9px] text-slate-400">Assigned: BBMP South Zone Squad</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floater Badge 1 */}
            <div className="absolute top-12 left-[-20px] bg-white p-3.5 rounded-xl shadow-xl border border-slate-100 flex items-center space-x-3 max-w-[180px]">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Resolved</p>
                <p className="text-[10px] text-slate-500">In under 18 hours</p>
              </div>
            </div>

            {/* Floater Badge 2 */}
            <div className="absolute bottom-16 right-[-20px] bg-white p-3.5 rounded-xl shadow-xl border border-slate-100 flex items-center space-x-3 max-w-[180px]">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">AI Verified</p>
                <p className="text-[10px] text-slate-500">Instant Ward Routing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="bg-white border-y border-slate-100 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="space-y-1">
            <h3 className="text-4xl font-extrabold text-blue-600">50,000+</h3>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Issues Resolved</p>
          </div>
          <div className="space-y-1 border-y sm:border-y-0 sm:border-x border-slate-100 py-6 sm:py-0">
            <h3 className="text-4xl font-extrabold text-blue-600">20+</h3>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Indian Cities Covered</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-extrabold text-blue-600">4.8 / 5</h3>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Citizen Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Empowering Citizen-First Governance
          </h2>
          <p className="text-slate-600">
            We bridge the gap between citizens and local municipal bodies by employing artificial intelligence to streamline detection, validation, and engineering workflow assignments.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition duration-200 space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">AI-Powered Classification</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Upload an image and description; our on-device algorithm automatically categories the issue and routes it directly to the designated Ward Executive Engineer in seconds.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition duration-200 space-y-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Real-Time Transit Stepper</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Track your grievance's physical lifecycle. From logging, administrative approval, and squad dispatch, to post-repair validation. Receive alerts at each key junction.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition duration-200 space-y-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Multilingual Dictation</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              No language barriers in civic reporting. Speak in Hindi, Kannada, Marathi, Tamil, or Bengali. Our voice processing system instantly translates and transcribes the report.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Stepper Section */}
      <section id="how-it-works" className="bg-slate-100 py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              The Path to a Better Neighborhood
            </h2>
            <p className="text-slate-600">
              CivicSphere simplifies reporting into 4 transparent milestones. No more searching for local ward offices or filing complex RTI inquiries.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/60 relative">
              <div className="absolute top-4 right-4 text-slate-200 text-4xl font-black">01</div>
              <div className="w-10 h-10 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center mb-4">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Citizen Reports</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Snapshot the pothole, leaking pipe, or garbage pile. The app automatically locks the GPS coordinates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/60 relative">
              <div className="absolute top-4 right-4 text-slate-200 text-4xl font-black">02</div>
              <div className="w-10 h-10 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center mb-4">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">AI Analyzes & Groups</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Gemini classifies the hazard rating and groups duplicates to present aggregate impact hotspots to administrators.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/60 relative">
              <div className="absolute top-4 right-4 text-slate-200 text-4xl font-black">03</div>
              <div className="w-10 h-10 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center mb-4">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Municipal Dispatch</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Ward officers assign field engineers who update progress logs directly on-site using GPS check-ins.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/60 relative">
              <div className="absolute top-4 right-4 text-slate-200 text-4xl font-black">04</div>
              <div className="w-10 h-10 bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center mb-4">
                4
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Citizen Validated</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Once repaired, photos are shared with the reporter and local community for voting on satisfactory closure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Impact Hubs / Cities */}
      <section id="cities" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Active Impact Hubs
          </h2>
          <p className="text-slate-600">
            Witness how collaborative civic action is reforming municipalities. Indore leads in SWM clean drives, while Bengaluru achieves record-breaking road repair turnarounds.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {initialCities.map((city) => (
            <div key={city.name} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md transition group">
              <div className="h-44 overflow-hidden relative">
                <img 
                  src={city.image} 
                  alt={city.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-xs">
                  ★ {city.citizenRating} Rating
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{city.name}</h4>
                  <p className="text-xs text-slate-400">{city.state}</p>
                </div>
                <div className="flex justify-between text-xs border-t border-slate-50 pt-3">
                  <div>
                    <span className="text-emerald-600 font-bold block">{city.solvedCount.toLocaleString()}+</span>
                    <span className="text-[10px] text-slate-400">Resolved Cases</span>
                  </div>
                  <div className="text-right">
                    <span className="text-blue-600 font-bold block">{city.activeCount}</span>
                    <span className="text-[10px] text-slate-400">Active Works</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* App Store Download / Bottom CTA Block */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-20 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
          <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] bg-blue-400 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to improve your neighborhood?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Take charge of your locality. Join lakhs of active Indian citizens who are co-creating smart neighborhoods together. CivicSphere is available for Android & iOS.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center justify-center cursor-pointer text-sm"
              id="btn-bottom-get-started"
            >
              Get Started Online
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            
            {/* Apple / Android Mock Store Buttons */}
            <div className="flex space-x-3">
              <a href="#playstore" className="bg-slate-800 hover:bg-slate-750 border border-slate-700 px-4 py-2 rounded-xl flex items-center text-left space-x-2.5 transition">
                <Smartphone className="w-5 h-5 text-slate-300" />
                <div>
                  <p className="text-[8px] text-slate-400 uppercase font-bold">Get it on</p>
                  <p className="text-xs font-bold leading-none">Google Play</p>
                </div>
              </a>
              <a href="#appstore" className="bg-slate-800 hover:bg-slate-750 border border-slate-700 px-4 py-2 rounded-xl flex items-center text-left space-x-2.5 transition">
                <Building2 className="w-5 h-5 text-slate-300" />
                <div>
                  <p className="text-[8px] text-slate-400 uppercase font-bold">Download on the</p>
                  <p className="text-xs font-bold leading-none">App Store</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black">CS</div>
              <span className="text-lg font-bold tracking-tight">CivicSphere</span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              CivicSphere is a collaborative civic tech project supporting public systems under Digital India initiatives. Built with advanced cloud infrastructures and Gemini language technologies.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="text-white text-xs font-bold uppercase tracking-wider">Resources</h5>
            <ul className="text-xs space-y-2">
              <li><a href="#about" className="hover:text-white transition">About CDAC Systems</a></li>
              <li><a href="#terms" className="hover:text-white transition">National Portal (India)</a></li>
              <li><a href="#muncipalities" className="hover:text-white transition">Smart Cities Mission</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-white text-xs font-bold uppercase tracking-wider">Transparency</h5>
            <ul className="text-xs space-y-2">
              <li><a href="#audit" className="hover:text-white transition">Public Audit Logs</a></li>
              <li><a href="#privacy" className="hover:text-white transition">Privacy & GPS Policy</a></li>
              <li><a href="#api" className="hover:text-white transition">Open Data APIs</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p>© 2026 CivicSphere Civic Technology. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed for Ministry of Housing and Urban Affairs.</p>
        </div>
      </footer>
    </div>
  );
}
