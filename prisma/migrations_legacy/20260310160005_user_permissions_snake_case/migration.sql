ALTER TABLE user_permissions
  CHANGE userId user_id INT NOT NULL,
  CHANGE modulePermissionId module_permission_id INT NOT NULL,
  CHANGE createdAt created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CHANGE updatedAt updated_at DATETIME(3) NOT NULL;

ALTER TABLE user_permissions
  DROP INDEX unique_user_permission,
  ADD CONSTRAINT unique_user_permission UNIQUE (user_id, module_permission_id);

