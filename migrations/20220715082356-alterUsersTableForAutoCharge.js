'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'isAutoCharged', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('Users', 'lessThenAmount', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 10000,
    });
    await queryInterface.addColumn('Users', 'chargeAmount', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 20000,
    });
    await queryInterface.addColumn('UserBillingKeys', 'isAutoCharged', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'isAutoCharged');
    await queryInterface.removeColumn('Users', 'lessThenAmount');
    await queryInterface.removeColumn('Users', 'chargeAmount');
    await queryInterface.removeColumn('UserBillingKeys', 'isAutoCharged');
  },
};
