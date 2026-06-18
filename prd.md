# BrewFlow POS — Product Requirements Document (PRD)

## Product Overview

BrewFlow POS adalah redesign Point of Sale (POS) berbasis Moka POS yang berfokus pada peningkatan efisiensi operasional kasir coffee shop.

Project ini dibuat berdasarkan hasil research yang menunjukkan dua masalah utama:

1. Kasir kesulitan menemukan menu dengan cepat karena menu tersebar di beberapa halaman.
2. Kasir sering terlambat mengetahui kondisi stok sehingga menyebabkan refund atau pergantian menu setelah transaksi terjadi.

Project ini hanya berfokus pada satu user:

**Kasir Coffee Shop**

---

# Goal

Membantu kasir menemukan menu lebih cepat dan meningkatkan awareness terhadap kondisi inventory tanpa harus berpindah halaman atau melakukan pengecekan manual secara terus menerus.

---

# Problem Statement

## Problem 1 — Menu Discovery

Pada Moka POS saat ini menu tersebar ke dalam beberapa halaman:

- Favorite
- Library
- Custom

Temuan Research:

- Favorite jarang digunakan karena tidak memiliki search.
- Search hanya tersedia pada Library.
- Kasir sering berpindah halaman untuk mencari menu.
- Saat peak hour sering terjadi salah input atau menu terlewat.

### Impact

- Menambah jumlah klik.
- Memperlambat transaksi.
- Meningkatkan risiko human error.

---

## Problem 2 — Inventory Awareness

Kasir sering mengetahui stok habis setelah transaksi selesai dilakukan.

Current Workflow:

Customer bayar
→ Barista cek bahan
→ Stok habis
→ Kasir menghubungi customer
→ Refund atau ganti menu

### Impact

- Refund meningkat.
- Menambah beban operasional.
- Menurunkan pengalaman pelanggan.

---

# User Story

> Sebagai kasir coffee shop saat peak hour, saya ingin menemukan menu dalam satu halaman dan langsung mengetahui status stoknya agar transaksi lebih cepat dan tidak terjadi refund akibat stok habis.

---

# Anti Goals

Project ini tidak mencakup:

- Dashboard owner
- Analytics
- Reporting
- CRM
- Membership
- Loyalty Program
- Employee Management
- Supplier Management
- Purchase Order
- Stock Opname
- Recipe Management
- Inventory Management
- Authentication
- Multi Role System
- Multi Outlet System
- Payment Gateway

---

# Target User

## Primary User

Kasir Coffee Shop

Karakteristik:

- Menggunakan POS setiap hari.
- Melayani transaksi dine-in dan takeaway.
- Mengelola order online.
- Bekerja pada situasi peak hour.

---

# Information Architecture

## Sidebar Navigation

- Point of Sale
- Activity
- Online Order
- Inventory
- Shift
- Settings

### Priority

P0

- Point of Sale
- Inventory

P1

- Activity
- Online Order

P2

- Shift
- Settings

---

# User Flow

## Flow 1 — Transaksi Normal

Kasir menerima pesanan

→ Search menu

atau

→ Pilih berdasarkan kategori

atau

→ Scroll menu

→ Pilih menu

→ Tambah ke cart

→ Checkout

→ Transaksi selesai

---

## Flow 2 — Low Stock Awareness

Kasir melihat notifikasi / toast saat menambahkan menu di panel cart:

⚠️ 3 Item Low Stock

→ Klik notifikasi

→ Masuk ke halaman Inventory

→ Item low stock muncul paling atas

→ Kasir mengetahui kondisi stok

→ Kembali ke POS

---

## Flow 3 — Refund

Activity

→ Cari invoice

→ Detail transaksi

→ Refund

→ Status berubah menjadi Refunded

---

# MVP Scope

## Included

### Point of Sale

- Search Menu
- Category Filter
- Favorite Menu
- Menu Grid
- Card Menu
- Cart Panel
- Checkout
- (Toast Notification stock)

### Inventory

- Inventory Overview
- Product Menu Tab
- Raw Material Tab
- Search Inventory
- Filter Status Stock
- Low Stock Highlight
- Low Stock Notification

### Activity

- Search Invoice
- Transaction History
- Refund

### Online Order

- Order List
- Filter Order
- Order Detail

### Shift

- Shift Overview

### Settings

- Preferences
- Theme Light and Dark Mode

---

## Excluded

- CRUD Menu
- CRUD Inventory
- CRUD Category
- Real Inventory Sync
- Real Stock Calculation Sync
- Transaction Mock sync
- Backend System
- API Development
- Database Management

