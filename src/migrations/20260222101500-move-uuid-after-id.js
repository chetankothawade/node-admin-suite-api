'use strict';

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
  async up(queryInterface) {
    for (const tableName of REQUIRED_TABLES) {
      let tableDefinition;
      try {
        tableDefinition = await queryInterface.describeTable(tableName);
      } catch {
        continue;
      }

      if (!tableDefinition.id || !tableDefinition.uuid) {
        continue;
      }

      await queryInterface.sequelize.query(
        `ALTER TABLE \`${tableName}\` MODIFY COLUMN \`uuid\` CHAR(36) NOT NULL AFTER \`id\``
      );
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

      await queryInterface.sequelize.query(
        `ALTER TABLE \`${tableName}\` MODIFY COLUMN \`uuid\` CHAR(36) NOT NULL`
      );
    }
  },
};
