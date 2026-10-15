"use client";
import React, { useState } from "react";
import { ShoppingBag, BarChart3, Package, Shield, User, LogOut, LogIn, Sparkles, Menu, X } from "lucide-react";

export default function Navbar({
  user,
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onLogout,
  onQuickLogin
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full glass-header bg-[#080c14]/90 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveTab("store")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShoppingBag className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                ApexCommerce
              </span>
              <span className="block text-[10px] font-bold tracking-widest text-emerald-400 uppercase -mt-1">
                Enterprise & Analytics
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("store")}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "store"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>

            {user && (
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === "orders"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>My Orders</span>
              </button>
            )}

            {user?.role === "admin" && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === "admin"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/30"
                    : "text-emerald-400 hover:text-white hover:bg-emerald-950/40"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Analytics & Admin Studio</span>
              </button>
            )}
          </div>

          {/* Right Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Demo:
              </span>
              <button
                onClick={() => onQuickLogin("customer")}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-indigo-600/80 text-indigo-300 font-medium transition-all"
                title="Login as Customer Client"
              >
                Customer
              </button>
              <button
                onClick={() => onQuickLogin("admin")}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-600/80 text-emerald-300 font-medium transition-all"
                title="Login as Admin Executive"
              >
                Admin
              </button>
            </div>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all shadow-md"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 text-slate-950 font-bold text-[10px] flex items-center justify-center shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-indigo-500/40 object-cover"
                  />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                      user.role === "admin" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-indigo-950 text-indigo-300 border border-indigo-800"
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth("login")}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/30 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenCart}
              className="relative p-2 text-slate-300"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
          <div className="flex flex-col gap-1 text-sm font-semibold">
            <button
              onClick={() => { setActiveTab("store"); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left ${activeTab === "store" ? "bg-indigo-600 text-white" : "text-slate-300"}`}
            >
              Storefront
            </button>
            {user && (
              <button
                onClick={() => { setActiveTab("orders"); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl text-left ${activeTab === "orders" ? "bg-indigo-600 text-white" : "text-slate-300"}`}
              >
                My Orders
              </button>
            )}
            {user?.role === "admin" && (
              <button
                onClick={() => { setActiveTab("admin"); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl text-left ${activeTab === "admin" ? "bg-emerald-600 text-white" : "text-emerald-300"}`}
              >
                Analytics & Admin Studio
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Quick Demo:</span>
            <div className="flex gap-2">
              <button
                onClick={() => { onQuickLogin("customer"); setMobileMenuOpen(false); }}
                className="px-2.5 py-1 rounded bg-slate-800 text-indigo-300"
              >
                Customer
              </button>
              <button
                onClick={() => { onQuickLogin("admin"); setMobileMenuOpen(false); }}
                className="px-2.5 py-1 rounded bg-slate-800 text-emerald-300"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
