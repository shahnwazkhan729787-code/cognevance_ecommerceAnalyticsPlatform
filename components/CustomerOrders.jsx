"use client";
import React from "react";
import { Package, Truck, CheckCircle2, Clock, Eye, ShoppingBag, ArrowRight } from "lucide-react";

export default function CustomerOrders({
  orders = [],
  onOpenReceipt,
  onExploreProducts
}) {
  const statusColors = {
    Processing: "bg-amber-950 text-amber-400 border-amber-800",
    Shipped: "bg-indigo-950 text-indigo-400 border-indigo-800",
    Delivered: "bg-emerald-950 text-emerald-400 border-emerald-800",
    Cancelled: "bg-rose-950 text-rose-400 border-rose-800"
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Customer Procurement & Orders</h1>
          <p className="text-xs text-slate-400 mt-1">Track enterprise hardware shipments, payment receipts, and delivery statuses.</p>
        </div>
        <button
          onClick={onExploreProducts}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Procure New Items</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900/40 border border-slate-800 p-6 space-y-3">
          <Package className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No orders placed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse our enterprise product collection and place your first procurement order with simulated instant checkout.
          </p>
          <button
            onClick={onExploreProducts}
            className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
          >
            Explore Storefront
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-all"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-extrabold text-white">Order #{order.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusColors[order.fulfillmentStatus] || statusColors.Processing}`}>
                    {order.fulfillmentStatus}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                      <img src={item.thumbnail} alt={item.title} className="w-7 h-7 rounded-lg object-cover" />
                      <span className="text-slate-300 font-medium line-clamp-1 max-w-[140px]">{item.title}</span>
                      <span className="text-slate-500 text-[10px]">×{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-slate-400 flex flex-wrap gap-4 pt-1">
                  <span>Tracking: <strong className="text-indigo-400 font-mono">{order.trackingNumber}</strong></span>
                  <span>Payment: <strong className="text-white">{order.paymentMethod}</strong></span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-800 gap-2 shrink-0">
                <span className="text-2xl font-extrabold text-emerald-400">
                  ${order.total?.toFixed(2)}
                </span>
                <button
                  onClick={() => onOpenReceipt(order)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Invoice</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
