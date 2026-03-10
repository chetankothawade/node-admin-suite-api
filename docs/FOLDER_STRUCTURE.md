# Project Folder Structure

This document explains the current project layout and what each major folder is responsible for.

## Root Tree

```text
node_api_new/
|- app.js
|- index.js
|- package.json
|- README.md
|- CHANGELOG.md
|- postman_collection.json
|- prisma/
|  |- schema.prisma
|  |- migrations/
|  |- seed.js
|  `- seeders/
|- src/
|  |- config/
|  |- controllers/
|  |- lib/
|  |- middlewares/
|  |- repositories/
|  |- routes/
|  |  |- v1/
|  |  `- v2/
|  |- services/
|  |  `- storage/
|  |- socket/
|  `- utils/
|- docs/
|- emails/
|- locales/
`- uploads/
```

## Folder Details

- `app.js`: Express app setup, middleware stack, API version mounts (`/api/v1`, `/api/v2`), static upload serving.
- `index.js`: Server bootstrap and port listener.
- `prisma/`: Database schema, migrations, and seed scripts.
- `src/controllers/`: HTTP layer. Validates request input and formats API responses.
- `src/services/`: Business logic layer.
- `src/services/storage/`: Storage abstraction (`local`, `s3`) via `storageManager`.
- `src/repositories/`: Data-access layer (Prisma query wrappers).
- `src/routes/`: Route definitions grouped by module and version.
- `src/routes/v1/`: Current stable API route aggregator.
- `src/routes/v2/`: Next-version route scaffold for breaking changes.
- `src/middlewares/`: Cross-cutting request middleware (`isAuthenticated`, etc.).
- `src/utils/`: Shared helpers (responses, tokens, multer, file-path helpers).
- `src/socket/`: Socket.IO server and realtime chat utilities.
- `src/config/`: App/service configs (DB, S3).
- `src/lib/`: Shared library instances (Prisma client singleton).
- `emails/`: Email templates and assets.
- `locales/`: i18n translation files.
- `uploads/`: Local filesystem upload base path (controlled by `UPLOAD_PATH`).
- `docs/`: Additional project documentation.

## API Layer Flow

```text
Route -> Controller -> Service -> Repository -> Prisma -> Database
```

## Storage Flow

```text
Multer (memory) -> StorageManager -> LocalStorage/S3Storage -> URL saved in DB
```
