'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.renameTable('SemopayOrder', 'BootpayOrder');
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.renameTable('BootpayOrder', 'SemopayOrder');
  },
};