---

# Route Structure

| Route          | Page          |
| -------------- | ------------- |
| /point-of-sale | Point of Sale |
| /inventory     | Inventory     |
| /activity      | Activity      |
| /online-order  | Online Order  |
| /shift         | Shift         |
| /settings      | Settings      |

---

# Data Source

Project menggunakan mock data.

Semua data disimpan di:

```text
src/constants/
```

Struktur:

```text
constants/
├── products.ts
├── categories.ts
├── inventory.ts
├── orders.ts
├── notifications.ts
```

Tidak menggunakan:

- Database
- API
- ORM

---

# Core Feature 1 — Unified Point of Sale

## Goal

Menggabungkan Favorite, Library, dan Category ke dalam satu halaman transaksi.

---

## Functional Requirements

### Search

- Search seluruh menu.
- Case insensitive.
- Partial match.
- Debounce 300ms.

### Category

- Horizontal category filter.
- Filter berdasarkan kategori.

### Favorite

- Favorite menggunakan icon star.
- Favorite muncul di bagian atas.
- Favorite tersimpan pada Zustand Store.

### Menu Card

Menampilkan:

- Nama menu
- Harga
- Favorite State

### Cart

- Dine in / Take Away
- Add Item
- Remove Item
- Update Quantity
- Checkout

---

# Core Feature 2 — Inventory Awareness

## Goal

Membantu kasir mengetahui kondisi stok lebih awal.

---

## Functional Requirements

### Inventory Tab

- Product Menu
- Raw Material

### Quantity Stock Inventory

Baik dari tab product maupun raw material

- Product Menu
- Raw Material

### Search Inventory

- Search item inventory.

### Auto Priority

Urutan otomatis:

1. Out of Stock
2. Low Stock
3. Healthy

### Filter Priority

1. Out of Stock
2. Low Stock
3. Healthy

### Visual Highlight

Low Stock:

- Amber Badge
- Warning Icon

Out of Stock:

- Red Badge
- Alert Icon

### Notification Toast

---

# Component Architecture

```text
RootLayout/
├── app/
│   ├── (dashboard)/
│   │   ├── point-of-sale/
│   │   ├── inventory/
│   │   ├── activity/
│   │   ├── online-order/
│   │   ├── shift/
│   │   ├── settings/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── sidebar.tsx
│   ├── header.tsx
│   └── page-title.tsx
│
├── features/
│   ├── pos/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types.ts
│   │
│   ├── inventory/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types.ts
│   │
│   ├── activity/
│   ├── online-order/
│   ├── shift/
│   └── settings/
│
├── stores/
│   ├── pos-store.ts
│   ├── cart-store.ts
│   └── notification-store.ts
│
│
├── constants/
│   ├── products.ts
│   ├── inventory.ts
│   ├── categories.ts
│   ├── orders.ts
│   ├── notifications.ts
│   ├── categories.ts
│   └── navigation.ts
│
├── types/
│   ├── product.ts
│   ├── inventory.ts
│   ├── order.ts
│   └── notification.ts
│
└── lib/
```

---

# Technical Stack

## Frontend

- Next.js 16
- TypeScript
- Tailwind CSS
- Shadcn UI
- Lucide React

## State Management

- Zustand

## Server State

- TanStack Query

## Deployment

- Vercel

---

# Validation Plan

## Task 1

Temukan menu "Iced Americano"

Success:

≤ 3 detik

---

## Task 2

Tambahkan menu ke cart

Success:

Tanpa error

---

## Task 3

Tambahkan menu ke cart dengan notifikasi toast low stock, klik notifikasi ke inventory page

Success:

≤ 10 detik

---

## Task 4

Lakukan refund

Success:

≤ 30 detik

---

# Success Metrics

| Metric                                    | Target    |
| ----------------------------------------- | --------- |
| Waktu menemukan menu                      | ≤ 3 detik |
| Waktu mengetahui low stok                 | ≤ 5 detik |
| Jumlah perpindahan halaman saat transaksi | 0         |
| Keberhasilan menyelesaikan task usability | ≥ 90%     |
| SUS Score                                 | ≥ 80      |

---

# Constraints

- Tidak menggunakan backend.
- Tidak menggunakan database.
- Tidak menggunakan authentication.
- Tidak menggunakan role management.
- Fokus utama pada Point of Sale dan Inventory.
- Secondary pages cukup dibuat sebagai supporting pages.
- Gunakan dummy data dari folder constants.
- Optimalkan untuk tablet dan desktop cashier workstation.
