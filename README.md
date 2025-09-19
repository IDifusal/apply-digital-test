# Apply Digital Assessment – Products API
Contentful + NestJS + PostgreSQL + TypeORM + JWT + Docker

---

## What is this?
- Syncs **products from Contentful** every hour (cron).
- Stores them in **PostgreSQL**.
- **Public module (no token):**
  - `GET /products` → paginated list (**max 5 per page**) with filters (`name`, `category`, `priceMin`, `priceMax`).
  - `DELETE /products/:id` → soft delete. Deleted items **do not come back** on next syncs or restarts.
- **Private module (JWT):**
  - `GET /reports/deleted-percentage`
  - `GET /reports/active-percentage?hasPrice=...&from=YYYY-MM-DD&to=YYYY-MM-DD`
  - `GET /reports/top-categories?limit=N`
- **Docs:** Swagger at `http://localhost:3000/api/docs#/`.

---

## Quick start (Docker)
1) Clone the repo and go to the folder.  
2) Copy env file and fill the **Contentful** vars:
   ```bash
   cp .env.example .env
   ```
   Important vars:
   ```ini
   PORT=3000
   NODE_ENV=development

   DB_HOST=db
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=productsdb

   JWT_SECRET=supersecret
   JWT_EXPIRES_IN=1d

   SYNC_CRON=0 * * * *

   CONTENTFUL_SPACE_ID=
   CONTENTFUL_ACCESS_TOKEN=
   CONTENTFUL_ENVIRONMENT=
   CONTENTFUL_CONTENT_TYPE=
   ```
3) Start DB + API:
   ```bash
   docker-compose up --build
   ```
   Swagger should be at: `http://localhost:3000/api/docs#/`

---

## Manual sync (so you don’t wait 1 hour)
```bash
curl -X GET http://localhost:3000/tasks/sync
```

---

## API docs & Auth
Open: `http://localhost:3000/api/docs#/`

**Get a token:**
- `POST /auth/login`
  ```json
  { "email": "test@test.com", "password": "test123" }
  ```
- Copy `access_token`.
- In Swagger click **Authorize** and paste: `Bearer <your_token>`.

**Which endpoints need a token?**
- Swagger shows it.  
- All **/reports/** and **/tasks/sync** are **private** (JWT).  
- **/products** list and delete are **public** (no JWT).

---

## Endpoints cheat sheet

**Public**
- `GET /products?page=1&name=iphone&category=phones&priceMin=100&priceMax=500`
  - Always returns **5 items max** per page.
- `DELETE /products/:id`
  - Soft delete: sets `isDeleted=true`. It will **not** be re-imported later.

**Private (JWT)**
- `POST /auth/login` → returns `{ access_token }`
- `GET /reports/deleted-percentage`
- `GET /reports/active-percentage?hasPrice=true|false&from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /reports/top-categories?limit=5`
- `POST /tasks/sync` → run Contentful sync now

---

## Local dev (optional, without Docker)
- You need PostgreSQL running locally and the `.env` adjusted (`DB_HOST=localhost`).
- Install and run:
  ```bash
  pnpm install
  pnpm run start:dev
  ```

---

## Tests & coverage
```bash
pnpm run test        # unit
pnpm run test:e2e    # e2e
pnpm run test:cov    # coverage (target ≥ 30%)
```
The assessment requires **≥ 30%** statement coverage.

---

## GitHub Actions (CI)
- Lint + tests + coverage gate (fails if below the threshold).
- Build validation.

---

## Conventional Commits
Use clear commit messages:
```
feat: add products listing with filters
fix: prevent resurrecting soft-deleted products on sync
docs: update README quick start
test: add e2e for reports endpoints
ci: enable coverage gate in CI
chore: bump dependencies
```
If you prefer a guided prompt:
```bash
pnpm run commit
```

---

## Notes
- **Soft delete rule:** if a product is deleted in DB, the sync **won’t revive it**.
- **Cron:** change the schedule with `SYNC_CRON` if needed.
- Missing API rate limits, IP restrictions, and potential real-time synchronization.

---
