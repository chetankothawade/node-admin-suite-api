export default (sequelize, DataTypes) => {
  const MessageStatus = sequelize.define('MessageStatus', {
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('sent', 'delivered', 'read'),
      defaultValue: 'sent',
    },
  }, {
    tableName: 'messageStatus',
    timestamps: true,
    createdAt: false,
    updatedAt: 'updatedAt',
  });
  
  MessageStatus.associate = (models) => {
    MessageStatus.belongsTo(models.Message, { foreignKey: "messageId" });
    MessageStatus.belongsTo(models.User, { foreignKey: "userId" });
  };
  return MessageStatus;
};
