import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
    }

    const db = readDb();
    const products = db.products || [];
    const orders = db.orders || [];
    const customers = db.users.filter((u) => u.role === "customer");

    // 1. Calculate Revenue & Profit
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const estimatedCost = totalRevenue * 0.42; // estimated COGS 42%
    const grossProfit = totalRevenue - estimatedCost;
    const aov = orders.length > 0 ? totalRevenue / orders.length : 0;

    // 2. Category Distribution
    const categoryRevenue = {};
    orders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const prod = products.find((p) => p.id === item.productId);
        const cat = prod?.category || "Other";
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + (item.price * item.quantity);
      });
    });

    // 3. Top Selling Products
    const topProducts = [...products]
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        sku: p.sku,
        title: p.title,
        category: p.category,
        price: p.price,
        salesCount: p.salesCount || 0,
        stock: p.stock,
        revenue: (p.salesCount || 0) * p.price
      }));

    // 4. Fulfillment Status Breakdown
    const fulfillmentStats = {
      Processing: orders.filter((o) => o.fulfillmentStatus === "Processing").length,
      Shipped: orders.filter((o) => o.fulfillmentStatus === "Shipped").length,
      Delivered: orders.filter((o) => o.fulfillmentStatus === "Delivered").length
    };

    return NextResponse.json({
      kpis: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        grossProfit: Math.round(grossProfit * 100) / 100,
        totalOrders: orders.length,
        averageOrderValue: Math.round(aov * 100) / 100,
        totalCustomers: customers.length,
        conversionRate: "3.8%",
        returnOnAdSpend: "4.2x"
      },
      categoryRevenue,
      topProducts,
      fulfillmentStats,
      recentOrders: orders.slice(0, 8),
      notifications: db.notifications || []
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to generate analytics." }, { status: 500 });
  }
}
