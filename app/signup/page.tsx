"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ChevronRight, Github, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  // detect theme
  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    // redirect to login after signup
    router.push("/login");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-900"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            isDark ? "opacity-10" : "opacity-30"
          }`}
          style={{
            animationDuration: "4s",
            backgroundColor: isDark
              ? `rgba(var(--primary-dark), 0.15)`
              : `rgba(var(--primary-light), 0.3)`,
          }}
        />
        <div
          className={`absolute bottom-20 left-20 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
            isDark ? "opacity-10" : "opacity-20"
          }`}
          style={{
            animationDuration: "6s",
            animationDelay: "1s",
            backgroundColor: isDark
              ? `rgba(var(--secondary-dark), 0.15)`
              : `rgba(var(--secondary-light), 0.2)`,
          }}
        />
      </div>

      {/* Main Card Container */}
      <div className="relative w-full max-w-lg animate-fadeIn">
        {/* Signup Card */}
        <div
          className={`relative p-6 md:p-8 rounded-3xl border-2 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
            isDark
              ? "bg-slate-900/70 border-slate-700"
              : "bg-white/90 border-slate-200"
          }`}
        >
          {/* Decorative gradient overlay */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: isDark
                ? `linear-gradient(135deg, rgba(var(--primary-dark), 0.08), rgba(var(--secondary-dark), 0.08))`
                : `linear-gradient(135deg, rgba(var(--primary-light), 0.08), rgba(var(--secondary-light), 0.08))`,
            }}
          />

          <div className="relative space-y-5">
            {/* Logo & Title */}
            <div className="text-center space-y-3 animate-slideDown">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                  <span className="text-white font-bold text-2xl">10</span>
                </div>
              </div>

              <h1
                className={`text-3xl md:text-4xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Create Account
              </h1>
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Join 10GPA and start learning smarter
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-3 animate-slideUp">
              {/* Name Input */}
              <div className="relative group">
                <label
                  className={`block text-xs font-semibold mb-1.5 ml-1 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  FULL NAME
                </label>
                <div className="relative">
                  <User
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    } group-focus-within:text-primary`}
                  />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 font-medium text-sm focus:outline-none focus:ring-4 transition-all duration-300 ${
                      isDark
                        ? "bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/20"
                        : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary/10"
                    }`}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="relative group">
                <label
                  className={`block text-xs font-semibold mb-1.5 ml-1 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  EMAIL
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    } group-focus-within:text-primary`}
                  />
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 font-medium text-sm focus:outline-none focus:ring-4 transition-all duration-300 ${
                      isDark
                        ? "bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/20"
                        : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary/10"
                    }`}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <label
                  className={`block text-xs font-semibold mb-1.5 ml-1 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  PASSWORD
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    } group-focus-within:text-primary`}
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 font-medium text-sm focus:outline-none focus:ring-4 transition-all duration-300 ${
                      isDark
                        ? "bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/20"
                        : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary/10"
                    }`}
                  />
                </div>
              </div>

              {/* Signup Button */}
              <button
                onClick={handleSignup}
                disabled={loading}
                onMouseEnter={() => setIsHovered("signup")}
                onMouseLeave={() => setIsHovered(null)}
                className={`w-full mt-3 py-3.5 rounded-xl font-bold text-sm tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-primary text-white shadow-primary hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    CREATING ACCOUNT...
                  </>
                ) : (
                  <>
                    CREATE ACCOUNT
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div
                  className={`w-full border-t ${isDark ? "border-slate-700" : "border-slate-300"}`}
                ></div>
              </div>
              <div className="relative flex justify-center">
                <span
                  className={`px-3 text-xs font-medium tracking-wider ${
                    isDark
                      ? "bg-gradient-to-br from-slate-900/70 via-slate-900/70 to-slate-900/70 text-slate-500"
                      : "bg-gradient-to-br from-white/90 via-white/90 to-white/90 text-slate-500"
                  }`}
                >
                  OR SIGN UP WITH
                </span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google */}
              <button
                onClick={() => {
                  /* Add Google OAuth */
                }}
                onMouseEnter={() => setIsHovered("google")}
                onMouseLeave={() => setIsHovered(null)}
                className={`group relative overflow-hidden border-2 px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                  isDark
                    ? "bg-slate-900 border-slate-700 text-white hover:border-slate-600"
                    : "bg-white border-slate-300 text-slate-900 hover:border-slate-400"
                }`}
              >
                <div
                  className={`absolute inset-0 transform transition-transform duration-300 ${
                    isDark ? "bg-slate-800" : "bg-slate-100"
                  } ${isHovered === "google" ? "translate-x-0" : "-translate-x-full"}`}
                />
                <span className="relative flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </span>
              </button>

              {/* GitHub */}
              <button
                onClick={() => {
                  /* Add GitHub OAuth */
                }}
                onMouseEnter={() => setIsHovered("github")}
                onMouseLeave={() => setIsHovered(null)}
                className={`group relative overflow-hidden border-2 px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                  isDark
                    ? "bg-slate-900 border-slate-700 text-white hover:border-slate-600"
                    : "bg-white border-slate-300 text-slate-900 hover:border-slate-400"
                }`}
              >
                <div
                  className={`absolute inset-0 transform transition-transform duration-300 ${
                    isDark ? "bg-slate-800" : "bg-slate-100"
                  } ${isHovered === "github" ? "translate-x-0" : "-translate-x-full"}`}
                />
                <span className="relative flex items-center justify-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </span>
              </button>
            </div>

            {/* Login Link */}
            <p
              className={`text-center text-xs pt-2 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Already have an account?{" "}
              <a
                href="/login"
                className="text-primary font-semibold hover:underline transition-colors"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );
}
