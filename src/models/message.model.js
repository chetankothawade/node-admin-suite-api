export default (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
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
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    replyToMessageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
    },
    messageType: {
      type: DataTypes.ENUM('text', 'file'),
      defaultValue: 'text',
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'messages',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });

  Message.associate = (models) => {
    // Message belongs to a sender (User)
    Message.belongsTo(models.User, {
      foreignKey: "senderId",
      as: "sender", // this alias must match your include
    });

    // Message has many files
    Message.hasMany(models.MessageFile, {
      foreignKey: "messageId",
      as: "files",
    });

    // Optional: Message has many statuses
    Message.hasMany(models.MessageStatus, {
      foreignKey: "messageId",
      as: "messageStatus",
    });

    // Message belongs to a Conversation
    Message.belongsTo(models.Conversation, {
      foreignKey: "conversationId"
    });

    // ✅ Self association for reply
    Message.belongsTo(models.Message, {
      foreignKey: "replyToMessageId",
      as: "replyToMessage", // The message being replied to

    });

    Message.hasMany(models.Message, {
      foreignKey: "replyToMessageId",
      as: "repliesToMe", // Messages that reply to this one
      inverse: { as: "replyToMessage" }
    });

  };

  return Message;
};
