"use client";
import React from "react";
import { Star, ShoppingBag, Eye, Check, ShieldCheck } from "lucide-react";

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView
}) {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 text-[10px] font-bold tracking-wide rounded-lg bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
            {product.category}
          </span>
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-rose-950/80 backdrop-blur-md text-rose-300 border border-rose-500/40">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-lg backdrop-blur-md border ${
            product.stock > 10
              ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/30"
              : product.stock > 0
              ? "bg-amber-950/80 text-amber-300 border-amber-500/30"
              : "bg-rose-950/80 text-rose-300 border-rose-500/30"
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>

        {/* Floating Quick View button on hover */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
          title="Quick View Specs"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5">
        <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
          SKU: {product.sku}
        </span>
        <h3
          onClick={() => onQuickView(product)}
          className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2 mt-1 cursor-pointer"
        >
          {product.title}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <div className="flex text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
          </div>
          <span className="text-white font-bold">{product.rating}</span>
          <span className="text-slate-500 text-[11px]">({product.reviewsCount} reviews)</span>
        </div>

        {/* Pricing */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-white">
            ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-500 line-through">
              ${product.originalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-1">
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-40"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{product.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
