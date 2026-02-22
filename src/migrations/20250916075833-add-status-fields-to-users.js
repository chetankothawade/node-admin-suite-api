export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "status", {
      type: Sequelize.ENUM("active", "inactive", "suspended"),
      allowNull: true,
      defaultValue: 'active',
      after: "resetPasswordExpire",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "status");
  },
};
