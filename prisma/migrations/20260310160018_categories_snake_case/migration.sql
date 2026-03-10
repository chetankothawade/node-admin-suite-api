ALTER TABLE categories
  CHANGE parentId parent_id INT NULL,
  CHANGE createdAt created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CHANGE updatedAt updated_at DATETIME(3) NOT NULL;

