ALTER TABLE modules
  CHANGE parentId parent_id INT NOT NULL DEFAULT 0,
  CHANGE seqNo seq_no INT NULL,
  CHANGE isSubModule is_sub_module ENUM('Y','N') NOT NULL DEFAULT 'N',
  CHANGE isPermission is_permission ENUM('Y','N') NOT NULL DEFAULT 'N',
  CHANGE createdAt created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CHANGE updatedAt updated_at DATETIME(3) NOT NULL;

