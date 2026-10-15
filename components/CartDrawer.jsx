"use client";
import React, { useState } from "react";
import { X, Trash2, ArrowRight, Tag, ShieldCheck, ShoppingBag } from "lucide-react";

export default function CartDrawer({
  isOpen,
  cart = [],
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) {
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const discount = appliedCoupon === "COGNEVANCE20"
    ? Math.round(subtotal * 0.20 * 100) / 100
    : 0;

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.08 * 100) / 100;
  const total = Math.round((taxableAmount + tax) * 100) / 100;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    if (couponInput.trim().toUpperCase() === "COGNEVANCE20") {
      setAppliedCoupon("COGNEVANCE20");
    } else {
      setCouponError("Invalid promo code. Try 'COGNEVANCE20'");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Your Procurement Cart</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {cart.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-slate-500 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto text-slate-600" />
                <p className="text-sm font-semibold text-slate-400">Your cart is empty</p>
                <p className="text-xs text-slate-500">Explore our enterprise products and add items to begin procurement.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-900 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                    <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                      ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-slate-800 rounded-lg bg-slate-900 text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-white font-bold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-slate-950/80 space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Promo: COGNEVANCE20"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs uppercase placeholder:normal-case focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-[11px] text-emerald-400 font-semibold">✓ 20% Discount Code Applied!</p>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-400">{couponError}</p>
                )}
              </form>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount (20%)</span>
                    <span>-${discount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-white">${tax.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white border-t border-slate-800/80 pt-2">
                  <span>Grand Total</span>
                  <span className="text-emerald-400 text-base">${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => onProceedToCheckout({ cart, subtotal, discount, tax, total, appliedCoupon })}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceed to Enterprise Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
