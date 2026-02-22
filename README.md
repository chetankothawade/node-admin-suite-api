# Node Admin API

Express + Sequelize (MySQL) backend for authentication, users, modules/permissions, CMS, chat, and categories.

## Suggested App Name
- `OpsPilot API` (recommended)
- Alternatives: `AdminFlow API`, `CorePanel API`, `ControlDock API`

## Features
- JWT authentication (register, login, forgot/reset password, logout)
- User management with UUID-based public operations
- Module + permission mapping and user permission toggling
- CMS page management
- Chat messaging with conversation/member/message status handling
- Category management with parent-child structure
- Common error handling via `handleError(...)`
- Thin controller + service + repository architecture
- i18n-enabled API messages
- File upload support (avatars/editor/chat attachments)
- Request security middleware: helmet, cors, rate-limit, cookie parser

## Stack
- Node.js (ES modules)
- Express 5
- Sequelize + MySQL
- JWT auth
- i18n (`locales/en.json`)
- Multer uploads
- Socket.io (chat infra)

## Current API Base
- Base URL: `http://localhost:8000`
- API prefix: `/api/v1`
- Health check: `GET /health`

## Mounted Route Groups
Defined in `app.js`:
- `/api/v1` -> auth routes
- `/api/v1/user`
- `/api/v1/access`
- `/api/v1/module`
- `/api/v1/cms`
- `/api/v1/editor`
- `/api/v1/chat`
- `/api/v1/category`

Note: `board/list/task` controller/route files exist in `src/`, but they are not mounted in `app.js` currently.

## Architecture Pattern
Project is being organized with a thin-controller pattern:
- Controllers: HTTP mapping only (`req`/`res`)
- Services: business logic
- Repositories: DB access helpers
- Shared error handler: `handleError` in `src/utils/response.js`

Example flow:
`route -> controller -> service -> repository/model -> controller response`

## UUID Convention
- Entities use integer `id` for internal FK relations.
- Public-facing routes mostly use `uuid` for get/update/delete.
- UUID is auto-generated at model level in `src/models/index.js` via hooks for models that have `uuid`.

## Setup
1. Install dependencies:
```bash
npm install
```

2. Configure `.env` (DB, JWT, mail, etc.).

3. Run migrations:
```bash
npx sequelize-cli db:migrate
```

4. Start dev server:
```bash
npm run dev
```

## Scripts
- `npm run dev` -> start with nodemon
- `npm run postman:generate` -> auto-generate Postman collection from `app.js`

## Postman
- Ready file: `postman_collection.json` (manually curated and updated)
- Import this file in Postman.
- Set variables:
  - `base_url` (default `http://localhost:8000`)
  - `token`
  - `uuid` and other IDs used by requests

## Key Folders
```text
src/
  controllers/      # Thin HTTP handlers
  services/         # Business logic
  repositories/     # Data access helpers
  models/           # Sequelize models + dynamic bootstrap
  migrations/       # DB schema changes
  routes/           # Express routes
  middlewares/      # Auth and request middleware
  utils/            # Shared helpers (response, token, permission, multer, etc.)
docs/               # SQL snapshots / notes
uploads/            # Local uploaded files
```

## Notes
- Standardized controller docs use:
  - `@desc`
  - `@route`
  - `@access`
- Shared controller error handling is centralized in:
  - `src/utils/response.js` -> `handleError(...)`
# node-admin-suite-api
