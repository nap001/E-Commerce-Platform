# Full-Stack E-Commerce Platform

A responsive marketplace built with the MERN stack (MongoDB, Express, React, Node.js). Users can list items for sale, browse and search the catalogue, review products, fill a cart and place orders.

## Features
- **Authentication:** register / login with JWT, session restored on reload, protected pages.
- **Marketplace:** server-side search, category filter, sorting, "in stock" filter and pagination.
- **Selling:** create, edit and delete your own listings (owner/admin only).
- **Shopping cart:** persisted in `localStorage`, quantities capped at available stock.
- **Checkout & orders:** cash-on-delivery checkout with atomic stock reservation (no overselling), order history and order cancellation (restocks items).
- **Reviews:** one 1-5 star review per user per item; you cannot review your own listing.
- **Security:** hashed passwords, helmet headers, rate-limited auth routes, validated/whitelisted input, no email exposure on public profiles.

## Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS 4, React Router, Axios.
- **Backend:** Node.js, Express 5, Mongoose.
- **Database:** MongoDB.

## Project Structure
```text
E-Commerce-Platform/
├── backend/
│   ├── config/        # Environment loading + validation
│   ├── controllers/   # Request handlers (auth, items, orders)
│   ├── middleware/    # Auth, ObjectId validation, error handling
│   ├── models/        # Mongoose schemas (User, Items, Order)
│   ├── routes/        # Express routers
│   ├── scripts/       # start-local-db.js (dev MongoDB) and seed.js (demo data)
│   ├── tests/         # Integration tests (node:test + in-memory MongoDB)
│   ├── utils/         # Shared helpers (HttpError)
│   ├── app.js         # Express app (importable for tests)
│   └── server.js      # DB connection + HTTP listener
└── client/
    └── src/
        ├── api/         # Axios instance + error helper
        ├── Components/  # Reusable UI components
        ├── context/     # Auth and Cart providers
        ├── layouts/     # Page shell (navbar + footer)
        ├── pages/       # Route-level pages
        └── utils/       # Formatting helpers
```

## Quick Start
Use three terminals, starting from the repository root:

```bash
# 1. Database (skip if MongoDB is already running at MONGO_URI)
cd backend && npm install && npm run db

# 2. API: create backend/.env from .env.example first, then seed demo data once
cd backend && npm run seed && npm run dev      # http://localhost:5000

# 3. Web app: create client/.env from .env.example first
cd client && npm install && npm run dev        # http://localhost:5173
```
Open http://localhost:5173 and log in with `alice@example.com` / `password123` (see [Database](#database) for all demo accounts).

## Getting Started

### Prerequisites
Node.js 18+ and a running MongoDB instance (local, Docker or Atlas), or use `npm run db` described below.

### Database
The API needs a MongoDB server at `MONGO_URI`. Use whichever you prefer (Docker, an installed service, Atlas), or, with nothing installed, start a persistent local one from the backend folder:
```bash
cd backend
npm run db               # keeps running; data is stored in backend/.data (git-ignored)
```
Then, in a second terminal, load demo data (6 demo users, 100 items across 8 categories, with reviews):
```bash
npm run seed             # add demo data
npm run seed -- --reset  # delete the previous demo data and re-seed
```
Demo logins: `alice@example.com`, `ben@example.com`, `chloe@example.com`, `daniel@example.com`, `emma@example.com`, `farid@example.com`, all with password `password123`. `--reset` only removes data owned by these demo users.

> Demo product images are loaded from `picsum.photos`, so the browser needs internet access to show them. Items with a missing or broken image URL fall back to a placeholder icon.

### Backend
```bash
cd backend
cp .env.example .env     # then edit MONGO_URI and JWT_SECRET
npm install
npm run dev              # http://localhost:5000
```

### Frontend
```bash
cd client
cp .env.example .env     # VITE_API_URL, defaults to http://localhost:5000
npm install
npm run dev              # http://localhost:5173
```

### Tests
```bash
cd backend
npm test
```
The tests use their own in-memory database and never touch your `MONGO_URI` data. The first run downloads a MongoDB binary used by `mongodb-memory-server` (about 780 MB, cached afterwards, and also used by `npm run db`).

### Frontend checks
```bash
cd client
npm run lint
npm run build
```

## Environment Variables

| File | Variable | Description |
| --- | --- | --- |
| `backend/.env` | `MONGO_URI` | **Required.** MongoDB connection string (default `mongodb://127.0.0.1:27017/ecommerce`) |
| `backend/.env` | `JWT_SECRET` | **Required.** Secret used to sign login tokens; the server refuses to start without it |
| `backend/.env` | `PORT` | API port (default `5000`) |
| `backend/.env` | `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `backend/.env` | `CLIENT_URL` | Comma-separated allowed browser origins for CORS (empty allows all, development only) |
| `client/.env` | `VITE_API_URL` | Base URL of the API (default `http://localhost:5000`) |

Both `.env` files are git-ignored; commit changes to the `.env.example` files instead.

## Troubleshooting
- **`ECONNREFUSED 127.0.0.1:27017` or "MongoDB connection error":** no database is running. Start one with `npm run db` (or your own MongoDB) and check `MONGO_URI`.
- **"Missing required environment variable(s)":** copy `backend/.env.example` to `backend/.env` and set `MONGO_URI` and `JWT_SECRET`.
- **`Port 5173 is already in use`:** a Vite dev server is already running; open http://localhost:5173 or stop the old process.
- **Items load but the page shows a network error in the browser:** make sure `CLIENT_URL` in `backend/.env` matches the address you opened (for example `http://localhost:5173`).
- **`npm run seed` says demo data already exists:** use `npm run seed -- --reset`.

## API Overview
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register`, `/api/auth/login` | – | Create account / log in |
| GET | `/api/auth/me` | ✔ | Current user |
| GET | `/api/items` | – | List items (`search`, `category`, `sort`, `inStock`, `page`, `limit`) |
| GET | `/api/items/categories` | – | Distinct categories |
| GET | `/api/items/myitems` | ✔ | Items listed by me |
| GET | `/api/items/:id` | – | Item with reviews |
| POST / PUT / DELETE | `/api/items[/:id]` | ✔ | Create / update / delete (owner or admin) |
| POST | `/api/items/:id/reviews` | ✔ | Add a review |
| POST / GET | `/api/orders` | ✔ | Place order / my orders |
| GET | `/api/orders/:id` | ✔ | Order details |
| PATCH | `/api/orders/:id/cancel` | ✔ | Cancel a processing order |
| GET | `/api/user/:id` | – | Public profile (name only) |

Errors are returned as `{ "msg": "..." }`.
