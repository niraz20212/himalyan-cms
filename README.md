# Himalayan Churpi CMS

Production-oriented full-stack company website and CMS for a premium Nepali Himalayan Yak Cheese Churpi dog chew exporter.

## Stack

- Frontend: React 19 + Vite + Tailwind CSS + Redux Toolkit
- Backend: Node.js + Express + Prisma
- Database: PostgreSQL
- Auth: JWT access and refresh tokens
- Uploads: Multer + Cloudinary-ready media pipeline
- Deployment: Docker Compose, environment variable support

## Project Structure

```text
himalayan-churpi-cms/
  backend/
  frontend/
  docker-compose.yml
  .env.example
```

## Local Setup

1. Copy `.env.example` to `.env`.
2. Copy `backend/.env.example` to `backend/.env`.
3. Copy `frontend/.env.example` to `frontend/.env`.
4. Start PostgreSQL and install dependencies.

### Without Docker

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

### With Docker

```bash
docker compose up
```

On backend startup, the server now runs `prisma db push` automatically when `AUTO_DB_PUSH_ON_START=true`, so missing tables are created in the configured PostgreSQL database at runtime.
If you also want the default admin and sample CMS content created automatically, set `AUTO_DB_SEED_ON_START=true`.

## Default Admin

- Email: `admin@himalayanchurpi.com`
- Password: `Admin@123`

## Default Normal User

- Email: `user@himalayanchurpi.com`
- Password: `User@123`

## API Overview

### Public

- `GET /api/public/home`
- `GET /api/public/products`
- `GET /api/public/products/:slug`
- `GET /api/public/blogs`
- `GET /api/public/blogs/:slug`
- `GET /api/public/pages/:slug`
- `POST /api/public/inquiries`
- `GET /api/public/sitemap.xml`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Admin

- `GET /api/admin/:resource`
- `GET /api/admin/:resource/:id`
- `POST /api/admin/:resource`
- `PUT /api/admin/:resource/:id`
- `DELETE /api/admin/:resource/:id`

Supported resource keys include `products`, `categories`, `blogs`, `testimonials`, `faqs`, `certifications`, `exportCountries`, `menus`, `pages`, `media`, `downloadableFiles`, `websiteSettings`, `companyInfo`, `socialLinks`, and `inquiries`.

## Sample Requests

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@himalayanchurpi.com\",\"password\":\"Admin@123\"}"
```

```bash
curl http://localhost:5000/api/public/products
```

Full API documentation with curl examples for admin and normal-user login flows is available in [docs/API_REFERENCE.md](C:\Users\ACER\IdeaProjects\himalayan-churpi-cms\docs\API_REFERENCE.md).

## Notes

- Content is database-driven; the frontend reads from public APIs and the admin panel writes through CMS APIs.
- The admin resource screens are intentionally generic JSON managers to keep the scaffold broad and extensible.
- Replace the generic resource manager with field-specific CRUD forms as content workflows stabilize.
