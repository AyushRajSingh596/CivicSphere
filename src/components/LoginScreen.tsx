import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import { UserProfile } from "../types";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onBackToLanding: () => void;
}

type AuthMode = "login" | "register";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function LoginScreen({ onLoginSuccess, onBackToLanding }: LoginScreenProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  
  // Login Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register Form States
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in email and password");
      return;
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      let userProfile: UserProfile;

      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          userProfile = userDoc.data() as UserProfile;
        } else {
          const isGov = email.toLowerCase().includes("admin") || email.toLowerCase().includes("gov");
          userProfile = {
            id: user.uid,
            name: email.split("@")[0].split(".").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" "),
            email: email,
            phone: "",
            role: isGov ? "admin" : "citizen",
            city: "Indore",
            avatar: isGov 
              ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
              : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
            points: isGov ? 2450 : 350,
            resolvedCount: isGov ? 32 : 4,
            impactLevel: isGov ? "Municipal Director" : "Active Guardian",
            nextLevelPoints: isGov ? 5000 : 500
          };
          await setDoc(userDocRef, userProfile);
        }
      } catch (dbErr: any) {
        handleFirestoreError(dbErr, OperationType.GET, `users/${user.uid}`);
        const isGov = email.toLowerCase().includes("admin") || email.toLowerCase().includes("gov");
        userProfile = {
          id: user.uid,
          name: email.split("@")[0].split(".").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" "),
          email: email,
          phone: "",
          role: isGov ? "admin" : "citizen",
          city: "Indore",
          avatar: isGov 
            ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
            : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
          points: isGov ? 2450 : 350,
          resolvedCount: isGov ? 32 : 4,
          impactLevel: isGov ? "Municipal Director" : "Active Guardian",
          nextLevelPoints: isGov ? 5000 : 500
        };
      }

      onLoginSuccess(userProfile);
    } catch (error: any) {
      alert(error.message || "Invalid email or password");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFirstName || !regLastName || !regPhone || !regEmail || !regPassword || !agreeTerms) {
      alert("Please complete required fields and accept terms.");
      return;
    }

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      const user = userCredential.user;

      // 2. Create the Firestore user profile
      const userDocRef = doc(db, "users", user.uid);
      const fullName = `${regFirstName} ${regLastName}`.trim();
      const phoneNum = regPhone.startsWith("+91 ") ? regPhone : `+91 ${regPhone}`;

      const isGov = regEmail.toLowerCase().includes("admin") || regEmail.toLowerCase().includes("gov");
      const userProfile: UserProfile = {
        id: user.uid,
        name: fullName,
        email: regEmail,
        phone: phoneNum,
        role: isGov ? "admin" : "citizen",
        city: "Indore",
        avatar: isGov 
          ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
        points: isGov ? 2450 : 350,
        resolvedCount: isGov ? 32 : 4,
        impactLevel: isGov ? "Municipal Director" : "Active Guardian",
        nextLevelPoints: isGov ? 5000 : 500
      };

      try {
        await setDoc(userDocRef, userProfile);
      } catch (dbErr: any) {
        handleFirestoreError(dbErr, OperationType.WRITE, `users/${user.uid}`);
      }

      // 3. Callback onLoginSuccess
      onLoginSuccess(userProfile);
    } catch (error: any) {
      alert(error.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-orange-200 rounded-full blur-[120px]" />
      </div>

      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={onBackToLanding}
          className="flex items-center text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-xl hover:bg-white transition shadow-xs"
          id="btn-back-to-landing"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Landing Page
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center text-white font-black text-2xl tracking-tighter">
            CS
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 font-sans">
          {authMode === "login" ? "Welcome back to CivicSphere" : "Join CivicSphere"}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 max-w-sm mx-auto">
          {authMode === "login" 
            ? "Indian cities' unified platform for transparent, AI-driven public service delivery." 
            : "Contribute to cleaner, safer, and smarter neighborhoods."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          
          <AnimatePresence mode="wait">
            {authMode === "login" ? (
              <motion.div
                key="login-box"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handlePasswordSignIn} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="arjun.sharma@gmail.com"
                        className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="pwd" className="block text-sm font-semibold text-slate-700">
                        Password
                      </label>
                      <a href="#forgot" className="text-xs font-semibold text-blue-600 hover:text-blue-500">
                        Forgot Password?
                      </a>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="password"
                        id="pwd"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                    id="btn-sign-in"
                  >
                    Sign In
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-500">
                    Don't have an account?{" "}
                    <button
                      onClick={() => setAuthMode("register")}
                      className="font-semibold text-blue-600 hover:text-blue-500 cursor-pointer"
                      id="btn-switch-register"
                    >
                      Create Account
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Register Mode form */
              <motion.div
                key="register-box"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="regFirst" className="block text-sm font-semibold text-slate-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="regFirst"
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        placeholder="Arjun"
                        className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="regLast" className="block text-sm font-semibold text-slate-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="regLast"
                        value={regLastName}
                        onChange={(e) => setRegLastName(e.target.value)}
                        placeholder="Sharma"
                        className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="regPhone" className="block text-sm font-semibold text-slate-700 mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 text-sm font-semibold pr-2 border-r border-slate-200 pointer-events-none">+91</span>
                      <input
                        type="tel"
                        id="regPhone"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="98765 43210"
                        className="block w-full pl-16 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="regEmail" className="block text-sm font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="regEmail"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="arjun.sharma@gmail.com"
                      className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="regPwd" className="block text-sm font-semibold text-slate-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="password"
                        id="regPwd"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="h-4.5 w-4.5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded-sm mt-0.5"
                      required
                    />
                    <label htmlFor="terms" className="ml-2.5 text-xs text-slate-500 leading-normal">
                      I agree to the CivicSphere{" "}
                      <a href="#terms" className="text-blue-600 font-semibold hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#privacy" className="text-blue-600 font-semibold hover:underline">
                        Privacy Policy
                      </a>{" "}
                      including sharing approximate GPS location with municipal authorities.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition cursor-pointer"
                    id="btn-submit-register"
                  >
                    Create Account
                  </button>
                </form>

                <div className="text-center pt-2">
                  <p className="text-sm text-slate-500">
                    Already have an account?{" "}
                    <button
                      onClick={() => setAuthMode("login")}
                      className="font-semibold text-blue-600 hover:text-blue-500 cursor-pointer"
                      id="btn-switch-login"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Secure Trust Footnote */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center text-center text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 mr-1.5" />
            Secured by CDAC & National Urban e-Governance Standards.
          </div>
        </div>
      </div>
    </div>
  );
}