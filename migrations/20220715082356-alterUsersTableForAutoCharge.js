'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'isAutoCharge', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'lessThenAmount', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'chargeAmount', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('UserBillingKeys', 'isAutoCharged', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'isAutoCharge');
    await queryInterface.removeColumn('Users', 'lessThenAmount');
    await queryInterface.removeColumn('Users', 'chargeAmount');
    await queryInterface.removeColumn('UserBillingKeys', 'isAutoCharged');
  },
};
