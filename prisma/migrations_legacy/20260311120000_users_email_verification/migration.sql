ALTER TABLE `users`
  ADD COLUMN `email_verified` ENUM('Y','N') NOT NULL DEFAULT 'N' AFTER `email`,
  ADD COLUMN `email_verified_at` DATETIME NULL AFTER `email_verified`;
