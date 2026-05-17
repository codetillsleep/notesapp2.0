"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChevronRight, Lock, Mail, Github, Loader2, UserRound, Sparkles } from "lucide-react";
const currentYear: number = new Date().getFullYear();

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      alert(res.error);
    } else {
      router.push("/");
    }
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    const res = await signIn("credentials", {
      email: "guest@10gpa.in",
      password: "10gpa.in",
      redirect: false,
    });
    setGuestLoading(false);
    if (res?.error) {
      alert("Guest login failed. Please try again.");
    } else {
      router.push("/");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  if (status === "loading") {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-[#080b18]" : "bg-slate-50"}`}>
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex transition-colors duration-500 ${isDark ? "bg-[#080b18]" : "bg-slate-50"}`}
    >
      {/* ── Left Panel (decorative) ── */}
      <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-12 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900" />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(205, 19, 19, 0.3) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Floating blobs */}
        <div className="absolute top-1/4 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10">
          <div className="w-14 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
            <span className="text-white font-black text-sm tracking-tight">10gpa</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-yellow-400" style={{ opacity: 1 - i * 0.15 }} />
              ))}
            </div>
            <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
              Achieve your<br />academic peak.
            </h2>
            
          </div>

          {/* Stats row */}
          
        </div>

        <div className="relative z-10">
          <p className="text-white/30 text-xs">© {currentYear} 10gpa. All rights reserved.</p>
        </div>
      </div>

      {/* ── Right Panel (form) ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md animate-fadeIn">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">10g</span>
            </div>
            <span className={`font-black text-lg ${isDark ? "text-white" : "text-gray-900"}`}>10gpa</span>
          </div>

          {/* Heading */}
          <div className="mb-8 animate-slideDown">
            <h1 className={`text-3xl font-black tracking-tight mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
              Welcome back
            </h1>
            <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              Sign in to continue your learning journey
            </p>
          </div>

          {/* ── Guest Banner ── */}
          <div
            className={`relative mb-6 rounded-2xl p-4 overflow-hidden border animate-slideUp cursor-pointer group transition-all duration-300 ${
              isDark
                ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-400/40"
                : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:border-amber-300"
            }`}
            onClick={!guestLoading ? handleGuestLogin : undefined}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDark ? "bg-amber-500/20" : "bg-amber-100"
                }`}>
                  {guestLoading
                    ? <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                    : <UserRound className="w-5 h-5 text-amber-500" />
                  }
                </div>
                <div>
                  <div className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? "text-amber-300" : "text-amber-700"}`}>
                    Try as Guest
                  </div>
                  <div className={`text-xs ${isDark ? "text-amber-400/60" : "text-amber-600/70"}`}>
                    No account needed — explore instantly
                  </div>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1 ${
                isDark ? "text-amber-400" : "text-amber-600"
              }`} />
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center gap-4 mb-6 animate-slideUp">
            <div className={`flex-1 h-px ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
            <span className={`text-xs font-medium ${isDark ? "text-gray-600" : "text-gray-400"}`}>
              or sign in with email
            </span>
            <div className={`flex-1 h-px ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
          </div>

          {/* ── Form ── */}
          <div className="space-y-4 animate-slideUp">
            {/* Email */}
            <div>
              <label className={`block text-xs font-semibold mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Email address
              </label>
              <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                focusedField === "email"
                  ? "border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                  : isDark ? "border-white/10" : "border-gray-200"
              } ${isDark ? "bg-white/5" : "bg-white"}`}>
                <Mail className={`absolute left-3.5 w-4 h-4 transition-colors ${
                  focusedField === "email" ? "text-indigo-400" : isDark ? "text-gray-600" : "text-gray-400"
                }`} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-transparent focus:outline-none ${
                    isDark ? "text-white placeholder:text-gray-600" : "text-gray-900 placeholder:text-gray-400"
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className={`text-xs font-semibold hover:underline ${
                    isDark ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500"
                  }`}
                >
                  Forgot password?
                </a>
              </div>
              <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                focusedField === "password"
                  ? "border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                  : isDark ? "border-white/10" : "border-gray-200"
              } ${isDark ? "bg-white/5" : "bg-white"}`}>
                <Lock className={`absolute left-3.5 w-4 h-4 transition-colors ${
                  focusedField === "password" ? "text-indigo-400" : isDark ? "text-gray-600" : "text-gray-400"
                }`} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-transparent focus:outline-none ${
                    isDark ? "text-white placeholder:text-gray-600" : "text-gray-900 placeholder:text-gray-400"
                  }`}
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 mt-2 ${
                loading
                  ? isDark ? "bg-white/5 text-gray-600 cursor-not-allowed" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 hover:shadow-[0_8px_24px_rgba(99,102,241,0.4)] active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                <>Sign in <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>

          {/* OAuth */}
          <div className="mt-6 animate-slideUp">
            <p className={`text-xs text-center mb-4 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
              Or continue with
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                    : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                onClick={() => signIn("github", { callbackUrl: "/" })}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                    : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Github className="w-4 h-4" />
                GitHub
              </button>
            </div>
          </div>

          {/* Sign up */}
          <p className={`text-center text-sm mt-8 animate-slideUp ${isDark ? "text-gray-500" : "text-gray-500"}`}>
            New here?{" "}
            <a
              href="/signup"
              className={`font-bold hover:underline ${
                isDark ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500"
              }`}
            >
              Create a free account →
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideDown { animation: slideDown 0.5s ease-out 0.1s both; }
        .animate-slideUp { animation: slideUp 0.6s ease-out 0.2s both; }
      `}</style>
    </div>
  );
}