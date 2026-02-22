# Changelog

All notable project updates are documented here.

## 2026-02-22

### Added
- Project `CHANGELOG.md`.
- `docs/README.md` with SQL/docs usage notes.
- Common error utility `handleError(...)` in `src/utils/response.js`.
- Service/repository scaffolding for modules:
  - `auth`, `module`, `cms`, `board`, `list`, `task`, `category`, `chat`.
- Laravel-style UUID auto-generation hooks in `src/models/index.js`.
- Postman collection updates in `postman_collection.json`.

### Changed
- Refactored controllers to thin-controller pattern (request/response mapping only) for:
  - `auth`, `user`, `module`, `cms`, `board`, `list`, `task`, `category`.
- Moved business logic into services for above modules.
- Standardized controller documentation blocks to:
  - `@desc`, `@route`, `@access`.
- Standardized `@access` values to `Public` and `Authenticated`.
- Updated public CRUD route params to UUID in relevant modules.
- Updated `README.md` with current architecture, route mounting, setup, and Postman guidance.

### Fixed
- Sequelize model bootstrap compatibility with `@sequelize/core` (removed `rawAttributes` usage).
- Migration compatibility for replicated MySQL setups by avoiding unsafe DB UUID function usage.

### Notes
- `board/list/task` route files exist but are not currently mounted in `app.js`.
- `chat.controller.js` still contains direct controller-level business logic; partial refactor scaffold exists.
