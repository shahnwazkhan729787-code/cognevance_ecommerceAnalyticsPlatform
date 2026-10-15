import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getInitialData = () => {
  const salt = bcrypt.genSaltSync(10);
  const adminPassword = bcrypt.hashSync("Admin@123", salt);
  const customerPassword = bcrypt.hashSync("Customer@123", salt);

  return {
    users: [
      {
        id: "usr_admin_01",
        name: "Shahnawaz (Admin Executive)",
        email: "admin@apexcommerce.com",
        password: adminPassword,
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        createdAt: "2026-01-01T00:00:00.000Z"
      },
      {
        id: "usr_cust_01",
        name: "Arun Verma (Enterprise Client)",
        email: "customer@apexcommerce.com",
        password: customerPassword,
        role: "customer",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        createdAt: "2026-01-15T10:00:00.000Z"
      }
    ],
    products: [
      {
        id: "prd_1",
        sku: "APX-MBP-16",
        title: "MacBook Pro 16\" M3 Max (64GB / 2TB SSD)",
        category: "Enterprise Computing",
        price: 3499.00,
        originalPrice: 3899.00,
        stock: 24,
        rating: 4.9,
        reviewsCount: 320,
        salesCount: 142,
        thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
        shortDescription: "Extreme performance workstation with 16-core CPU, 40-core GPU, and Liquid Retina XDR display.",
        description: "Engineered for high-throughput software development, 3D rendering, and enterprise AI workflows. Features up to 22 hours of battery life and studio-quality mics.",
        specs: {
          "Processor": "Apple M3 Max (16-core)",
          "Memory": "64GB Unified RAM",
          "Storage": "2TB PCIe NVMe SSD",
          "Display": "16.2-inch Liquid Retina XDR 120Hz"
        },
        createdAt: "2026-01-10T10:00:00.000Z"
      },
      {
        id: "prd_2",
        sku: "APX-SNY-XM5",
        title: "Sony WH-1000XM5 Noise-Cancelling Studio Headphones",
        category: "Audio & Acoustics",
        price: 399.99,
        originalPrice: 449.99,
        stock: 58,
        rating: 4.8,
        reviewsCount: 540,
        salesCount: 310,
        thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        shortDescription: "Industry-leading noise cancellation with dual Auto NC Optimizer and 30-hour battery life.",
        description: "Two processors and 8 microphones deliver unprecedented noise cancellation and crystal clear hands-free calling for remote enterprise executives.",
        specs: {
          "Battery Life": "Up to 30 Hours",
          "Driver Unit": "30mm Precision Engineered",
          "Connectivity": "Bluetooth 5.2 / LDAC",
          "Weight": "250g Ultra-lightweight"
        },
        createdAt: "2026-01-12T10:00:00.000Z"
      },
      {
        id: "prd_3",
        sku: "APX-LCA-Q3",
        title: "Leica Q3 Full-Frame 60MP Compact Camera",
        category: "Optics & Imaging",
        price: 5995.00,
        originalPrice: 6200.00,
        stock: 8,
        rating: 5.0,
        reviewsCount: 89,
        salesCount: 45,
        thumbnail: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
        shortDescription: "BSI-CMOS sensor with Triple-Resolution Technology and Summilux 28mm f/1.7 ASPH lens.",
        description: "Unrivaled optics craftsmanship crafted in Germany. Equipped with hybrid autofocus, 8K video recording, and weather-sealed magnesium chassis.",
        specs: {
          "Sensor": "60MP Full-Frame BSI CMOS",
          "Lens": "Summilux 28mm f/1.7 ASPH",
          "Video": "8K @ 30fps / ProRes 422HQ",
          "Viewfinder": "5.76M-Dot OLED EVF"
        },
        createdAt: "2026-01-15T10:00:00.000Z"
      },
      {
        id: "prd_4",
        sku: "APX-HML-AER",
        title: "Herman Miller Aeron Remastered Ergonomic Chair",
        category: "Executive Workspace",
        price: 1695.00,
        originalPrice: 1850.00,
        stock: 35,
        rating: 4.9,
        reviewsCount: 820,
        salesCount: 220,
        thumbnail: "https://images.unsplash.com/photo-1580481077195-c3a82442436e?w=800&auto=format&fit=crop&q=80",
        shortDescription: "Iconic ergonomic office seating engineered with 8Z Pellicle breathable suspension mesh.",
        description: "The gold standard of ergonomic office furniture. Provides targeted spinal support across eight zones of variable tension for long executive sessions.",
        specs: {
          "Mechanism": "Harmonic 2 Tilt Limiter",
          "Back Support": "PostureFit SL Dual Pads",
          "Warranty": "12-Year Official Manufacturer",
          "Material": "Recycled Ocean-Bound Plastics"
        },
        createdAt: "2026-01-18T10:00:00.000Z"
      },
      {
        id: "prd_5",
        sku: "APX-DJI-INS3",
        title: "DJI Inspire 3 Cinema 8K Drone Cinema Rig",
        category: "Enterprise Computing",
        price: 16499.00,
        originalPrice: 17200.00,
        stock: 5,
        rating: 4.9,
        reviewsCount: 38,
        salesCount: 18,
        thumbnail: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80",
        shortDescription: "Full-frame 8K/75fps ProRes RAW aerial drone with centimeter-level RTK positioning.",
        description: "Industry-standard cinema production UAV. Features dual-control operations, waypoint pro precision trajectory, and omnidirectional obstacle sensing.",
        specs: {
          "Camera": "Zenmuse X9-8K Air Gimbal",
          "Speed": "Up to 94 km/h",
          "Range": "15 km O3 Pro Transmission",
          "Flight Time": "28 Minutes Dual Hot-swap"
        },
        createdAt: "2026-01-20T10:00:00.000Z"
      },
      {
        id: "prd_6",
        sku: "APX-PRX-RLX",
        title: "Rolex Submariner Date 41mm Oystersteel Luxury Timepiece",
        category: "Luxury Horology",
        price: 14250.00,
        originalPrice: 15000.00,
        stock: 12,
        rating: 5.0,
        reviewsCount: 165,
        salesCount: 64,
        thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
        shortDescription: "Unidirectional rotatable Cerachrom bezel with black dial and Chromalight display.",
        description: "The benchmark of divers' watches. Certified Superlative Chronometer with Calibre 3235 automatic movement and 300 meters water resistance.",
        specs: {
          "Calibre": "Rolex 3235 In-House Automatic",
          "Case Diameter": "41 mm Oystersteel",
          "Power Reserve": "Approximately 70 Hours",
          "Bezel": "Cerachrom Ceramic 60-Minute Scale"
        },
        createdAt: "2026-01-22T10:00:00.000Z"
      }
    ],
    orders: [
      {
        id: "ord_1001",
        userId: "usr_cust_01",
        customerName: "Arun Verma",
        customerEmail: "customer@apexcommerce.com",
        items: [
          {
            productId: "prd_1",
            title: "MacBook Pro 16\" M3 Max",
            price: 3499.00,
            quantity: 1,
            thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"
          },
          {
            productId: "prd_2",
            title: "Sony WH-1000XM5 Headphones",
            price: 399.99,
            quantity: 2,
            thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
          }
        ],
        subtotal: 4298.98,
        discount: 200.00,
        tax: 327.91,
        total: 4426.89,
        paymentStatus: "Paid",
        paymentMethod: "Stripe Enterprise (Visa •••• 4242)",
        fulfillmentStatus: "Delivered",
        trackingNumber: "APX-FEDEX-98214309",
        shippingAddress: {
          street: "702 Tech Tower, Cyber City",
          city: "Bengaluru",
          state: "KA",
          zip: "560103",
          country: "India"
        },
        createdAt: "2026-02-01T14:30:00.000Z"
      },
      {
        id: "ord_1002",
        userId: "usr_cust_01",
        customerName: "Arun Verma",
        customerEmail: "customer@apexcommerce.com",
        items: [
          {
            productId: "prd_4",
            title: "Herman Miller Aeron Remastered",
            price: 1695.00,
            quantity: 1,
            thumbnail: "https://images.unsplash.com/photo-1580481077195-c3a82442436e?w=800&auto=format&fit=crop&q=80"
          }
        ],
        subtotal: 1695.00,
        discount: 0.00,
        tax: 135.60,
        total: 1830.60,
        paymentStatus: "Paid",
        paymentMethod: "Corporate Wire Transfer",
        fulfillmentStatus: "Shipped",
        trackingNumber: "APX-DHL-55421098",
        shippingAddress: {
          street: "702 Tech Tower, Cyber City",
          city: "Bengaluru",
          state: "KA",
          zip: "560103",
          country: "India"
        },
        createdAt: "2026-02-08T09:15:00.000Z"
      }
    ],
    notifications: [
      {
        id: "notif_1",
        type: "order_confirmation",
        recipient: "customer@apexcommerce.com",
        subject: "Order Confirmation #ORD_1001 — ApexCommerce",
        message: "Your enterprise order #ORD_1001 for $4,426.89 has been confirmed and dispatched.",
        sentAt: "2026-02-01T14:32:00.000Z"
      }
    ]
  };
};

export function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database:", err);
    return getInitialData();
  }
}

export function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing database:", err);
    return false;
  }
}
