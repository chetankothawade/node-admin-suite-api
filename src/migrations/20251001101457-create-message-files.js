'use strict';
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messageFiles', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      messageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'messages',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      filePath: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      fileType: {
        type: Sequelize.STRING(50),
      },
      fileSize: {
        type: Sequelize.BIGINT,
      },
      uploadedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('messageFiles');
  },
};