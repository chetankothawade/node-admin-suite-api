// models/user.model.js
import { DataTypes, Model } from "@sequelize/core";
import bcrypt from "bcryptjs";
const SALT_ROUNDS = 10;

export default (sequelize) => {
  class User extends Model {
    /**
     * Compare a plain-text password with the hashed one
     * @param {string} plainPassword
     * @returns {Promise<boolean>}
     */
    async comparePassword(plainPassword) {
      return bcrypt.compare(plainPassword, this.password);
    }

    /**
     * Find user by email
     * @param {string} email
     * @returns {Promise<User|null>}
     */
    static async findByEmail(email) {
      return this.findOne({ where: { email } });
    }

    /**
     * Override toJSON to exclude sensitive data
     */
    toJSON() {
      const attributes = { ...this.get() };
      delete attributes.password;
      return attributes;
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: { msg: "validation.name_required" },
        }

      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: { msg: "validation.email_invalid" },
          notEmpty: { msg: "validation.email_required" },
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: "validation.password_required" },
          len: { args: [6, 255], msg: "validation.password_length" },
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        validate: {
          is: {
            args: [/^[0-9+\-() ]*$/],
            msg: "validation.phone_invalid", // just the key
          },
        },
      },
      avatar: { type: DataTypes.STRING(255) },
      role: {
        type: DataTypes.ENUM("user", "admin", "super_admin"),
        defaultValue: "user"
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "suspended"),
        defaultValue: "active"
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpire: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
      timestamps: true,
      // paranoid: true, // ✅ enables soft deletes (good practice)
      // underscored: true, // ✅ snake_case columns (industry convention)
      defaultScope: {
        attributes: { exclude: ["password"] }, // ✅ hide password by default
      },
      scopes: {
        withPassword: {
          attributes: {} // includes all fields
        },
      },
    }
  );

  /**
   * Hooks for password hashing
   */
  User.addHook("beforeCreate", async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
    }
  });

  User.addHook("beforeUpdate", async (user) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
    }
  });

  User.associate = (models) => {
    User.hasMany(models.UserPermission, { foreignKey: "userId" });

    User.hasMany(models.ConversationMember, { foreignKey: "userId" });

  };
  return User;
};
