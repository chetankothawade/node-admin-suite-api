RENAME TABLE messageFiles TO message_files;

ALTER TABLE message_files
  CHANGE messageId message_id INT NOT NULL,
  CHANGE filePath file_path VARCHAR(255) NOT NULL,
  CHANGE fileType file_type VARCHAR(50) NULL,
  CHANGE fileSize file_size BIGINT NULL,
  CHANGE uploadedAt uploaded_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

