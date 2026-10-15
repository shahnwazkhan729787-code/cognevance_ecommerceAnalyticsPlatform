# 📚 REST API Documentation — Enterprise E-Commerce & Analytics Platform

**Organization:** Cognevance Technologies  
**Project:** Level 3 - Enterprise E-Commerce & Analytics Platform (Advanced)  
**Developer:** Shahnawaz Khan  
**Base URL:** `http://localhost:3000/api` (or production domain)

---

## 🔐 1. Authentication & Role-Based Access Control (RBAC)

Supported Roles:
- `customer`: Browse store, place orders, apply discount coupons, track shipments.
- `admin`: Product SKU management, order fulfillment modifications, executive analytics.

### 1.1 Register Account
- **Endpoint:** `POST /api/auth/register`
- **Access:** Public
- **Request Body (JSON):**
  ```json
  {
    "name": "Karan Malhotra",
    "email": "karan@enterprise.com",
    "password": "Password@123",
    "role": "customer"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Registration successful!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_1712498212",
      "name": "Karan Malhotra",
      "email": "karan@enterprise.com",
      "role": "customer"
    }
  }
  ```

### 1.2 User Login
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "admin@apexcommerce.com",
    "password": "Admin@123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Login successful!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5...",
    "user": {
      "id": "usr_admin_01",
      "name": "Shahnawaz (Admin Executive)",
      "email": "admin@apexcommerce.com",
      "role": "admin"
    }
  }
  ```

---

## 🛍️ 2. Product Management APIs

### 2.1 List Products
- **Endpoint:** `GET /api/products`
- **Access:** Public
- **Query Params:**
  - `search` (string) — Matches title, SKU, or category
  - `category` (string) — Enterprise Computing, Audio & Acoustics, Optics & Imaging, etc.
  - `sort` (string) — `popular`, `rating`, `price-asc`, `price-desc`, `newest`
  - `inStock` (boolean) — Filter only available stock
- **Response (200 OK):**
  ```json
  {
    "products": [
      {
        "id": "prd_1",
        "sku": "APX-MBP-16",
        "title": "MacBook Pro 16\" M3 Max",
        "category": "Enterprise Computing",
        "price": 3499.00,
        "stock": 24,
        "rating": 4.9,
        "salesCount": 142
      }
    ],
    "total": 1
  }
  ```

### 2.2 Create Product (Admin Only)
- **Endpoint:** `POST /api/products`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "sku": "APX-GPU-H100",
    "title": "NVIDIA H100 Tensor Core AI Rig",
    "category": "Enterprise Computing",
    "price": 32000.00,
    "stock": 4,
    "thumbnail": "https://images.unsplash.com/...",
    "description": "High performance computing cluster workstation."
  }
  ```

### 2.3 Update Product (Admin Only)
- **Endpoint:** `PUT /api/products/:id`
- **Headers:** `Authorization: Bearer <token>`

### 2.4 Delete Product (Admin Only)
- **Endpoint:** `DELETE /api/products/:id`
- **Headers:** `Authorization: Bearer <token>`

---

## 💳 3. Order Management & Payment Gateway APIs

### 3.1 Place Enterprise Order & Process Payment
- **Endpoint:** `POST /api/orders`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "items": [
      { "productId": "prd_1", "quantity": 1 }
    ],
    "shippingAddress": {
      "street": "702 Tech Tower",
      "city": "Bengaluru",
      "state": "KA",
      "zip": "560103",
      "country": "India"
    },
    "paymentMethod": "Stripe Corporate Card",
    "discountCode": "COGNEVANCE20"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Order placed and payment processed successfully!",
    "order": {
      "id": "ord_918231",
      "subtotal": 3499.00,
      "discount": 699.80,
      "tax": 223.94,
      "total": 3023.14,
      "paymentStatus": "Paid",
      "fulfillmentStatus": "Processing",
      "trackingNumber": "APX-FEDEX-88219"
    }
  }
  ```

### 3.2 Update Order Fulfillment Status (Admin Only)
- **Endpoint:** `PUT /api/orders/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "fulfillmentStatus": "Shipped"
  }
  ```

---

## 📊 4. Executive Analytics & Reporting API

### 4.1 Get Full Analytics Dashboard
- **Endpoint:** `GET /api/admin/analytics`
- **Access:** Admin Only
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "kpis": {
      "totalRevenue": 6257.49,
      "grossProfit": 3629.34,
      "totalOrders": 2,
      "averageOrderValue": 3128.75,
      "conversionRate": "3.8%",
      "returnOnAdSpend": "4.2x"
    },
    "categoryRevenue": {
      "Enterprise Computing": 3499.00,
      "Audio & Acoustics": 799.98,
      "Executive Workspace": 1695.00
    },
    "topProducts": [ ... ],
    "recentOrders": [ ... ]
  }
  ```
