# AlloShoppe - Shopping Platform - Take Home Project

A reservation-based order fulfillment and inventory platform that's built for multi-warehouse retail and D2C. Built as a take-home exercise for Allo Health.

**Live Demo:** [allo-inventory-six-eta.vercel.app](https://allo-inventory-six-eta.vercel.app)

---

## Overview

AlloShoppe manages stock across multiple warehouses for various products using a **reservation** technique. The goal of reservation is to ensure units are held (locked) for 10 minutes and released if checkout isn't completed by then, or if the user chooses to unreserve the product. For easy visualization of reserved, expired and sold products, and admin dashboard* is also included. 

*_The admin dashboard is kept accessible to all as a user data model has not been created for this project._

---

## Data Model

![Data Model](docs/allo_inventory_data_model.png)

The schema is managed with Prisma and lives in `prisma/schema.prisma`.

### Tables
 
**Product** - one row per stock keeping unit (SKU). It stores name, price, weight, category, and image.
 
**Warehouse** - one row per physical location. Stores delivery base fee and per-kg rate for delivery fee calculation alongisde product weight.
 
**Stock** - junction between Product and Warehouse. It stores `totalUnits` and `reservedUnits`. Available units are computed (`totalUnits - reservedUnits`), not stored. 
 
**Reservation** - one row per checkout attempt. Tracks status (`PENDING`, `CONFIRMED`, `RELEASED`), quantity, and expiry time.

Apart from the tables, there are two enums, "Category" and "ReservationStatus" that hold the different product categories and the possible product reservation statuses respectively.

---
 
## Tech Stack
 
| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.6 (App Router, TypeScript) |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 7.8.0 |
| Hosting | Vercel |
| Styling | Tailwind CSS |
| Validation | Zod |
 
---

## API Reference

### Products & Warehouses

| Method | Path | Description |
|---|---|---|
| GET | `/api/products` | Returns all products with per-warehouse stock, available units, and computed delivery fee |
| GET | `/api/warehouses` | Returns all warehouses with delivery rates |

### Reservations

| Method | Path | Status Codes |
|---|---|---|
| POST | `/api/reservations` | Creates a reservation, returns `201` on created, `409` on insufficient stock, `400` on invalid body |
| GET | `/api/reservations/:id` | Gets a single reservation with product and warehouse details, returns `200` on found, `404` on not found |
| POST | `/api/reservations/:id/confirm` | Confirms a reservation (checked out), returns 410 if expired |
| POST | `/api/reservations/:id/release` | Release reservation early |

### Admin

| Method | Path | Description |
|---|---|---|
| GET | `/api/admin/reservations` | All reservations with product and warehouse details, ordered by newest first |
| GET | `/api/admin/stats` | Aggregate stats - counts by status, available units, confirmed revenue |

### Cron

| Method | Path | Description |
|---|---|---|
| GET | `/api/cron/expire-reservations` | Releases expired PENDING reservations. Called automatically by Vercel Cron every day* |

*_Vercel limits cron jobs to only once a day. More about the lazy cleanup function used is explained below._

---

## Seed Data

The seed script `prisma/seed.ts` is used to populate the database with sample data. It has 3 warehouses, 6 products across all categories, and 18 stock entries.

### Products
 
| Product | Category | Price |
|---|---|---|
| Chunky Wireless Headphones | ELECTRONICS | ₹2,999.99 |
| Cotton Crew T-Shirt | APPAREL | ₹499.99 |
| Athletic Running Sneakers | FOOTWEAR | ₹1,999.99 |
| Yoga Mat | SPORTS_AND_FITNESS | ₹799.99 |
| Desk Lava Lamp | HOME_AND_LIVING | ₹899.99 |
| Curology Daily Cleanser Set | BEAUTY | ₹349.99 |
  
### Warehouses
 
| Warehouse | Location | Base Fee | Per Kg |
|---|---|---|---|
| Chennai Hub | Chennai, TN | ₹39.00 | ₹9.00 |
| Bangalore Central | Bengaluru, KA | ₹45.00 | ₹10.00 |
| Hyderabad South | Hyderabad, TS | ₹42.00 | ₹11.00 |
