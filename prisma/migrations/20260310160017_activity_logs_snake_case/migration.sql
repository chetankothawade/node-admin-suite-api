RENAME TABLE activityLogs TO activity_logs;

ALTER TABLE activity_logs
  CHANGE boardId board_id INT NULL,
  CHANGE listId list_id INT NULL,
  CHANGE taskId task_id INT NULL,
  CHANGE userId user_id INT NOT NULL,
  CHANGE createdAt created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

