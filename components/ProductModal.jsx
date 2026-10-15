"use client";
import React, { useState } from "react";
import { X, Star, ShoppingBag, ShieldCheck, Truck, RefreshCw, Check } from "lucide-react";

export default function ProductModal({
  product,
  onClose,
  onAddToCart
}) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-950/80 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="relative md:w-1/2 aspect-square md:aspect-auto bg-slate-950 flex items-center justify-center overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent md:hidden" />
        </div>

        {/* Product Info Column */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {product.sku}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                {product.category}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2 leading-tight">
              {product.title}
            </h2>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-2 text-xs">
              <div className="flex text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <span className="text-white font-bold">{product.rating}</span>
              <span className="text-slate-400">({product.reviewsCount} verified customer ratings)</span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">
                ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-500 line-through">
                  ${product.originalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications Table */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">{key}</span>
                      <span className="font-semibold text-slate-200 mt-0.5 block">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enterprise Guarantees */}
            <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400 border-t border-slate-800 pt-4">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Enterprise SLA</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-indigo-400" />
                <span>Express Courier</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>30-Day Net Terms</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center gap-3">
            <div className="flex items-center border border-slate-800 rounded-xl bg-slate-950">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-slate-400 hover:text-white"
              >
                -
              </button>
              <span className="px-3 py-2 text-xs font-bold text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-2 text-slate-400 hover:text-white"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-40"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add {quantity} to Cart</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
