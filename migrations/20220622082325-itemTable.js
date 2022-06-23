'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Items.discountPrice
    await queryInterface.addColumn('Items', 'originalPrice', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    // Workbooks.originalPrice -> paperbookPrice
    await queryInterface.renameColumn('Workbooks', 'originalPrice', 'paperbookPrice');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Items', 'originalPrice');
    await queryInterface.renameColumn('Workbooks', 'paperbookPrice', 'originalPrice');
  },
};
