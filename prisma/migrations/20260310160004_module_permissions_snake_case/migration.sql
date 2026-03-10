ALTER TABLE module_permissions
  CHANGE moduleId module_id INT NOT NULL,
  CHANGE permissionId permission_id INT NOT NULL,
  CHANGE createdAt created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CHANGE updatedAt updated_at DATETIME(3) NOT NULL;

ALTER TABLE module_permissions
  DROP INDEX unique_module_permission,
  ADD CONSTRAINT unique_module_permission UNIQUE (module_id, permission_id);

