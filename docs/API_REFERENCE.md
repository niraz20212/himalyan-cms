# API Reference

Base URL:

```text
http://localhost:5000/api
```

## Authentication Model

- `SUPER_ADMIN`, `ADMIN`, `EDITOR`: can access admin CMS routes.
- `USER`: can register, login, refresh tokens, logout, and fetch their own profile.
- Public website routes do not require authentication.

## Seeded Credentials

Admin:

```text
email: admin@himalayanchurpi.com
password: Admin@123
```

Normal user:

```text
email: user@himalayanchurpi.com
password: User@123
```

## Health

### GET `/health`

```bash
curl http://localhost:5000/health
```

## Auth APIs

### POST `/api/auth/register`

Create a normal user account with role `USER`.

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Niraj User\",\"email\":\"niraj.user@example.com\",\"password\":\"User@123\"}"
```

### POST `/api/auth/login`

Admin login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@himalayanchurpi.com\",\"password\":\"Admin@123\"}"
```

Normal user login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@himalayanchurpi.com\",\"password\":\"User@123\"}"
```

Response shape:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "name": "Super Admin",
      "email": "admin@himalayanchurpi.com",
      "role": "SUPER_ADMIN"
    },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

### GET `/api/auth/me`

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### POST `/api/auth/refresh`

```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"YOUR_REFRESH_TOKEN\"}"
```

### POST `/api/auth/logout`

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"YOUR_REFRESH_TOKEN\"}"
```

## Public Website APIs

### GET `/api/public/home`

```bash
curl http://localhost:5000/api/public/home
```

### GET `/api/public/products`

```bash
curl http://localhost:5000/api/public/products
```

### GET `/api/public/products/:slug`

```bash
curl http://localhost:5000/api/public/products/classic-himalayan-yak-chew
```

### GET `/api/public/blogs`

```bash
curl http://localhost:5000/api/public/blogs
```

### GET `/api/public/blogs/:slug`

```bash
curl http://localhost:5000/api/public/blogs/why-yak-cheese-chews-are-premium-dog-treats
```

### GET `/api/public/pages/:slug`

```bash
curl http://localhost:5000/api/public/pages/about-us
```

### GET `/api/public/sitemap.xml`

```bash
curl http://localhost:5000/api/public/sitemap.xml
```

### POST `/api/public/inquiries`

```bash
curl -X POST http://localhost:5000/api/public/inquiries \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"DISTRIBUTOR\",\"name\":\"Niraj Trading\",\"company\":\"Niraj Trading Co\",\"email\":\"niraj@example.com\",\"phone\":\"9800000000\",\"country\":\"Nepal\",\"message\":\"Need bulk pricing and MOQ.\"}"
```

## Media Upload API

Requires `SUPER_ADMIN`, `ADMIN`, or `EDITOR`.

### POST `/api/media`

```bash
curl -X POST http://localhost:5000/api/media \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -F "file=@C:/path/to/image.jpg"
```

## Admin CMS APIs

Requires `SUPER_ADMIN`, `ADMIN`, or `EDITOR`.

Pattern:

- `GET /api/admin/:resource`
- `GET /api/admin/:resource/:id`
- `POST /api/admin/:resource`
- `PUT /api/admin/:resource/:id`
- `DELETE /api/admin/:resource/:id`

Supported `:resource` values:

- `categories`
- `products`
- `blogs`
- `testimonials`
- `faqs`
- `certifications`
- `exportCountries`
- `menus`
- `pages`
- `media`
- `downloadableFiles`
- `websiteSettings`
- `companyInfo`
- `socialLinks`
- `inquiries`

### Example: list products

```bash
curl http://localhost:5000/api/admin/products \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
```

### Example: get one product by id

```bash
curl http://localhost:5000/api/admin/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
```

### Example: create category

```bash
curl -X POST http://localhost:5000/api/admin/categories \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Soft Chews\",\"slug\":\"soft-chews\",\"shortDesc\":\"Soft churpi formats\"}"
```

### Example: create product

```bash
curl -X POST http://localhost:5000/api/admin/products \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Premium Bar\",\"slug\":\"premium-bar\",\"shortDesc\":\"Dense yak cheese chew\",\"description\":\"Natural Himalayan dog chew\",\"sku\":\"HC-1001\",\"featured\":true,\"published\":true}"
```

### Example: update product

```bash
curl -X PUT http://localhost:5000/api/admin/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"shortDesc\":\"Updated short description\",\"featured\":false}"
```

### Example: delete product

```bash
curl -X DELETE http://localhost:5000/api/admin/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
```

### Example: create page

```bash
curl -X POST http://localhost:5000/api/admin/pages \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Video\",\"slug\":\"video\",\"summary\":\"Video page\",\"template\":\"default\"}"
```

### Example: create website setting

```bash
curl -X POST http://localhost:5000/api/admin/websiteSettings \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"key\":\"whatsapp_number\",\"value\":{\"phone\":\"+9779800000000\"}}"
```

## Role-Based Access Summary

- Admin CMS routes: `SUPER_ADMIN`, `ADMIN`, `EDITOR`
- Media upload route: `SUPER_ADMIN`, `ADMIN`, `EDITOR`
- Current user profile: any authenticated role
- Public website routes: open access
- Normal `USER` accounts cannot access `/api/admin/*`

## Recommended Login Flow

### Admin

1. Login at `/api/auth/login`
2. Save `accessToken`
3. Call admin routes with `Authorization: Bearer ...`
4. Refresh via `/api/auth/refresh` when needed
5. Logout via `/api/auth/logout`

### Normal user

1. Register at `/api/auth/register` or use the seeded normal user
2. Login at `/api/auth/login`
3. Call `/api/auth/me` with the access token
4. Refresh via `/api/auth/refresh`
5. Logout via `/api/auth/logout`
