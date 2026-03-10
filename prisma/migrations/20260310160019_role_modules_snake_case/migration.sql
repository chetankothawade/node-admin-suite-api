ALTER TABLE role_modules
  CHANGE moduleId module_id BIGINT UNSIGNED NOT NULL,
  CHANGE createdAt created_at DATETIME(3) NULL,
  CHANGE updatedAt updated_at DATETIME(3) NULL;

ALTER TABLE role_modules
  DROP INDEX role_module_unique,
  ADD CONSTRAINT role_module_unique UNIQUE (role, module_id);

