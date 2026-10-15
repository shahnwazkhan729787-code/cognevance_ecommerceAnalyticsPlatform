"use client";
import React, { useState } from "react";
import { X, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";

export default function AuthModal({
  isOpen,
  initialMode = "login",
  onClose,
  onSuccess
}) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "login" ? { email, password } : { name, email, password, role };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onSuccess(data.user, data.token, mode === "login" ? "Logged in successfully!" : "Account created successfully!");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-white">
            {mode === "login" ? "Sign In to ApexCommerce" : "Create Enterprise Account"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === "login"
              ? "Access your corporate orders, invoices & tracking"
              : "Experience institutional-grade hardware & lifestyle procurement"}
          </p>

          <div className="flex bg-slate-950 p-1 rounded-xl mt-4 border border-slate-800">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === "login" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === "register" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Quick Demo Autofill */}
        <div className="mb-4 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Demo Autofill:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail("customer@apexcommerce.com");
                setPassword("Customer@123");
                setMode("login");
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-indigo-600 text-indigo-300 font-medium"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("admin@apexcommerce.com");
                setPassword("Admin@123");
                setMode("login");
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-600 text-emerald-300 font-medium"
            >
              Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Arun Verma (CTO)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    role === "customer"
                      ? "border-indigo-500 bg-indigo-950/40 text-indigo-300"
                      : "border-slate-800 bg-slate-950 text-slate-400"
                  }`}
                >
                  🛒 Enterprise Buyer
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    role === "admin"
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-300"
                      : "border-slate-800 bg-slate-950 text-slate-400"
                  }`}
                >
                  👑 Platform Admin
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
