"use client";
import React, { useState } from "react";
import { X, CreditCard, ShieldCheck, CheckCircle2, Lock, ArrowRight } from "lucide-react";

export default function CheckoutModal({
  isOpen,
  checkoutData,
  user,
  onClose,
  onOrderPlaced
}) {
  const [street, setStreet] = useState("702 Tech Tower, Cyber City");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [zip, setZip] = useState("560103");
  const [country, setCountry] = useState("India");

  const [paymentMethod, setPaymentMethod] = useState("stripe_card");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("892");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !checkoutData) return null;

  const { cart = [], total = 0, discount = 0, appliedCoupon = "" } = checkoutData;

  const handlePay = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to place this order.");
      }

      const payload = {
        items: cart.map((i) => ({ productId: i.id, quantity: i.quantity })),
        shippingAddress: { street, city, state, zip, country },
        paymentMethod: paymentMethod === "stripe_card" ? `Stripe (Visa ending 4242)` : "Corporate Wire Transfer",
        discountCode: appliedCoupon
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Payment processing failed.");
      }

      onOrderPlaced(data.order);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Enterprise Payment Gateway</h3>
              <p className="text-xs text-slate-400">256-Bit SSL Encrypted Checkout</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-200 text-xs">
            {error}
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handlePay} className="mt-4 space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Shipping Address */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. Delivery & Billing Address
            </h4>
            <div className="space-y-2">
              <input
                type="text"
                required
                placeholder="Street Address / Suite"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-indigo-500 focus:outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-indigo-500 focus:outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Postal Code"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-indigo-500 focus:outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              2. Select Payment Method
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("stripe_card")}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all ${
                  paymentMethod === "stripe_card"
                    ? "border-emerald-500 bg-emerald-950/30 text-emerald-300"
                    : "border-slate-800 bg-slate-950 text-slate-400"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Stripe / Corporate Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("wire")}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all ${
                  paymentMethod === "wire"
                    ? "border-indigo-500 bg-indigo-950/30 text-indigo-300"
                    : "border-slate-800 bg-slate-950 text-slate-400"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Bank Wire / Net-30</span>
              </button>
            </div>
          </div>

          {/* Simulated Card Input */}
          {paymentMethod === "stripe_card" && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">
                  Corporate Card Number (Simulated)
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Expiration</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Security CVC</label>
                  <input
                    type="password"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400">Total Charged Amount:</span>
              <p className="text-xl font-extrabold text-emerald-400 mt-0.5">
                ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            {discount > 0 && (
              <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-400 text-[11px] font-bold">
                Saved ${discount.toFixed(2)} with coupon
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? "Authorizing Payment Gateway..." : `Confirm Payment of $${total.toFixed(2)}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
