// models/permission.model.js
import { DataTypes } from "@sequelize/core";

export default (sequelize) => {
  const Permission = sequelize.define(
    "Permission",
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
    },
    {
      tableName: "permissions", // ✅ match your table name
      timestamps: true,         // if you have createdAt/updatedAt
      underscored: false,        // if your columns are snake_case
    }
  );

  Permission.associate = (models) => {
    Permission.hasMany(models.ModulePermission, { foreignKey: "permissionId" });
  };

  return Permission;
};
