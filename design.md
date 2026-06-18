# BrewFlow POS — Design System & UI Guidelines

## Design Goal

BrewFlow POS adalah aplikasi Point of Sale yang dioptimalkan untuk kasir coffee shop saat peak hour.

Design harus memprioritaskan:

1. Kecepatan menemukan menu
2. Kecepatan menyelesaikan transaksi
3. Awareness terhadap inventory
4. Mengurangi cognitive load
5. Mengurangi jumlah klik

Bukan untuk analytics atau reporting.

---

# Design References

Gunakan referensi visual berikut sebagai acuan utama:

Reference 1:
[Shadcn Dashboard Blocks | Dashboard 01](https://ui.shadcn.com/blocks)

Karakteristik:

- Dark Mode First
- Large spacing
- Clean typography
- Minimal visual noise
- Strong hierarchy
- Soft border
- Soft shadow

Karakteristik:

- Simple data table
- Status badge
- Search di header
- Informasi mudah dipindai

---

# Layout Rules

## Global Layout

Semua halaman menggunakan layout yang sama.

```text
┌──────── Sidebar ────────┐
│                         │
│                         │
│                         │
└─────────────────────────┘

┌───────────────────────────────────────────────┐
│ Header                                        │
├───────────────────────────────────────────────┤
│ Page Content                                  │
└───────────────────────────────────────────────┘