'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('ConsoleUsers', 'account', 'username', {
      type: Sequelize.STRING(50),
      unique: true,
      allowNull: false,
      comment: '아이디(계정)',
    });
    await queryInterface.removeColumn('ConsoleUsers', 'lastLoggedInAt');
    await queryInterface.addColumn('ConsoleUsers', 'lastLoggedInAt', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: '마지막 로그인 시간',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('ConsoleUsers', 'username', 'account', {
      type: Sequelize.STRING(50),
      unique: true,
      allowNull: false,
      comment: '아이디(계정)',
    });
  },
};
