# 🗄️ Database Schema — Enterprise E-Commerce & Analytics Platform

**Organization:** Cognevance Technologies  
**Project:** Level 3 - Enterprise E-Commerce & Analytics Platform (Advanced)  
**Database File:** `data/db.json`

---

## 📐 Entity Relationship (ER) Diagram

```
+------------------+         1 : N         +-------------------+
|      USERS       | --------------------> |      ORDERS       |
|------------------|                       |-------------------|
| id (PK)          |                       | id (PK)           |
| name             |                       | userId (FK)       |
| email (Unique)   |                       | items (Array)     |
| password (Hash)  |                       | subtotal          |
| role (admin/cust)|                       | discount          |
| createdAt        |                       | tax               |
+------------------+                       | total             |
                                           | paymentStatus     |
+------------------+                       | paymentMethod     |
|     PRODUCTS     |                       | fulfillmentStatus |
|------------------|                       | trackingNumber    |
| id (PK)          |                       | shippingAddress   |
| sku (Unique)     |                       | createdAt         |
| title            |                       +-------------------+
| category         |                                 |
| price            |                                 | 1 : N
| originalPrice    |                                 v
| stock            |                       +-------------------+
| salesCount       |                       |   NOTIFICATIONS   |
| thumbnail        |                       |-------------------|
| specs (Object)   |                       | id (PK)           |
| createdAt        |                       | recipient         |
+------------------+                       | subject           |
                                           | message           |
                                           | sentAt            |
                                           +-------------------+
```

---

## 📋 1. Collection: `users`
- `id`: `String` (Primary Key)
- `name`: `String` (Full Name)
- `email`: `String` (Unique)
- `password`: `String` (Bcrypt hash)
- `role`: `Enum` (`"admin"`, `"customer"`)
- `avatar`: `String` (Avatar URL)
- `createdAt`: `ISOString`

## 📋 2. Collection: `products`
- `id`: `String` (Primary Key)
- `sku`: `String` (Unique Stock Keeping Unit)
- `title`: `String`
- `category`: `String`
- `price`: `Number`
- `originalPrice`: `Number`
- `stock`: `Integer`
- `rating`: `Number`
- `salesCount`: `Integer`
- `thumbnail`: `String`
- `specs`: `Object` (Key-value technical specifications)

## 📋 3. Collection: `orders`
- `id`: `String` (Primary Key)
- `userId`: `String` (Foreign Key)
- `customerName`: `String`
- `customerEmail`: `String`
- `items`: `Array<{ productId, title, price, quantity, thumbnail }>`
- `subtotal`: `Number`
- `discount`: `Number`
- `tax`: `Number`
- `total`: `Number`
- `paymentStatus`: `Enum` (`"Paid"`, `"Pending"`, `"Refunded"`)
- `paymentMethod`: `String`
- `fulfillmentStatus`: `Enum` (`"Processing"`, `"Shipped"`, `"Delivered"`, `"Cancelled"`)
- `trackingNumber`: `String`
- `shippingAddress`: `Object<{ street, city, state, zip, country }>`
- `createdAt`: `ISOString`

## 📋 4. Collection: `notifications`
- `id`: `String` (Primary Key)
- `type`: `String` (`"order_confirmation"`, `"order_status_update"`)
- `recipient`: `String` (Email)
- `subject`: `String`
- `message`: `String`
- `sentAt`: `ISOString`
