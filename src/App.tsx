import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, MapPin, Grid, PlusCircle, User, LogOut, 
  Settings, Bot, Shield, FileText, ChevronRight, Menu, X, 
  HelpCircle, Languages, LayoutDashboard, Database, RefreshCw 
} from "lucide-react";

import { Complaint, UserProfile, CivicStatus, CivicPriority } from "./types";
import { initialComplaints, initialCitizen, initialAdmin } from "./data";

// Import custom components
import LandingPage from "./components/LandingPage";
import LoginScreen from "./components/LoginScreen";
import CitizenDashboard from "./components/CitizenDashboard";
import ReportRegistry from "./components/ReportRegistry";
import ReportForm from "./components/ReportForm";
import ComplaintDetails from "./components/ComplaintDetails";
import CitizenProfile from "./components/CitizenProfile";
import AdminConsole from "./components/AdminConsole";

type ActivePage = "landing" | "login" | "dashboard" | "registry" | "report-form" | "details" | "profile" | "admin-console";

export default function App() {
  // Navigation states
  const [activePage, setActivePage] = useState<ActivePage>("landing");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Complaints database state (initialized with pre-populated data)
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Sidebar mobile toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Translate toggle dropdown
  const [dashboardLang, setDashboardLang] = useState("English");
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  // Upvote persistence handler
  const handleUpvote = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const alreadyUpvoted = c.hasUpvoted || false;
          return {
            ...c,
            upvotes: alreadyUpvoted ? c.upvotes - 1 : c.upvotes + 1,
            hasUpvoted: !alreadyUpvoted,
          };
        }
        return c;
      })
    );
    // Sync active selection details if open
    if (selectedComplaint && selectedComplaint.id === id) {
      setSelectedComplaint((prev) => {
        if (!prev) return null;
        const alreadyUpvoted = prev.hasUpvoted || false;
        return {
          ...prev,
          upvotes: alreadyUpvoted ? prev.upvotes - 1 : prev.upvotes + 1,
          hasUpvoted: !alreadyUpvoted,
        };
      });
    }
  };

  // Create new complaint report handler
  const handleCreateReport = (newComplaint: Complaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
    
    // Auto increment user contribution stats
    if (currentUser) {
      setCurrentUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          points: prevUser.points + 100, // +100 points for reporting
          resolvedCount: prevUser.resolvedCount + 1,
        };
      });
    }

    setActivePage("dashboard");
    alert(`Success: Complaint #${newComplaint.id} has been securely logged! Our AI Classifier has routed it to ${newComplaint.assignedAuthority}.`);
  };

  // Admin status update handler
  const handleUpdateStatus = (id: string, newStatus: CivicStatus, notes: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updatedTimeline = [...c.trackingTimeline];
          
          // Append new step if resolved
          if (newStatus === "Resolved") {
            updatedTimeline.push({
              status: "Resolved",
              title: "Resolution Verified",
              timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              completed: true,
              description: notes,
            });
          } else if (newStatus === "In Progress") {
            // Mark assignment step complete
            const assignmentStep = updatedTimeline.find(step => step.title.includes("Assignment") || step.title.includes("Assigned"));
            if (assignmentStep) {
              assignmentStep.completed = true;
              assignmentStep.timestamp = "July 8, 11:30 AM";
            }
          }

          return {
            ...c,
            status: newStatus,
            notes: notes,
            trackingTimeline: updatedTimeline,
            resolutionTimeEstimate: newStatus === "Resolved" ? "Closed" : c.resolutionTimeEstimate,
          };
        }
        return c;
      })
    );
  };

  // Admin priority selector handler
  const handleUpdatePriority = (id: string, newPriority: CivicPriority) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            priority: newPriority,
          };
        }
        return c;
      })
    );
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === "admin") {
      setActivePage("admin-console");
    } else {
      setActivePage("dashboard");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage("landing");
  };

  // Helper to trigger specific complaint inspect screen
  const inspectComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setActivePage("details");
  };

  // Quick Switch Admin Mode for demo testing
  const toggleDemoRole = () => {
    if (!currentUser) {
      setCurrentUser(initialCitizen);
      setActivePage("dashboard");
    } else if (currentUser.role === "citizen") {
      setCurrentUser(initialAdmin);
      setActivePage("admin-console");
    } else {
      setCurrentUser(initialCitizen);
      setActivePage("dashboard");
    }
  };

  // Sidebar Menu selection list mapping
  const menuItems = [
    { page: "dashboard", label: "Overview", icon: LayoutDashboard, roles: ["citizen"] },
    { page: "admin-console", label: "Admin Console", icon: Shield, roles: ["admin"] },
    { page: "registry", label: "Report Registry", icon: Database, roles: ["citizen", "admin"] },
    { page: "profile", label: "My Impact & Profile", icon: User, roles: ["citizen"] },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col relative antialiased">
      
      {/* Demo Switcher Quick Access floating badge in header */}
      <div className="absolute top-2.5 right-4 z-50 flex items-center space-x-2">
        <button
          onClick={toggleDemoRole}
          className="bg-slate-900/90 text-white text-[10px] font-black tracking-wider px-3 py-1.5 rounded-full shadow-lg hover:bg-slate-800 transition flex items-center space-x-1 border border-slate-700 pointer-events-auto"
          title="Switch instantly between Citizen and Municipal Admin Portal"
        >
          <RefreshCw className="w-3 h-3 text-blue-400 animate-spin" />
          <span>SWAP ROLE (DEMO)</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activePage === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <LandingPage
              onGetStarted={() => setActivePage("login")}
              onExplorePublic={() => {
                // Initialize default user if exploring public dashboard directly
                setCurrentUser(initialCitizen);
                setActivePage("registry");
              }}
            />
          </motion.div>
        )}

        {activePage === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <LoginScreen
              onLoginSuccess={handleLoginSuccess}
              onBackToLanding={() => setActivePage("landing")}
            />
          </motion.div>
        )}

        {/* Authenticated Workspace Shell */}
        {activePage !== "landing" && activePage !== "login" && currentUser && (
          <div className="flex-1 flex overflow-hidden h-screen relative">
            
            {/* Sidebar Left Navigation */}
            <aside 
              className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-white flex flex-col border-r border-slate-800 transition-transform lg:static lg:translate-x-0 ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              {/* Sidebar Header Logo */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-900 shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm text-white">
                    CS
                  </div>
                  <span className="text-lg font-bold tracking-tight">CivicSphere</span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Identity Indicator */}
              <div className="px-5 py-4 border-b border-slate-900 bg-slate-900/20 space-y-2 text-left shrink-0">
                <div className="flex items-center space-x-3">
                  <img 
                    src={currentUser.avatar} 
                    alt="avatar" 
                    className="w-10 h-10 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[120px]">{currentUser.name}</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      {currentUser.role === "admin" ? "Ward Admin" : "Citizen"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sidebar Menu Items */}
              <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
                {menuItems
                  .filter((item) => item.roles.includes(currentUser.role))
                  .map((item) => {
                    const isSelected = activePage === item.page;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.page}
                        onClick={() => {
                          setActivePage(item.page as ActivePage);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center px-4 py-2.5 text-xs font-bold rounded-xl transition ${
                          isSelected 
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                            : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                        }`}
                        id={`btn-nav-${item.page}`}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </button>
                    );
                  })}
              </nav>

              {/* Bottom sidebar actions */}
              <div className="p-4 border-t border-slate-900 shrink-0 space-y-3">
                {currentUser.role === "citizen" && (
                  <button
                    onClick={() => {
                      setActivePage("report-form");
                      setIsSidebarOpen(false);
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/15 flex items-center justify-center cursor-pointer"
                    id="btn-sidebar-quick-report"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" /> Report Civic Issue
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition"
                  id="btn-sidebar-logout"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            </aside>

            {/* Main Content Workspace Container */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              
              {/* Header Bar */}
              <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-30">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-50"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <div className="hidden lg:flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>HSR Ward 174 Command HQ</span>
                  </div>
                </div>

                {/* Header right icons */}
                <div className="flex items-center space-x-4 pr-32">
                  
                  {/* Language selection */}
                  <div className="relative">
                    <button
                      onClick={() => setShowLangDropdown(!showLangDropdown)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/50 flex items-center space-x-1.5"
                    >
                      <Languages className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dashboardLang}</span>
                    </button>
                    {showLangDropdown && (
                      <div className="absolute right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-40 w-36 text-xs text-slate-700 font-semibold space-y-1 text-left">
                        {["English", "ಕನ್ನಡ (Kan)", "हिन्दी (Hin)", "தமிழ் (Tam)"].map((lang) => (
                          <button
                            key={lang}
                            onClick={() => {
                              setDashboardLang(lang);
                              setShowLangDropdown(false);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg"
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Profile avatar shortcut */}
                  <button 
                    onClick={() => {
                      if (currentUser.role === "citizen") setActivePage("profile");
                    }}
                    className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <img 
                      src={currentUser.avatar} 
                      alt="avatar" 
                      className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                    />
                    <span className="hidden sm:inline">{currentUser.name.split(" ")[0]}</span>
                  </button>
                </div>
              </header>

              {/* Sub Pages viewport flow */}
              <main className="flex-1 overflow-y-auto p-6 lg:p-8 no-scrollbar bg-slate-50">
                <AnimatePresence mode="wait">
                  {activePage === "dashboard" && (
                    <motion.div
                      key="dashboard"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.15 }}
                    >
                      <CitizenDashboard
                        user={currentUser}
                        complaints={complaints}
                        onSelectComplaint={inspectComplaint}
                        onNavigateToReport={() => setActivePage("report-form")}
                      />
                    </motion.div>
                  )}

                  {activePage === "admin-console" && (
                    <motion.div
                      key="admin"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.15 }}
                    >
                      <AdminConsole
                        adminUser={currentUser}
                        complaints={complaints}
                        onUpdateComplaintStatus={handleUpdateStatus}
                        onUpdateComplaintPriority={handleUpdatePriority}
                        onSelectComplaint={inspectComplaint}
                      />
                    </motion.div>
                  )}

                  {activePage === "registry" && (
                    <motion.div
                      key="registry"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ReportRegistry
                        complaints={complaints}
                        onSelectComplaint={inspectComplaint}
                        onUpvote={handleUpvote}
                      />
                    </motion.div>
                  )}

                  {activePage === "report-form" && (
                    <motion.div
                      key="report-form"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ReportForm
                        user={currentUser}
                        onSubmitReport={handleCreateReport}
                        onCancel={() => setActivePage("dashboard")}
                      />
                    </motion.div>
                  )}

                  {activePage === "details" && selectedComplaint && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ComplaintDetails
                        complaint={selectedComplaint}
                        onBack={() => {
                          if (currentUser.role === "admin") {
                            setActivePage("admin-console");
                          } else {
                            setActivePage("dashboard");
                          }
                        }}
                        onUpvote={handleUpvote}
                      />
                    </motion.div>
                  )}

                  {activePage === "profile" && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.15 }}
                    >
                      <CitizenProfile user={currentUser} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
