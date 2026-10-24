# Atelier Tees — Premium Print-on-Demand E-Commerce Store

Atelier Tees is a modern, mobile-first print-on-demand streetwear e-commerce platform built with React 19, TypeScript, and Vite. The store connects directly to **Supabase** for database persistence, **Firebase** for authentication, and **Qikink** for automated on-demand DTG apparel printing and courier fulfillment across India.

---

## Features

- **Mobile-First & Fully Responsive**: Optimized across 320px, 375px, 412px, 768px, 1024px, and 1440px+ viewports with fluid typography, responsive 2-column mobile grids, and 44px+ tap targets.
- **Dynamic Catalog & Variants**: Heavyweight combed cotton tees (200–260 GSM), size selectors (S–2XL), color swatches, real-time discount calculations, and stock indicators.
- **Cart & Quantity Controls**: Persistent cart with real-time subtotal updates, shipping calculators, and instant drawer/dock feedback.
- **Secure Checkout**: Mobile-friendly address entry (`inputMode="tel"`, `inputMode="numeric"`), payment simulation (Card / NetBanking / COD), and backend order creation.
- **Qikink Fulfillment & Sync**: Integrated Supabase Edge Function (`qikink-api`) with secure OAuth token caching, order forwarding, status tracking, and AWB courier link generation.
- **Comprehensive Admin Dashboard**: Live revenue metrics, order fulfillment management, Qikink API health testing, margin & cost price tracking, and CSV catalog imports.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8
- **Styling**: Vanilla CSS (Fluid clamp sizing, mobile-first utility classes, CSS grid & flexbox)
- **Database & Backend**: Supabase (PostgreSQL, Row Level Security, Edge Functions)
- **Authentication**: Supabase Auth / Firebase Web Auth
- **Fulfillment**: Qikink On-Demand API (Sandbox & Production ready)
- **Icons**: Lucide React

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/hiswaruppal1916-swarup/t-shirt.git
cd t-shirt

# Install dependencies
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env` and fill in your Supabase and Firebase configuration:
```bash
cp .env.example .env
```

Set your Qikink API credentials securely in your Supabase Edge Function environment or `app_secrets` table:
```
QIKINK_CLIENT_ID=your_client_id
QIKINK_CLIENT_SECRET=your_client_secret
```

### 4. Run Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:5180/`.

### 5. Production Build
```bash
npm run build
```
Optimized vendor chunks (`react-vendor`, `supabase-vendor`, `icons`) are automatically split for fast page loads.

---

## License
MIT License. © 2026 Atelier Tees.
