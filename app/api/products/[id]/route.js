import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = readDb();
    const product = db.products.find((p) => p.id === id || p.sku === id);

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const db = readDb();

    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const updated = {
      ...db.products[index],
      ...body,
      id: db.products[index].id,
      updatedAt: new Date().toISOString()
    };

    db.products[index] = updated;
    writeDb(db);

    return NextResponse.json({
      message: "Product updated successfully!",
      product: updated
    });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
    }

    const { id } = await params;
    const db = readDb();

    const exists = db.products.some((p) => p.id === id);
    if (!exists) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    db.products = db.products.filter((p) => p.id !== id);
    writeDb(db);

    return NextResponse.json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }
}
