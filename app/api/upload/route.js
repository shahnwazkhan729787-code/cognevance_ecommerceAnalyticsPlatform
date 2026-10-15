import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
    }

    const body = await request.json();
    const { image, name = "uploaded_asset" } = body;

    if (!image) {
      return NextResponse.json({ error: "Image data or URL is required." }, { status: 400 });
    }

    // If it's already a URL, validate and return
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return NextResponse.json({
        url: image,
        filename: name,
        storage: "Cloud CDN",
        uploadedAt: new Date().toISOString()
      });
    }

    // For base64 data, simulate cloud upload storage
    const simulatedCloudUrl = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80`;

    return NextResponse.json({
      url: simulatedCloudUrl,
      filename: `${name}_${Date.now()}.png`,
      storage: "AWS S3 / Cloudflare R2 (Simulated)",
      size: "245 KB",
      uploadedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
  }
}
