import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const db = readDb();
    let orders = db.orders || [];

    // If customer, only return their own orders
    if (user.role !== "admin") {
      orders = orders.filter((o) => o.userId === user.id || o.customerEmail === user.email);
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Please sign in to complete checkout." }, { status: 401 });
    }

    const body = await request.json();
    const { items = [], shippingAddress, paymentMethod = "Stripe Credit Card", discountCode = "" } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return NextResponse.json({ error: "Complete shipping address is required." }, { status: 400 });
    }

    const db = readDb();
    let subtotal = 0;
    const orderItems = [];

    // Verify stock and calculate subtotal
    for (const item of items) {
      const product = db.products.find((p) => p.id === item.productId || p.id === item.id);
      if (product) {
        const qty = item.quantity || 1;
        subtotal += product.price * qty;
        product.stock = Math.max(0, product.stock - qty);
        product.salesCount = (product.salesCount || 0) + qty;

        orderItems.push({
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity: qty,
          thumbnail: product.thumbnail
        });
      }
    }

    // Apply coupon discount (e.g. COGNEVANCE20 for 20% off)
    let discount = 0;
    if (discountCode.toUpperCase() === "COGNEVANCE20") {
      discount = Math.round(subtotal * 0.20 * 100) / 100;
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * 0.08 * 100) / 100; // 8% standard tax
    const total = Math.round((taxableAmount + tax) * 100) / 100;

    const orderId = `ord_${Date.now().toString().slice(-6)}`;
    const trackingNumber = `APX-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const newOrder = {
      id: orderId,
      userId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      items: orderItems,
      subtotal,
      discount,
      discountCode: discountCode || null,
      tax,
      total,
      paymentStatus: "Paid",
      paymentMethod,
      fulfillmentStatus: "Processing",
      trackingNumber,
      shippingAddress,
      createdAt: new Date().toISOString()
    };

    db.orders.unshift(newOrder);

    // Simulated Email Notification
    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      type: "order_confirmation",
      recipient: user.email,
      subject: `Order Confirmed #${orderId} — ApexCommerce`,
      message: `Thank you for your order #${orderId}. Total paid: $${total}. Tracking Number: ${trackingNumber}.`,
      sentAt: new Date().toISOString()
    });

    writeDb(db);

    return NextResponse.json({
      message: "Order placed and payment processed successfully!",
      order: newOrder
    }, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to process order." }, { status: 500 });
  }
}
