'use strict';
export default (sequelize, DataTypes) => {
  const Attachment = sequelize.define(
    'Attachment',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      taskId: { type: DataTypes.INTEGER, allowNull: false },
      fileName: { type: DataTypes.STRING(255) },
      filePath: { type: DataTypes.STRING(255) },
      uploadedBy: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: 'attachments',
      createdAt: 'uploadedAt',
      updatedAt: false,
    }
  );

  // Attachment.associate = (models) => {
  //   Attachment.belongsTo(models.Task, { foreignKey: 'taskId', as: 'task', onDelete: 'CASCADE' });
  //   Attachment.belongsTo(models.User, { foreignKey: 'uploadedBy', as: 'uploader' });
  // };


  Attachment.associate = (models) => {
    Attachment.belongsTo(models.Task, {
      foreignKey: { name: 'taskId', onDelete: 'CASCADE' },
      as: 'task',
    });

    Attachment.belongsTo(models.User, {
      foreignKey: { name: 'uploadedBy' },
      as: 'uploader',
    });
  };

  return Attachment;
};
