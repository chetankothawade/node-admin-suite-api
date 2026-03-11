ALTER TABLE module_permissions
  ALGORITHM=INPLACE,
  LOCK=NONE,
  CHANGE moduleId module_id INT NOT NULL,
  CHANGE permissionId permission_id INT NOT NULL,
  CHANGE createdAt created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CHANGE updatedAt updated_at DATETIME(3) NOT NULL;
