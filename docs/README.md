# Project Docs

## Suggested App Name
- `OpsPilot API` (recommended)
- Alternatives: `AdminFlow API`, `CorePanel API`, `ControlDock API`

## Core Features Covered
- Auth module (JWT login/register/reset flows)
- User module (UUID routes, CSV export, status updates)
- Module/permission access system
- CMS CRUD
- Chat module with conversations/messages/read status
- Category hierarchy support
- Shared response/error utility (`sendResponse`, `handleError`)
- Service-first architecture with thin controllers

## Practical Notes
- API base path in app: `/api/v1`
- Health endpoint: `/health`
- Import `postman_collection.json` for ready API testing
- Run DB migrations before starting:
  - `npx sequelize-cli db:migrate`
