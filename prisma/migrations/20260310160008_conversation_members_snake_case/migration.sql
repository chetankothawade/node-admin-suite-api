RENAME TABLE conversationMembers TO conversation_members;

ALTER TABLE conversation_members
  CHANGE conversationId conversation_id INT NOT NULL,
  CHANGE userId user_id INT NOT NULL,
  CHANGE joinedAt joined_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CHANGE updatedAt updated_at DATETIME(3) NULL;

