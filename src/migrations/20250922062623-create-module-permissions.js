'use strict';
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('module_permissions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      moduleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'modules',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      permissionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'permissions',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // Unique key
    await queryInterface.addConstraint('module_permissions', {
      fields: ['moduleId', 'permissionId'],
      type: 'unique',
      name: 'unique_module_permission'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('module_permissions');
  },
};
