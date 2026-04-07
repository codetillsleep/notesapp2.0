"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Lock,
  Mail,
  User as UserIcon,
  Github,
  Loader2,
} from "lucide-react";

export default function SignupPage() {
  const { status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Detect theme
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

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      // Auto-login after successful signup
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setLoading(false);

      if (loginRes?.error) {
        alert("Account created! Please login.");
        router.push("/login");
      } else {
        router.push("/");
      }
    } catch (error) {
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  };

  if (status === "loading") {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDark ? "bg-[#0a0d1a]" : "bg-white"}`}
      >
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-500 ${
        isDark ? "bg-[#0a0d1a]" : "bg-white"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? "#6366f1" : "#a5b4fc"} 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main Card Container */}
      <div className="relative w-full max-w-lg animate-fadeIn">
        {/* Signup Card */}
        <div
          className={`relative p-8 rounded-3xl backdrop-blur-xl shadow-2xl transition-all duration-300 ${
            isDark
              ? "bg-white/5 border border-white/10"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="relative space-y-6">
            {/* Logo & Title */}
            <div className="text-center space-y-3 animate-slideDown">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-2xl">10</span>
                </div>
              </div>

              <h1
                className={`text-3xl md:text-4xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Create Account
              </h1>
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Start your learning journey today
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 animate-slideUp">
              {/* Name Input */}
              <div className="relative group">
                <label
                  className={`block text-xs font-semibold mb-2 ${
                    isDark ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    } group-focus-within:text-indigo-500`}
                  />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-all duration-200 ${
                      isDark
                        ? "bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-indigo-500/50"
                        : "bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-500/50"
                    }`}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="relative group">
                <label
                  className={`block text-xs font-semibold mb-2 ${
                    isDark ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    } group-focus-within:text-indigo-500`}
                  />
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-all duration-200 ${
                      isDark
                        ? "bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-indigo-500/50"
                        : "bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-500/50"
                    }`}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <label
                  className={`block text-xs font-semibold mb-2 ${
                    isDark ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    } group-focus-within:text-indigo-500`}
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-all duration-200 ${
                      isDark
                        ? "bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-indigo-500/50"
                        : "bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-500/50"
                    }`}
                  />
                </div>
              </div>

              {/* Signup Button */}
              <button
                onClick={handleSignup}
                disabled={loading}
                className={`w-full mt-2 py-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  loading
                    ? isDark
                      ? "bg-white/5 text-gray-600 cursor-not-allowed"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl hover:scale-105"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Sign Up
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div
                  className={`w-full border-t ${isDark ? "border-white/10" : "border-gray-200"}`}
                ></div>
              </div>
              <div className="relative flex justify-center">
                <span
                  className={`px-3 text-xs font-medium ${
                    isDark
                      ? "bg-[#0a0d1a] text-gray-500"
                      : "bg-white text-gray-500"
                  }`}
                >
                  Or sign up with
                </span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google */}
              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className={`group relative overflow-hidden px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                    : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                }`}
              >
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
                onClick={() => signIn("github", { callbackUrl: "/" })}
                className={`group relative overflow-hidden px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                    : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="relative flex items-center justify-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </span>
              </button>
            </div>

            {/* Login Link */}
            <p
              className={`text-center text-sm pt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Already have an account?{" "}
              <a
                href="/login"
                className={`font-semibold hover:underline transition-colors ${
                  isDark
                    ? "text-indigo-400 hover:text-indigo-300"
                    : "text-indigo-600 hover:text-indigo-500"
                }`}
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
