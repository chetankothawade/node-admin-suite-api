ALTER TABLE users
  CHANGE resetPasswordToken reset_password_token VARCHAR(191) NULL,
  CHANGE resetPasswordExpire reset_password_expire DATETIME(3) NULL,
  CHANGE createdAt created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CHANGE updatedAt updated_at DATETIME(3) NOT NULL;

