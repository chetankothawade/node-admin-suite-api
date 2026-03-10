ALTER TABLE tasks
  CHANGE listId list_id INT NOT NULL,
  CHANGE dueDate due_date DATETIME(3) NULL,
  CHANGE createdBy created_by INT NOT NULL,
  CHANGE assignedTo assigned_to INT NULL,
  CHANGE createdAt created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CHANGE updatedAt updated_at DATETIME(3) NOT NULL;

