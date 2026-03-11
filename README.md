# Node Admin API

Express + Prisma (MySQL) backend for authentication, user management, access control, CMS content, chat, and categories.

## Tech Stack
- Node.js (ES modules)
- Express 5
- Prisma ORM + MySQL
- JWT authentication
- Socket.io (chat socket utilities)
- Multer (file uploads)
- i18n (`locales/en.json`)

## Features
- Auth: register, login, logout, forgot password, reset password
- Email flow:
  - register sends welcome email
  - verification email is sent with tokenized link
  - login requires verified email (`email_verified = Y`)
- User management: profile, CRUD, status updates, CSV export
- Access control:
  - module CRUD and active module tree
  - role-module matrix and toggle
  - user-permission matrix, toggle, module-access, and sidebar menu
- CMS CRUD and status management
- Chat: conversations, messages, attachments, read status, unread counts
- Category management with active/inactive states
- Prisma migrations + seeders for baseline data

## API Base
- Server default: `http://localhost:8000`
- API prefix: `/api/v1`
- Health endpoint: `GET /health`

## Mounted Route Groups
- `/api/v1` (auth routes)
- `/api/v1/user`
- `/api/v1/module`
- `/api/v1/user-permissions`
- `/api/v1/role-modules`
- `/api/v1/cms`
- `/api/v1/editor`
- `/api/v1/chat`
- `/api/v1/category`

## Quick Start
1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`.

3. Generate Prisma client and apply migrations:
```bash
npm run prisma:generate
npm run prisma:deploy
```

4. Seed initial data:
```bash
npm run db:seed
```

5. Run development server:
```bash
npm run dev
```

## Required Environment Variables
Set these keys in `.env` (use secure values for non-local environments):

```env
APP_NAME=NACK
PORT=8000
NODE_ENV=development

SECRET_KEY=your_user_jwt_secret
ADMIN_SECRET_KEY=your_admin_jwt_secret
JWT_EXPIRES_IN=7d
ADMIN_JWT_EXPIRES_IN=1d

DB_HOST=localhost
DB_PORT=3306
DB_NAME=prisma_db
DB_USER=root
DB_PASS=
DATABASE_URL=mysql://root:password@localhost:3306/prisma_db

CLIENT_ORIGIN=http://localhost:3000
FRONTEND_USER_URL=http://localhost:3000
FRONTEND_ADMIN_URL=http://localhost:3000/admin

MAIL_MAILER=smtp
MAIL_HOST=your_smtp_host
MAIL_PORT=2525
MAIL_USER=your_smtp_user
MAIL_PASS=your_smtp_pass
MAIL_FROM_EMAIL=no-reply@example.com
MAIL_FROM_NAME=NACK
EMAIL_VERIFICATION_SECRET=your_email_verification_secret
EMAIL_VERIFICATION_EXPIRES_IN=24h
APP_BASE_URL=http://localhost:8000

baseUrl=http://localhost:3000
```

## Authentication
Protected routes require:
- Header: `Authorization: Bearer <token>`
- Tokens are signed with `SECRET_KEY` (user) or `ADMIN_SECRET_KEY` (admin)
- `user-permissions` routes are protected by `isAuthenticated`
- `role-modules` routes should be called with authenticated admin/super-admin token

## File Uploads
- Static URL root: `/uploads`
- User avatars: handled by `uploadImage`
- Chat attachments: handled by `uploadChat`
- Editor uploads: `POST /api/v1/editor/upload`

## Scripts
- `npm run dev` - Start server with nodemon
- `npm run postman:generate` - Generate `postman_collection.json` from routes
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Create/apply development migrations
- `npm run prisma:deploy` - Apply migrations for deployment
- `npm run db:seed` - Run Prisma seeders
- `npm run db:reset` - Reset database and reapply migrations

## Database and Seeders
Prisma schema is at `prisma/schema.prisma`.

Seed flow (`prisma/seed.js`) currently runs:
- permissions seeder
- roles seeder
- users seeder
- categories seeder

## Project Structure
```text
src/
  controllers/      HTTP handlers
  services/         business logic
  repositories/     repository helpers
  routes/           API route definitions
  middlewares/      auth middleware
  utils/            shared utilities
  lib/              Prisma singleton
  socket/           Socket.io server helpers
prisma/
  schema.prisma     database schema
  migrations/       Prisma migrations
  seeders/          seed scripts
docs/               additional notes
uploads/            local uploaded files
```

## API Testing
- Import `postman_collection.json` into Postman.
- Collection variables use:
  - `base_url = http://localhost:8000`
  - `api_base_url = {{base_url}}/api/v1`
- Use `{{api_base_url}}/...` for all API endpoints, and `{{base_url}}/health` for health check.
- Postman tests auto-set variables (`token`, `user_id`, `uuid`, `role`) from auth/user responses.
- Rebuild collection after route changes:
```bash
npm run postman:generate
```

## Access Control Endpoints (v1)
- Module
  - `GET /module/`
  - `GET /module/list`
  - `GET /module/list/:id`
  - `POST /module/create`
  - `PUT /module/update/:uuid`
  - `DELETE /module/delete/:uuid`
  - `GET /module/get/:uuid`
  - `PUT /module/status/:uuid`
  - `GET /module/getList`
- Role Modules
  - `GET /role-modules/matrix`
  - `POST /role-modules/toggle`
- User Permissions
  - `POST /user-permissions/toggle`
  - `GET /user-permissions/getAll/:uuid`
  - `GET /user-permissions/module-access/:uuid`
  - `GET /user-permissions/side-menu`

## Notes
- Keep `.env` secrets private and never commit production credentials.
- `src/socket/server.js` contains Socket.io setup utilities; default app startup currently uses `index.js` + `app.js`.
- New auth verification APIs:
  - `POST /api/v1/send-email-verification`
  - `GET /api/v1/verify-email/:token`
