'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('role_modules', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('super_admin', 'admin', 'user'),
        allowNull: false,
      },
      moduleId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
    });

    await queryInterface.addConstraint('role_modules', {
      fields: ['role', 'moduleId'],
      type: 'unique',
      name: 'role_module_unique',
    });

    await queryInterface.addIndex('role_modules', ['moduleId'], {
      name: 'role_modules_moduleId_foreign',
    });

    await queryInterface.addIndex('role_modules', ['role'], {
      name: 'role_modules_role_index',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('role_modules');
  },
};
