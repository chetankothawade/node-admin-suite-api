'use strict';
export default (sequelize, DataTypes) => {
  const ActivityLog = sequelize.define(
    'ActivityLog',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      boardId: { type: DataTypes.INTEGER },
      listId: { type: DataTypes.INTEGER },
      taskId: { type: DataTypes.INTEGER },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      action: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      tableName: 'activityLogs',
      createdAt: true,
      updatedAt: false,
    }
  );

  // ActivityLog.associate = (models) => {
  //   ActivityLog.belongsTo(models.Board, { foreignKey: 'boardId', as: 'board', onDelete: 'CASCADE' });
  //   ActivityLog.belongsTo(models.List, { foreignKey: 'listId', as: 'list', onDelete: 'CASCADE' });
  //   ActivityLog.belongsTo(models.Task, { foreignKey: 'taskId', as: 'task', onDelete: 'CASCADE' });
  //   ActivityLog.belongsTo(models.User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
  // };

  ActivityLog.associate = (models) => {
    ActivityLog.belongsTo(models.Board, {
      foreignKey: { name: 'boardId', onDelete: 'CASCADE' },
      as: 'board',
    });
    ActivityLog.belongsTo(models.List, {
      foreignKey: { name: 'listId', onDelete: 'CASCADE' },
      as: 'list',
    });
    ActivityLog.belongsTo(models.Task, {
      foreignKey: { name: 'taskId', onDelete: 'CASCADE' },
      as: 'task',
    });
    ActivityLog.belongsTo(models.User, {
      foreignKey: { name: 'userId', onDelete: 'CASCADE' },
      as: 'user',
    });
  };
  return ActivityLog;
};
