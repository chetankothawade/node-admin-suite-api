// models/userPermission.model.js
import { DataTypes } from "@sequelize/core";

export default (sequelize) => {
  const UserPermission = sequelize.define(
    "UserPermission",
    {
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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      modulePermissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "user_permissions", // match your table
      timestamps: true,             // createdAt & updatedAt
      underscored: false,            // snake_case columns
    }
  );

  UserPermission.associate = (models) => {
    UserPermission.belongsTo(models.User, { foreignKey: "userId" });
    UserPermission.belongsTo(models.ModulePermission, { foreignKey: "modulePermissionId" });
  };

  return UserPermission;
};
