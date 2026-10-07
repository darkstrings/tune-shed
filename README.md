# 🎸 Tune Shed Music

A full-stack guitar shop built on the **MERN** stack (MongoDB, Express, React, Node), with **PayPal checkout**, customer accounts and a complete admin area.

**Live demo:** https://tune-shed.onrender.com. Use the **Demo shopper** or **Demo admin** buttons on the sign-in page. Both demo accounts are read-only, so you can explore everything without changing the store. Payments run in PayPal's **sandbox**, so no real money moves.

> The demo is on a free hosting tier, so the first visit after a quiet spell can take ~30 seconds while the server wakes up.

## Features

**Shop**
- Search, filter by category and condition, sort by price, rating or newest. Filters live in the URL, so any view can be bookmarked or shared
- Product pages with stock status, quantity picker and player reviews (one per customer)
- Cart that persists between visits, with the same price maths as the server (free shipping over $100, 15% tax)
- Checkout flow: shipping → payment → review → PayPal

**Accounts**
- Register and sign in with an HTTP-only JWT cookie, and edit your profile
- Order history with a status timeline (placed → paid → shipped)

**Admin**
- Dashboard: revenue, orders to ship, low-stock alerts and recent orders
- Products: create, edit, upload photos, delete
- Orders: filter by awaiting payment, to ship or shipped, and mark orders as shipped
- Users: edit, promote to admin, delete

**Polish:** responsive from phone to widescreen, light and dark themes, accessible forms and keyboard navigation, and route-level code splitting.

## Security notes

- Passwords are hashed with bcrypt. Auth is a JWT in an **HTTP-only, SameSite=strict** cookie, so page scripts can't read it
- **Prices and stock come from the database**, never from the client. PayPal payments are verified server-side (status, exact amount in cents, and no reuse of a transaction id)
- Customers can only see their own orders (others get a 404, so order ids can't be probed)
- **Helmet** security headers with a Content-Security-Policy allow-listing only PayPal and Google Fonts
- **Rate limiting** on sign-in and registration
- Search input is regex-escaped (no ReDoS or regex injection), request bodies are size-limited, and ObjectIds are validated
- Image uploads are admin-only, limited to JPG/PNG/WebP under 5 MB, and stored under random filenames
- `?redirect=` targets are restricted to same-site paths (no open redirects)
- Read-only **demo accounts** are enforced on the server, not just hidden in the UI

## Tech

| | |
|---|---|
| Frontend | React 19, React Router 8, Redux Toolkit 2 + RTK Query, Tailwind CSS 4, Vite 8 |
| Backend | Node 20+, Express 5, Mongoose 9, JSON Web Tokens, Multer |
| Payments | PayPal JS SDK (`@paypal/react-paypal-js`) + PayPal Orders API verification |
| Tests | `node:test` end-to-end API tests with a local PayPal mock |

```
backend/
  app.js            Express app (security middleware, routes, static hosting)
  server.js         connects to MongoDB and starts the app
  controllers/      route handlers
  models/           Mongoose schemas
  middleware/       auth (protect / admin / blockDemo), errors, rate limits
  tests/            API tests
frontend/
  src/pages/        one lazily-loaded module per route
  src/store/        Redux store, RTK Query APIs, cart and auth slices
  src/components/   UI kit, layout and shop components
```

## Running locally

1. `cp .env.example .env` and fill in `MONGO_URI`, `JWT_SECRET` and your PayPal **sandbox** keys.
2. Install and seed:
   ```bash
   npm install
   npm install --prefix frontend
   npm run data:import      # sample guitars, reviews, an admin and the demo accounts
   ```
   `data:import` **wipes the database first**. It prints the admin password unless you set `SEED_ADMIN_PASSWORD`.
3. `npm run dev` starts the API on :5000 and the site on http://localhost:3000.

| Script | What it does |
|---|---|
| `npm run dev` | API + frontend with live reload |
| `npm test` | API tests (needs a MongoDB, e.g. `MONGO_URI=mongodb://127.0.0.1:27017/tuneshed-test npm test`) |
| `npm run data:demo-users` | Adds/refreshes **only** the two read-only demo accounts (safe on production) |
| `npm run build` | Installs everything and builds the frontend (used by Render) |
| `npm start` | Production server (serves the API and the built frontend) |

## Deploying to Render

- **Build command:** `npm run build`
- **Start command:** `npm start`
- **Environment:** `NODE_ENV=production`, plus the variables from `.env.example`
- Product photos uploaded through the admin are stored on a Render **disk** mounted at `/var/data`. Override with `UPLOAD_DIR` if needed.
- After the first deploy, run `npm run data:demo-users` once (Render shell) so the demo buttons work.

---

Built by [Lucien Gaydos](https://github.com/darkstrings).
