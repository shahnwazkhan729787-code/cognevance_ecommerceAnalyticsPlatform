# 🛍️ ApexCommerce — Enterprise E-Commerce & Analytics Platform

> **Cognevance Technologies — Full Stack Web Developer Project Task (Level 3: Advanced)**  
> **Repository Name:** `cognevance_ecommerceAnalyticsPlatform`  
> **Developer:** Shahnawaz Khan  
> **Submission Email:** support@cognevance.online  
> **Framework:** Next.js 16 (App Router) + React 19 + Tailwind CSS + JWT Authentication + REST APIs

---

## 🌟 Executive Overview

**ApexCommerce** is a scalable enterprise-grade web platform engineered for high-value hardware and technology procurement. It features an integrated simulated payment gateway, automated order invoice generation, real-time logistics fulfillment tracking, and an executive analytics dashboard with profit/margin telemetry.

---

## 🚀 Key Features Implemented (Task 1 to 8)

### 1. 🔐 Multi-Role Authentication & Access Control (RBAC)
- Multi-tier roles: **Enterprise Customer** vs **Platform Admin / Operations Executive**.
- Stateless JSON Web Token (JWT) session cookies/headers with salted bcrypt password hashing.
- One-click demo accounts for instant evaluation.

### 2. 📦 Product, Order & Inventory Management Modules
- **Product Catalog:** SKU tracking, multi-category taxonomy, real-time stock levels, reviews, and detailed technical specifications.
- **Order Logistics:** Multi-item orders, live fulfillment statuses (`Processing`, `Shipped`, `Delivered`, `Cancelled`), and express courier tracking IDs.

### 3. 💳 Payment Gateway Integration & Notifications
- Simulated Stripe / Corporate Card / Wire Transfer payment gateway modal with 256-bit SSL encryption.
- Coupon engine supporting `COGNEVANCE20` (20% instant order discount).
- Automated email notification dispatcher logging order confirmations and shipping updates.

### 4. 📊 Advanced Admin Analytics & Reports
- **Executive KPIs:** Total Gross Revenue, Net Profit (estimated COGS), Total Orders, Average Order Value (AOV), and Return on Ad Spend (ROAS).
- **Category Share Analysis:** Real-time visual revenue distribution bars.
- **Top 5 Best Sellers:** Ranked leaderboard by sales velocity.
- **Order Management Table:** Interactive fulfillment status updater with real-time customer notification triggers.

### 5. ☁️ Cloud Storage & Image Upload Module
- Image upload interface with cloud storage simulation for new enterprise SKUs.

### 6. 📱 Responsive Enterprise UI
- Ultra-modern dark aesthetic with glassmorphic cards, responsive mobile drawers, animated feedback toasts, and slide-over procurement cart.

---

## 🔑 Demo Credentials (1-Click Login)

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin Executive** | `admin@apexcommerce.com` | `Admin@123` | Analytics studio, SKU publisher, order fulfillment updater |
| **Customer Client** | `customer@apexcommerce.com` | `Customer@123` | Store catalog, cart, simulated checkout, order history |

---

## ⚙️ Installation & Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Production build
npm run build
npm start
```

---

## 📄 Submission Deliverables

- [x] **Complete Enterprise Application:** Full stack source code in Next.js 16 + React 19.
- [x] **REST API Documentation:** See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).
- [x] **Database Schema:** See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md).
- [x] **Architecture & Workflows Report:** See [ARCHITECTURE_REPORT.md](./ARCHITECTURE_REPORT.md).
- [x] **Screenshots & Submission Guide:** See [SCREENSHOTS_GUIDE.md](./SCREENSHOTS_GUIDE.md).
- [x] **Repository Naming:** Conforms to `cognevance_projectName` format (`cognevance_ecommerceAnalyticsPlatform`).

---

**Developed with ❤️ by Shahnawaz Khan for Cognevance Technologies**
