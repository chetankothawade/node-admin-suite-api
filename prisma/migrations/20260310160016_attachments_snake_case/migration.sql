ALTER TABLE attachments
  CHANGE taskId task_id INT NOT NULL,
  CHANGE fileName file_name VARCHAR(255) NULL,
  CHANGE filePath file_path VARCHAR(255) NULL,
  CHANGE uploadedBy uploaded_by INT NOT NULL,
  CHANGE uploadedAt uploaded_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

