'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ConsoleUsers', 'role');
    await queryInterface.addColumn('ConsoleUsers', 'role', {
      type: Sequelize.STRING(20),
      allowNull: false,
      comment: '권한/역할',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ConsoleUsers', 'role');
    await queryInterface.addColumn('ConsoleUsers', 'role', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'User',
      comment: '권한/역할',
    });
  },
};
