"use client";
import React, { useState, useEffect } from "react";
import { Search, ShoppingBag, ShieldCheck, Tag, Filter, SlidersHorizontal, ArrowRight, Sparkles, CheckCircle2, Star, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import OrderReceiptModal from "@/components/OrderReceiptModal";
import CustomerOrders from "@/components/CustomerOrders";
import AdminStudio from "@/components/AdminStudio";
import AuthModal from "@/components/AuthModal";
import Toast from "@/components/Toast";

export default function Home() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("store"); // "store" | "orders" | "admin"
  const [products, setProducts] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Modals
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [receiptOrder, setReceiptOrder] = useState(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("token") ? localStorage.getItem("user") : null;
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }

    const savedCart = localStorage.getItem("apex_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem("apex_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      fetchCustomerOrders();
    } else {
      setCustomerOrders([]);
    }
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (sortBy) params.append("sort", sortBy);
      if (inStockOnly) params.append("inStock", "true");

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, sortBy, inStockOnly]);

  const fetchCustomerOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomerOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Orders error:", err);
    }
  };

  // Cart operations
  const handleAddToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`Added "${product.title}" to cart!`, "success");
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast("Item removed from cart.", "info");
  };

  // Quick Demo Login
  const handleQuickLogin = async (role) => {
    try {
      const email = role === "admin" ? "admin@apexcommerce.com" : "customer@apexcommerce.com";
      const password = role === "admin" ? "Admin@123" : "Customer@123";

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Demo login failed.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      showToast(`Logged in as ${data.user.name}!`, "success");

      if (data.user.role === "admin") {
        setActiveTab("admin");
      } else {
        setActiveTab("store");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setActiveTab("store");
    showToast("Signed out successfully.", "info");
  };

  const categories = [
    "All",
    "Enterprise Computing",
    "Audio & Acoustics",
    "Optics & Imaging",
    "Executive Workspace",
    "Luxury Horology"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Navbar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={(m) => { setAuthMode(m); setAuthOpen(true); }}
        onLogout={handleLogout}
        onQuickLogin={handleQuickLogin}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* CUSTOMER ORDERS TAB */}
        {activeTab === "orders" && user && (
          <CustomerOrders
            orders={customerOrders}
            onOpenReceipt={(ord) => setReceiptOrder(ord)}
            onExploreProducts={() => setActiveTab("store")}
          />
        )}

        {/* ADMIN STUDIO TAB */}
        {activeTab === "admin" && user?.role === "admin" && (
          <AdminStudio
            products={products}
            onRefreshProducts={fetchProducts}
          />
        )}

        {/* STOREFRONT CATALOG TAB */}
        {activeTab === "store" && (
          <div className="space-y-10">
            {/* Enterprise Hero Banner */}
            <section className="relative rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-emerald-950/40 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cognevance Level 3 — Enterprise Platform</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Next-Gen Enterprise Procurement &{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                    Predictive Analytics
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Engineered for institutional technology, executive workstations, and premium audio-visual assets with integrated payment gateways and real-time fulfillment telemetry.
                </p>

                {/* Promo Code Banner Box */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-emerald-500/40 flex items-center gap-2 text-xs">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-400">Limited Promo:</span>
                    <strong className="text-emerald-300 font-mono tracking-wider">COGNEVANCE20</strong>
                    <span className="text-slate-400">(20% Off Checkout)</span>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> 100% Secure Gateway
                  </span>
                </div>
              </div>
            </section>

            {/* Filters Bar */}
            <section className="space-y-4">
              {/* Search & In-stock toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by product name, SKU, or specs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 shadow-md"
                  />
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
                    />
                    <span>In Stock Only</span>
                  </label>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="popular">Best Selling</option>
                    <option value="rating">Top Rated</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newly Listed</option>
                  </select>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            {/* Products Grid */}
            <section>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="rounded-3xl bg-slate-900/60 border border-slate-800 h-96 animate-pulse p-4" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-2">
                  <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                  <h3 className="text-base font-bold text-white">No products found</h3>
                  <p className="text-xs text-slate-500">Try adjusting your keyword search or category filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={(p) => handleAddToCart(p, 1)}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 mt-16 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">ApexCommerce — Enterprise & Analytics Platform</p>
              <p className="text-[11px] text-slate-500">Cognevance Technologies Full Stack Task Level 3</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <span>Next.js 16</span>
            <span>•</span>
            <span>React 19</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Payment Gateway & Analytics</span>
          </div>

          <p>© 2026 Shahnawaz Khan. All rights reserved.</p>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
        onSuccess={(newUser, token, msg) => {
          setUser(newUser);
          showToast(msg, "success");
          fetchCustomerOrders();
        }}
      />

      {/* 2. Product Quick View Modal */}
      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={(p, qty) => handleAddToCart(p, qty)}
        />
      )}

      {/* 3. Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={(data) => {
          if (!user) {
            setAuthMode("login");
            setAuthOpen(true);
            showToast("Please sign in or use demo login to checkout.", "info");
            return;
          }
          setCartOpen(false);
          setCheckoutData(data);
        }}
      />

      {/* 4. Checkout Modal */}
      {checkoutData && (
        <CheckoutModal
          isOpen={!!checkoutData}
          checkoutData={checkoutData}
          user={user}
          onClose={() => setCheckoutData(null)}
          onOrderPlaced={(newOrder) => {
            setCart([]);
            setReceiptOrder(newOrder);
            fetchCustomerOrders();
            fetchProducts();
            showToast("🎉 Order placed & payment confirmed!", "success");
          }}
        />
      )}

      {/* 5. Order Receipt Modal */}
      {receiptOrder && (
        <OrderReceiptModal
          order={receiptOrder}
          onClose={() => setReceiptOrder(null)}
          onViewAllOrders={() => {
            setReceiptOrder(null);
            setActiveTab("orders");
          }}
        />
      )}

      {/* Toast Alert */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
