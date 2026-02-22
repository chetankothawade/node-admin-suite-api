'use strict';
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('activityLogs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      boardId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'boards',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      listId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'lists',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      taskId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'tasks',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      action: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('activityLogs');
  },
};
