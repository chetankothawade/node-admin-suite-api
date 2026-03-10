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
- User management: profile, CRUD, status updates, CSV export
- Access control: modules, permissions, user-level permission toggling
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
- `/api/v1/access`
- `/api/v1/module`
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
APP_NAME=NodeApp
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
MAIL_FROM_NAME=NodeApp

baseUrl=http://localhost:3000
```

## Authentication
Protected routes require:
- Header: `Authorization: Bearer <token>`
- Tokens are signed with `SECRET_KEY` (user) or `ADMIN_SECRET_KEY` (admin)

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
- Rebuild collection after route changes:
```bash
npm run postman:generate
```

## Notes
- Keep `.env` secrets private and never commit production credentials.
- `src/socket/server.js` contains Socket.io setup utilities; default app startup currently uses `index.js` + `app.js`.
