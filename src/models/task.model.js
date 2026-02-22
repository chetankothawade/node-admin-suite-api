'use strict';
export default (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'Task',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      listId: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT },
      dueDate: { type: DataTypes.DATE },
      priority: { type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'medium' },
      position: { type: DataTypes.INTEGER, defaultValue: 0 },
      createdBy: { type: DataTypes.INTEGER, allowNull: false },
      assignedTo: { type: DataTypes.INTEGER },
      tags: { type: DataTypes.TEXT },
      status: { type: DataTypes.ENUM('pending', 'completed', 'cancelled'), defaultValue: 'pending' },
      active: { type: DataTypes.ENUM('Y', 'N'), defaultValue: 'Y' },
    },
    {
      tableName: 'tasks',
      timestamps: true,
    }
  );

  // Task.associate = (models) => {
  //   Task.belongsTo(models.List, { foreignKey: 'listId', as: 'list', onDelete: 'CASCADE' });
  //   Task.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  //   Task.belongsTo(models.User, { foreignKey: 'assignedTo', as: 'assignee' });

  //   Task.hasMany(models.Comment, { foreignKey: 'taskId', as: 'comments', onDelete: 'CASCADE' });
  //   Task.hasMany(models.Attachment, { foreignKey: 'taskId', as: 'attachments', onDelete: 'CASCADE' });
  //   Task.hasMany(models.ActivityLog, { foreignKey: 'taskId', as: 'activityLogs', onDelete: 'CASCADE' });
  // };


  Task.associate = (models) => {
    Task.belongsTo(models.List, {
      foreignKey: { name: 'listId', onDelete: 'CASCADE' },
      as: 'list',
    });

    Task.belongsTo(models.User, {
      foreignKey: { name: 'createdBy' },
      as: 'creator',
    });

    Task.belongsTo(models.User, {
      foreignKey: { name: 'assignedTo' },
      as: 'assignee',
    });

    Task.hasMany(models.Comment, {
      foreignKey: { name: 'taskId', onDelete: 'CASCADE' },
      as: 'comments',
    });

    Task.hasMany(models.Attachment, {
      foreignKey: { name: 'taskId', onDelete: 'CASCADE' },
      as: 'attachments',
    });

    Task.hasMany(models.ActivityLog, {
      foreignKey: { name: 'taskId', onDelete: 'CASCADE' },
      as: 'activityLogs',
    });
  };
  return Task;
};
