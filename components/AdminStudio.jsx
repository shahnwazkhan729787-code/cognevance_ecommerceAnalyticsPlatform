"use client";
import React, { useState, useEffect } from "react";
import { Plus, DollarSign, Package, TrendingUp, Users, BarChart3, Search, Trash2, Edit3, UploadCloud, CheckCircle2, ShieldCheck, Mail, ArrowUpRight } from "lucide-react";

export default function AdminStudio({
  products = [],
  onRefreshProducts
}) {
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Product Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSku, setNewSku] = useState("");
  const [newCategory, setNewCategory] = useState("Enterprise Computing");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("15");
  const [newThumbnail, setNewThumbnail] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, [products]);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const [resAnalytics, resOrders] = await Promise.all([
        fetch("/api/admin/analytics", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (resAnalytics.ok) {
        const data = await resAnalytics.json();
        setAnalytics(data);
      }
      if (resOrders.ok) {
        const ordData = await resOrders.json();
        setOrders(ordData.orders || []);
      }
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, fulfillmentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ fulfillmentStatus })
      });

      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error("Order status update failed:", err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to remove this product?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        onRefreshProducts();
      }
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  const handleSimulateCloudUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ image: file.name, name: file.name })
      });

      const data = await res.json();
      if (res.ok) {
        setNewThumbnail(data.url);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!newTitle.trim() || !newPrice) {
      setFormError("Title and price are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          sku: newSku || `APX-${Date.now().toString().slice(-6)}`,
          title: newTitle,
          category: newCategory,
          price: parseFloat(newPrice),
          stock: parseInt(newStock, 10),
          thumbnail: newThumbnail || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
          description: newDescription || "High reliability enterprise product."
        })
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to create product.");
      }

      setAddModalOpen(false);
      onRefreshProducts();
      // Reset form
      setNewTitle("");
      setNewPrice("");
      setNewThumbnail("");
      setNewDescription("");
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 shadow-2xl">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            Enterprise Admin Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Executive Analytics & Operations
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time financial telemetry, product inventory controls, payment gateway metrics, and fulfillment tracking.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Enterprise SKU</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">
            ${analytics?.kpis?.totalRevenue?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "0.00"}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Gross sales volume</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Net Profit (Est.)</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-black text-white">
            ${analytics?.kpis?.grossProfit?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "0.00"}
          </p>
          <span className="text-[10px] text-emerald-400 mt-1 block">58% Gross Margin</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Orders</span>
            <Package className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-white">
            {analytics?.kpis?.totalOrders || orders.length}
          </p>
          <span className="text-[10px] text-cyan-400 mt-1 block">Avg. Order: ${analytics?.kpis?.averageOrderValue || 0}</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">ROAS / Marketing</span>
            <BarChart3 className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400">
            {analytics?.kpis?.returnOnAdSpend || "4.2x"}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">{analytics?.kpis?.conversionRate || "3.8%"} Conversion</span>
        </div>
      </div>

      {/* Top Selling Products & Category Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Products Leaderboard */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Top 5 Best-Selling Products</h3>
            <span className="text-xs text-slate-500">By Sales Volume</span>
          </div>

          <div className="space-y-3">
            {analytics?.topProducts?.map((p, idx) => (
              <div key={p.id} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[10px]">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-white line-clamp-1">{p.title}</p>
                    <span className="text-[10px] text-slate-500">{p.sku} • {p.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">${p.price?.toFixed(2)}</p>
                  <span className="text-[10px] text-slate-400">{p.salesCount} sold</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Revenue Distribution */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Category Revenue Share</h3>
            <span className="text-xs text-slate-500">Procurement Distribution</span>
          </div>

          <div className="space-y-3">
            {analytics?.categoryRevenue && Object.entries(analytics.categoryRevenue).map(([cat, rev]) => (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{cat}</span>
                  <span className="text-emerald-400">${rev.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full"
                    style={{ width: `${Math.min(100, (rev / (analytics?.kpis?.totalRevenue || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Fulfillment Management Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Order Fulfillment & Logistics</h3>
            <p className="text-xs text-slate-400">Change shipment statuses and inspect customer addresses</p>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
            {orders.length} Total Orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] font-bold text-slate-400 uppercase bg-slate-950/60 border-y border-slate-800">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Items</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-4">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-400">#{ord.id}</td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-white">{ord.customerName}</p>
                    <span className="text-[10px] text-slate-500">{ord.customerEmail}</span>
                  </td>
                  <td className="py-3 px-3">{ord.items?.length || 0} line items</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">${ord.total?.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={ord.fulfillmentStatus}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                      className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Catalog Inventory Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Product Inventory & SKUs</h3>
            <p className="text-xs text-slate-400">Manage stock quantities, prices, and catalog publication</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] font-bold text-slate-400 uppercase bg-slate-950/60 border-y border-slate-800">
              <tr>
                <th className="py-3 px-4">SKU / Product</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Stock Level</th>
                <th className="py-3 px-3">Units Sold</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={p.thumbnail} alt={p.title} className="w-9 h-9 rounded-xl object-cover bg-slate-950" />
                    <div>
                      <p className="font-bold text-white line-clamp-1">{p.title}</p>
                      <span className="text-[10px] font-mono text-slate-500">{p.sku}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{p.category}</td>
                  <td className="py-3 px-3 font-bold text-white">${p.price.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.stock > 10 ? "text-emerald-400 bg-emerald-950/60" : "text-amber-400 bg-amber-950/60"
                    }`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-3">{p.salesCount || 0}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900 border border-rose-800/40"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal (Cloud Upload + Form) */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create & Publish Enterprise SKU</h3>
              <button onClick={() => setAddModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/60 text-rose-200 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nvidia H100 Tensor Core GPU Workstation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Enterprise Computing">Enterprise Computing</option>
                    <option value="Audio & Acoustics">Audio & Acoustics</option>
                    <option value="Optics & Imaging">Optics & Imaging</option>
                    <option value="Executive Workspace">Executive Workspace</option>
                    <option value="Luxury Horology">Luxury Horology</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">SKU</label>
                  <input
                    type="text"
                    placeholder="APX-GPU-01"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="2999"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Stock</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              {/* Cloud Image Upload */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Product Image (Cloud Storage / URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newThumbnail}
                    onChange={(e) => setNewThumbnail(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer flex items-center gap-1.5 shrink-0">
                    <UploadCloud className="w-4 h-4 text-emerald-400" />
                    <span>{uploadingImage ? "Uploading..." : "Upload File"}</span>
                    <input type="file" accept="image/*" onChange={handleSimulateCloudUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Enterprise product specifications and deliverables..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Publish SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
