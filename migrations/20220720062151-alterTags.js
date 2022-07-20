'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tags', 'cid', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Categories', key: 'cid' },
      onDelete: 'set null',
      onUpdate: 'cascade',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tags', 'cid');
  },
};
