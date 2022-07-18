'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('WorkbookHistory', ['wid'], {
      type: 'foreign key',
      references: { table: 'Workbooks', field: 'wid' },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('WorkbookHistory', ['uid'], {
      type: 'foreign key',
      references: { table: 'Users', field: 'uid' },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
