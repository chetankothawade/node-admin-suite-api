ALTER TABLE conversations
  CHANGE createdBy created_by INT NULL,
  CHANGE createdAt created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

