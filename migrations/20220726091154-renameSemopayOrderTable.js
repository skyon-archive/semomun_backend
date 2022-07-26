'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.renameTable('SemopayOrder', 'BootpayOrders');
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.renameTable('BootpayOrders', 'SemopayOrder');
  },
};
