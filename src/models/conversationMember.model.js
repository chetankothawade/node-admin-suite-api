export default (sequelize, DataTypes) => {
    const ConversationMember = sequelize.define('ConversationMember', {
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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        joinedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'conversationMembers',
        timestamps: true,
        createdAt: 'joinedAt',
        updatedAt: false,
    });


    ConversationMember.associate = (models) => {
        ConversationMember.belongsTo(models.User, {
            foreignKey: "userId",
            as: "user"
        });
        ConversationMember.belongsTo(models.Conversation, {
            foreignKey: "conversationId",
            as: "conversation"
        });
    };

    return ConversationMember;
};
