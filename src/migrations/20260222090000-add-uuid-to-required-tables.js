'use strict';
import { randomUUID } from 'crypto';

const REQUIRED_TABLES = [
  'users',
  'modules',
  'modules ',
  'permissions',
  'module_permissions',
  'user_permissions',
  'cms',
  'conversations',
  'conversationMembers',
  'messages',
  'messageFiles',
  'messageStatus',
  'boards',
  'lists',
  'tasks',
  'comments',
  'attachments',
  'activityLogs',
  'categories',
];

export default {
  async up(queryInterface, Sequelize) {
    for (const tableName of REQUIRED_TABLES) {
      let tableDefinition;
      try {
        tableDefinition = await queryInterface.describeTable(tableName);
      } catch {
        continue;
      }

      if (!tableDefinition.uuid) {
        await queryInterface.addColumn(tableName, 'uuid', {
          type: Sequelize.UUID,
          allowNull: true,
          after: 'id',
        });
      }

      const [rows] = await queryInterface.sequelize.query(
        `SELECT id FROM \`${tableName}\` WHERE uuid IS NULL`
      );

      for (const row of rows) {
        await queryInterface.sequelize.query(
          `UPDATE \`${tableName}\` SET uuid = :uuid WHERE id = :id`,
          {
            replacements: { uuid: randomUUID(), id: row.id },
          }
        );
      }

      await queryInterface.changeColumn(tableName, 'uuid', {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      });

      try {
        await queryInterface.addIndex(tableName, ['uuid'], {
          unique: true,
          name: `${tableName.replace(/\s+/g, '_')}_uuid_unique`,
        });
      } catch {
        // Ignore if index already exists from a partial previous run.
      }
    }
  },

  async down(queryInterface) {
    for (const tableName of REQUIRED_TABLES) {
      let tableDefinition;
      try {
        tableDefinition = await queryInterface.describeTable(tableName);
      } catch {
        continue;
      }

      if (!tableDefinition.uuid) {
        continue;
      }

      try {
        await queryInterface.removeIndex(
          tableName,
          `${tableName.replace(/\s+/g, '_')}_uuid_unique`
        );
      } catch {
        // Ignore if index does not exist.
      }

      await queryInterface.removeColumn(tableName, 'uuid');
    }
  },
};
