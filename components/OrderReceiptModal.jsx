"use client";
import React from "react";
import { X, CheckCircle2, Mail, Printer, Truck, ArrowRight, ShieldCheck, Download } from "lucide-react";

export default function OrderReceiptModal({
  order,
  onClose,
  onViewAllOrders
}) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="text-center pb-6 border-b border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
            Payment Authorized & Confirmed
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            Order #{order.id}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dispatched via Express Courier. Tracking ID: <span className="font-mono text-indigo-400 font-bold">{order.trackingNumber}</span>
          </p>
        </div>

        {/* Email Notification Alert Banner */}
        <div className="mt-4 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center gap-3 text-xs text-indigo-200">
          <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
          <p>
            An official order receipt and invoice was sent to <strong>{order.customerEmail}</strong>.
          </p>
        </div>

        {/* Order Details Body */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Items List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Purchased Line Items ({order.items?.length || 0})
            </h4>
            {order.items?.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-900"
                  />
                  <div>
                    <p className="font-bold text-white line-clamp-1">{item.title}</p>
                    <span className="text-slate-500 text-[10px]">Qty: {item.quantity} × ${item.price}</span>
                  </div>
                </div>
                <span className="font-bold text-white">
                  ${(item.price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>

          {/* Shipping Info */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Shipping Destination:</span>
            <p className="text-white font-medium">
              {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}, {order.shippingAddress?.country}
            </p>
            <p className="text-slate-400 text-[11px] pt-1">
              Method: <strong>{order.paymentMethod}</strong> (Status: <span className="text-emerald-400 font-bold">{order.paymentStatus}</span>)
            </p>
          </div>

          {/* Pricing Breakdown */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 text-slate-400">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="text-white font-semibold">${order.subtotal?.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount Code Applied:</span>
                <span>-${order.discount?.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Taxes (8%):</span>
              <span className="text-white">${order.tax?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-white border-t border-slate-800 pt-2">
              <span>Grand Total:</span>
              <span className="text-emerald-400">${order.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onViewAllOrders();
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <span>View All My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
