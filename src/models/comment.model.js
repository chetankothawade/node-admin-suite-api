'use strict';
export default (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      taskId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: 'comments',
      timestamps: true,
      updatedAt: false,
    }
  );

  // Comment.associate = (models) => {
  //   Comment.belongsTo(models.Task, { foreignKey: 'taskId', as: 'task', onDelete: 'CASCADE' });
  //   Comment.belongsTo(models.User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
  // };

  Comment.associate = (models) => {
    Comment.belongsTo(models.Task, {
      foreignKey: { name: 'taskId', onDelete: 'CASCADE' },
      as: 'task',
    });

    Comment.belongsTo(models.User, {
      foreignKey: { name: 'userId', onDelete: 'CASCADE' },
      as: 'user',
    });
  };

  return Comment;
};
