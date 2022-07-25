'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ConsoleUsers', 'publishCompany');
    await queryInterface.addColumn('ConsoleUsers', 'pcid', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'publishCompanies', key: 'pcid' },
      onDelete: 'set null',
      onUpdate: 'cascade',
      comment: '출판사 참조 아이디',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ConsoleUsers', 'pcid');
    await queryInterface.addColumn('ConsoleUsers', 'publishCompany', {
      type: Sequelize.STRING(50),
      allowNull: false,
      comment: '출판사',
    });
  },
};
