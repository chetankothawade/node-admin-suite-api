// models/category.model.js
import { DataTypes } from "@sequelize/core";

export default (sequelize) => {
    const Category = sequelize.define(
        "Category",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                unique: true
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            parentId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM("active", "inactive"),
                defaultValue: "active",
                allowNull: false,
            },
        },
        {
            tableName: "categories",
            timestamps: true,  // createdAt + updatedAt auto-managed
            underscored: false // using camelCase columns
        }
    );

    // ✅ Associations
    Category.associate = (models) => {
        // A category may belong to another category (its parent)
        Category.belongsTo(models.Category, {
            as: "parent",
            foreignKey: "parentId",
        });

        // A category may have multiple subcategories (children)
        Category.hasMany(models.Category, {
            as: "subcategories",
            foreignKey: "parentId",
            inverse: { as: "parent" }
        });
    };

    return Category;
};
