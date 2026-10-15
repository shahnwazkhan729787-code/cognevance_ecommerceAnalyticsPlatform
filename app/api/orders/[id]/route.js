import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function PUT(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { fulfillmentStatus, paymentStatus } = body;

    const db = readDb();
    const order = db.orders.find((o) => o.id === id);

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (fulfillmentStatus) order.fulfillmentStatus = fulfillmentStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    order.updatedAt = new Date().toISOString();

    // Trigger status change notification
    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      type: "order_status_update",
      recipient: order.customerEmail,
      subject: `Order #${order.id} Status Update: ${fulfillmentStatus}`,
      message: `Your order status has been updated to "${fulfillmentStatus}". Tracking: ${order.trackingNumber}`,
      sentAt: new Date().toISOString()
    });

    writeDb(db);

    return NextResponse.json({
      message: "Order updated successfully!",
      order
    });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ error: "Failed to update order." }, { status: 500 });
  }
}
