// models/modulePermission.model.js
import { DataTypes } from "@sequelize/core";

export default (sequelize) => {
  const ModulePermission = sequelize.define(
    "ModulePermission",
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
      moduleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "module_permissions", // match your table
      timestamps: true,                // createdAt & updatedAt
      underscored: false,               // snake_case columns
    }
  );

  ModulePermission.associate = (models) => {
    ModulePermission.belongsTo(models.Module, { foreignKey: "moduleId" });
    ModulePermission.belongsTo(models.Permission, { foreignKey: "permissionId" });
    ModulePermission.hasMany(models.UserPermission, { foreignKey: "modulePermissionId" });
  };

  return ModulePermission;
};
