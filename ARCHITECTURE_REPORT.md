# 🏛️ Architecture & System Design Report

**Project:** Level 3 - Enterprise E-Commerce & Analytics Platform (ApexCommerce)  
**Organization:** Cognevance Technologies  
**Developer:** Shahnawaz Khan  

---

## 1. Executive Summary

ApexCommerce is an enterprise-scale full-stack architecture built using **Next.js 16 (Turbopack)**, **React 19 Server/Client Components**, **Tailwind CSS**, and **Node.js REST microservices**. The platform delivers real-time procurement management, simulated 256-bit payment gateways, automated inventory reconciliation, and executive analytics dashboards.

---

## 2. System Architecture Diagram

```
+-------------------------------------------------------------------------+
|                           CLIENT TIER                                   |
|   Storefront Catalog  |  Cart Drawer  |  Customer Orders  | Admin KPIs  |
|               (React 19, Tailwind CSS, Lucide Icons)                    |
+-------------------------------------------------------------------------+
                                    |
                                    | HTTPS / JSON REST
                                    v
+-------------------------------------------------------------------------+
|                        API / APPLICATION TIER                           |
|  /api/auth  |  /api/products  |  /api/orders  |  /api/admin/analytics   |
|         - JWT Bearer Authentication & RBAC Gatekeeper                   |
|         - Inventory Lock & Price Calculation Engine                     |
|         - Simulated Payment Gateway & Notification Dispatcher           |
+-------------------------------------------------------------------------+
                                    |
                                    | Atomic File Operations
                                    v
+-------------------------------------------------------------------------+
|                           DATA STORE TIER                               |
|        data/db.json (Users, Products, Orders, Notifications)            |
+-------------------------------------------------------------------------+
```

---

## 3. Core Enterprise Workflows

### Workflow A: Procurement Checkout & Inventory Lock
1. Customer selects items -> added to Cart state with real-time subtotal calculation.
2. Promo coupon code (`COGNEVANCE20`) checked -> 20% discount computed server-side.
3. Customer submits shipping address and simulated card credentials.
4. Server verifies stock availability -> decrements stock inventory atomically.
5. Order created with status `Paid` & `Processing`.
6. Automated confirmation notification logged.

### Workflow B: Order Fulfillment & Logistics
1. Admin opens **Analytics & Admin Studio**.
2. Live fulfillment table displays new orders with courier tracking IDs.
3. Admin changes status (e.g., `Processing` -> `Shipped` -> `Delivered`).
4. System dispatches tracking notification update to customer email.

### Workflow C: Executive Analytics Telemetry
1. Aggregates gross revenue, COGS estimates, and net profit.
2. Computes Average Order Value (AOV), Return on Ad Spend (ROAS), and conversion rates.
3. Ranks top 5 products by sales velocity.
