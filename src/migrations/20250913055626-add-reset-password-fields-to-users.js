export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "resetPasswordToken", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "role",
    });

    await queryInterface.addColumn("Users", "resetPasswordExpire", {
      type: Sequelize.DATE,
      allowNull: true,
      after: "resetPasswordToken",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "resetPasswordToken");
    await queryInterface.removeColumn("Users", "resetPasswordExpire");
  },
};
