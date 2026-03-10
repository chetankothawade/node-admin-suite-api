ALTER TABLE messages
  CHANGE conversationId conversation_id INT NOT NULL,
  CHANGE senderId sender_id INT NOT NULL,
  CHANGE replyToMessageId reply_to_message_id INT NULL,
  CHANGE messageType message_type ENUM('text','file') NOT NULL DEFAULT 'text',
  CHANGE createdAt created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CHANGE updatedAt updated_at DATETIME(3) NULL;

