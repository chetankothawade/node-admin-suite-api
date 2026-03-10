RENAME TABLE messageStatus TO message_status;

ALTER TABLE message_status
  CHANGE messageId message_id INT NOT NULL,
  CHANGE userId user_id INT NOT NULL,
  CHANGE updatedAt updated_at DATETIME(3) NOT NULL;

