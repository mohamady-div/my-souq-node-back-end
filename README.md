# My Souq Backend — by Ahmed Mohamady

**Created and maintained by Ahmed Mohamady**  
Software Developer · Technical Educator · Chief Development Officer at Congineer Business Solutions

[YouTube](https://www.youtube.com/@ahmedmohamady) · [LinkedIn](https://www.linkedin.com/in/almohamady/) · [Facebook](https://www.facebook.com/AlMohamady86) · [X](https://x.com/alMohamady86)

## About Ahmed Mohamady

I'm Ahmed Mohamady, a software developer and technical educator, and the Chief Development Officer at Congineer Business Solutions. My work spans business applications, Odoo development and integrations, .NET, and mobile applications.

I share practical programming knowledge in Arabic through my YouTube channel and online courses, helping developers connect technical concepts with real projects.

My Souq is part of that knowledge-sharing journey. By sharing the source code, I want to make my development approach accessible, give developers a practical project to explore, and create opportunities to learn and improve it together.

**Explore the code, contribute your ideas, and join me on [YouTube](https://www.youtube.com/@ahmedmohamady) for more programming content. Connect with me on [LinkedIn](https://www.linkedin.com/in/almohamady/) for professional updates and collaboration.**

## About My Souq Backend

The Node.js API behind My Souq, a Flutter shopping application inspired by familiar e-commerce marketplaces. This repository contains the backend; the Flutter client is maintained separately. The frontend repository link will be added when available.

This project shares a practical example of building authentication, a product catalog, carts, orders, and administration APIs. It is intended for learning and community improvement. The supplied source has been reviewed statically; the API has not been started or tested against a database for this documentation.

## Features

- Account registration with bcrypt password hashing.
- JWT sign-in, token validation, and current-user retrieval.
- Product filtering by category and case-insensitive name search.
- Product ratings, replacing the current user's previous rating.
- Featured products: up to three products ranked by the sum of ratings.
- Persistent user carts and shipping addresses.
- Order creation with stock checks, stock reduction, and cart clearing.
- Customer order history.
- Admin product creation, listing, and deletion.
- Admin order listing and status changes.
- Sales, order, product, and category totals.

Image files are uploaded by the Flutter client to Cloudinary. This API stores image URLs; it does not implement an upload endpoint. The payment-method field records a value supplied by the client; no payment-gateway verification is implemented here.

## Stack

| Component | Declared dependency |
| --- | --- |
| Runtime | Node.js; no version pinned in package.json |
| HTTP server | express ^4.21.2 |
| Database ODM | mongoose ^8.12.1 |
| Password hashing | bcryptjs ^2.4.3 |
| Authentication | jsonwebtoken ^9.0.2 |
| Development reload | nodemon ^2.0.19 |

The manifest also declares `http: ^0.0.1-security` and a local self-dependency, `my.souq: file:`. Neither is used by the reviewed application files. Review and remove these entries before publishing, then regenerate and commit the lockfile. Declared ranges are not installed-version guarantees.

## Source layout

- `index.js`: Express setup, JSON parsing, router registration, database connection, and listener.
- `routes/auth.js`: registration, sign-in, token validation, and current user.
- `routes/product.js`: catalog, search, ratings, and featured products.
- `routes/user.js`: cart, address, orders, and customer history.
- `routes/admin.js`: product administration, order administration, and totals.
- `components/my_auth.js`: JWT authentication middleware.
- `components/my_admin.js`: admin authorization middleware.
- `models/user.js`: account and embedded cart items.
- `models/product.js`: product data and embedded ratings.
- `models/rate.js`: rating schema.
- `models/order.js`: order data and embedded product snapshots.

## Local setup

### 1. Prerequisites

Install Git, npm with a compatible Node.js version, and access to a development MongoDB instance. The repository does not pin or establish a tested Node.js version yet.

Clone this repository and open its directory containing `package.json`.

### 2. Remove embedded credentials and configure the source

**The supplied source contains an embedded database credential and a hardcoded JWT signing value. Change the database password and replace the signing value before publishing or using a shared environment. Do not copy the original credentials into documentation or Git history.**

The current code does not read environment variables. Creating `.env` alone will not configure it. First replace the `DBC` and `PORT` constants in `index.js` with:

```js
const DBC = process.env.MONGODB_URI;
const PORT = Number(process.env.PORT || 3020);

if (!DBC || !process.env.JWT_SECRET) {
  throw new Error('MONGODB_URI and JWT_SECRET are required');
}
```

Replace the signing/verification key argument with `process.env.JWT_SECRET` in all JWT calls in:

- `routes/auth.js`
- `components/my_auth.js`
- `components/my_admin.js`

Use the same secret for all signing and verification calls. These are required source edits; the documentation package does not apply them to the application.

### 3. Install dependencies

After reviewing the manifest entries described above:

```bash
npm install
```

Commit the updated lockfile. Once a matching lockfile is committed, contributors can use `npm ci` for repeatable dependency installation.

### 4. Set local environment variables

PowerShell example, after completing the source edits:

```powershell
$env:MONGODB_URI = 'mongodb://127.0.0.1:27017/my_souq'
$env:JWT_SECRET = '<replace-with-a-long-random-secret>'
$env:PORT = '3020'
npm run dev
```

Bash example:

```bash
export MONGODB_URI='mongodb://127.0.0.1:27017/my_souq'
export JWT_SECRET='<replace-with-a-long-random-secret>'
export PORT='3020'
npm run dev
```

The placeholder is not a usable secret. Use development-only data and credentials.

| Command | Existing script |
| --- | --- |
| `npm start` | node ./index.js |
| `npm run dev` | nodemon ./index.js |

By default the supplied server listens on port `3020` and binds to `0.0.0.0`. It starts listening independently of the database connection, so a startup message alone does not prove database readiness. For local development, restrict network access as appropriate.

### 5. Create a development administrator

Register an account through `/api/signup`. In your development database, change that account's `type` field to `admin` using your database administration tool. There is no admin-creation endpoint or seed script in the supplied source. Never accept an administrator role directly from public registration input.

### 6. Connect Flutter

Set `myUri01` in the Flutter client's `lib/components/declarations.dart` to the reachable API URL. Its supplied default is `http://10.0.2.2:3020`. Use the correct host address for your device or deployment.

## API reference

JSON request bodies are parsed by Express. Protected routes use this header:

```http
my-souq-auth-token: <token-from-signin>
Content-Type: application/json
```

| Method | Path | Access | Input |
| --- | --- | --- | --- |
| POST | `/api/signup` | Public | name, email, password |
| POST | `/api/signin` | Public | email, password |
| POST | `/isValidToken` | Token supplied in header | No body required |
| GET | `/` | User | Current user; this is not a public health endpoint |
| GET | `/api/get-products` | User | category query parameter |
| GET | `/api/get-products/search/:txt` | User | Search text in path |
| POST | `/api/rate-product` | User | id, rating |
| GET | `/api/deal-of-the-day` | User | Up to three products |
| POST | `/api/add-to-cart` | User | id, qty |
| DELETE | `/api/remove-to-cart/:id` | User | Decreases quantity by one; removes last unit |
| POST | `/api/save-user-address` | User | address |
| POST | `/api/order` | User | cart, totalPrice, address, paymentMethod |
| GET | `/api/my-orders` | User | Current user's orders |
| POST | `/admin/add-product` | Admin middleware | name, description, images, price, qty, category |
| GET | `/admin/get-products` | Admin middleware | All products |
| POST | `/admin/delete-products` | Admin middleware | id |
| GET | `/api/all-orders-admin` | Admin middleware | All orders |
| POST | `/admin/update-order-status` | Admin middleware | id, status |
| GET | `/admin/analytics` | Admin middleware | Sales and count totals |

`images` is an array of URL strings. Order cart entries contain `product._id` and `qty`. Order status is numeric and defaults to `0`; the backend does not enforce a status enum or transition rules.

### Request examples

Registration:

```json
{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "<choose-a-development-password>"
}
```

Order body shape:

```json
{
  "cart": [
    {"product": {"_id": "<existing-product-id>"}, "qty": 1}
  ],
  "totalPrice": 150,
  "address": "Demo address",
  "paymentMethod": "CASH"
}
```

The current implementation accepts `totalPrice` from the client. This example describes the existing contract; server-side total calculation is a required improvement.

## Known limitations and improvements

- User documents returned from several endpoints include password hashes. Exclude password fields from every response.
- JWTs are issued without an expiry; add expiry and appropriate session handling.
- Admin middleware blocks `user` and `seller` values rather than explicitly requiring `admin`. Require `user.type === 'admin'` and handle missing users.
- Validate IDs, request types, positive integer quantities, prices, rating bounds, payment methods, and order statuses.
- Order stock updates and cart clearing are not transactional. Partial failures and concurrent orders can leave inconsistent data. Add atomic stock handling and a suitable transaction strategy.
- Recalculate order totals on the server and verify any external payment result.
- Category sales currently include every item in any order containing that category, which can overcount category totals. Filter individual order lines by category.
- The user address schema uses `defult` instead of `default`.
- Search uses raw regular-expression input; add safe search handling and pagination.
- Invalid tokens can return HTTP 500 rather than a suitable authentication response.
- No test script, rate limiting, dedicated health endpoint, or explicit CORS middleware is provided. Browser clients need a deliberate CORS policy if deployed on another origin.

These points are based on static source inspection, not a complete security audit or runtime test.

## Contributing

Open an issue for a bug or proposed improvement, fork the repository, and submit a focused pull request. Explain the behavior changed and how you verified it. Contributions to validation, order consistency, authentication, tests, and documentation are especially welcome.

## License

`package.json` declares `ISC`, but the supplied archive does not include a standalone license text. Confirm that ISC is the intended project license and add the full `LICENSE` file with the correct copyright holder before release. Dependency licenses remain separate.

## Stay connected

Created and maintained by **Ahmed Mohamady**.

- [YouTube — programming tutorials and practical projects](https://www.youtube.com/@ahmedmohamady)
- [LinkedIn — professional updates and collaboration](https://www.linkedin.com/in/almohamady/)
- [Facebook](https://www.facebook.com/AlMohamady86)
- [X](https://x.com/alMohamady86)

If you find this project useful, consider giving it a star and sharing it with other developers.
