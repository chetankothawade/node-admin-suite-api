'use strict';
export default (sequelize, DataTypes) => {
  const List = sequelize.define(
    'List',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      boardId: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false },
      position: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      tableName: 'lists',
      timestamps: true,
    }
  );

  // List.associate = (models) => {
  //   List.belongsTo(models.Board, { foreignKey: 'boardId', as: 'board', onDelete: 'CASCADE' });
  //   List.hasMany(models.Task, { foreignKey: 'listId', as: 'tasks', onDelete: 'CASCADE' });
  //   List.hasMany(models.ActivityLog, { foreignKey: 'listId', as: 'activityLogs', onDelete: 'CASCADE' });
  // };

  List.associate = (models) => {
    List.belongsTo(models.Board, {
      foreignKey: { name: 'boardId', onDelete: 'CASCADE' },
      as: 'board',
    });

    List.hasMany(models.Task, {
      foreignKey: { name: 'listId', onDelete: 'CASCADE' },
      as: 'tasks',
    });

    List.hasMany(models.ActivityLog, {
      foreignKey: { name: 'listId', onDelete: 'CASCADE' },
      as: 'activityLogs',
    });
  };

  return List;
};
