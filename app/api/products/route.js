import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim();
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "popular";
    const inStock = searchParams.get("inStock");

    const db = readDb();
    let products = [...(db.products || [])];

    if (search) {
      products = products.filter((p) =>
        p.title.toLowerCase().includes(search) ||
        p.sku.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
      );
    }

    if (category && category !== "All") {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (inStock === "true") {
      products = products.filter((p) => p.stock > 0);
    }

    if (sort === "price-asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === "newest") {
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // Default: popular (by salesCount)
      products.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    }

    return NextResponse.json({
      products,
      total: products.length
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json({ error: "Failed to fetch products." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
    }

    const body = await request.json();
    const {
      sku,
      title,
      category,
      price,
      originalPrice,
      stock,
      thumbnail,
      shortDescription,
      description,
      specs = {}
    } = body;

    if (!title || !price || !category) {
      return NextResponse.json({ error: "Title, category, and price are required." }, { status: 400 });
    }

    const db = readDb();
    const newProduct = {
      id: `prd_${Date.now()}`,
      sku: sku?.trim() || `APX-${Date.now().toString().slice(-6)}`,
      title: title.trim(),
      category: category.trim(),
      price: parseFloat(price) || 0,
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price) * 1.15,
      stock: parseInt(stock, 10) || 10,
      rating: 5.0,
      reviewsCount: 0,
      salesCount: 0,
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
      shortDescription: shortDescription || description?.slice(0, 100) + "...",
      description: description || "Enterprise grade product designed for reliability.",
      specs: specs || {},
      createdAt: new Date().toISOString()
    };

    db.products.unshift(newProduct);
    writeDb(db);

    return NextResponse.json({
      message: "Product created successfully!",
      product: newProduct
    }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
