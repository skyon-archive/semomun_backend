'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ConsoleUsers', 'account');
    await queryInterface.addColumn('ConsoleUsers', 'username', {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
      comment: '아이디(계정)',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ConsoleUsers', 'username');
    await queryInterface.addColumn('ConsoleUsers', 'account', {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
      comment: '아이디',
    });
  },
};
