export default (sequelize, DataTypes) => {
  const MessageFile = sequelize.define('MessageFile', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    messageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING(50),
    },
    fileSize: {
      type: DataTypes.BIGINT,
    },
    uploadedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'messageFiles',
    timestamps: true,
    createdAt: 'uploadedAt',
    updatedAt: false,
  });

  return MessageFile;
};
