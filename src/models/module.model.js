import { DataTypes } from "@sequelize/core";

export default (sequelize) => {
  const Module = sequelize.define(
    "Module",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      parentId: { type: DataTypes.INTEGER, defaultValue: 0 },
      name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      url: { type: DataTypes.STRING(100) },
      icon: { type: DataTypes.STRING(100) },
      seqNo: { type: DataTypes.INTEGER },
      isSubModule: { type: DataTypes.ENUM("Y", "N"), defaultValue: "N"},
      status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" },
      isPermission: { type: DataTypes.ENUM("Y", "N"), defaultValue: "N" },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "modules",
      timestamps: true,
    }
  );

  Module.associate = (models) => {
    // 🔹 Self-association with inverse.as
    Module.hasMany(models.Module, { as: "children", foreignKey: "parentId", inverse: { as: "parent" } });
    Module.belongsTo(models.Module, { as: "parent", foreignKey: "parentId" });

    // 🔹 Module → permissions
    if (models.ModulePermission) {
      Module.hasMany(models.ModulePermission, { foreignKey: "moduleId" });
    }
  };

  return Module;
};
