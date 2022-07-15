'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('SemopayOrder', 'cancelled_price', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('SemopayOrder', 'cancelled_tax_free', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('SemopayOrder', 'company_name', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('SemopayOrder', 'gateway_url', {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
    await queryInterface.addColumn('SemopayOrder', 'metadata', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('SemopayOrder', 'sandbox', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn('SemopayOrder', 'method_origin', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('SemopayOrder', 'escrow_status_locale', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('SemopayOrder', 'escrow_status', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('SemopayOrder', 'status_locale', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('SemopayOrder', 'status', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('SemopayOrder', 'cancelled_price');
    await queryInterface.removeColumn('SemopayOrder', 'cancelled_tax_free');
    await queryInterface.removeColumn('SemopayOrder', 'company_name');
    await queryInterface.removeColumn('SemopayOrder', 'gateway_url');
    await queryInterface.removeColumn('SemopayOrder', 'metadata');
    await queryInterface.removeColumn('SemopayOrder', 'sandbox');
    await queryInterface.removeColumn('SemopayOrder', 'method_origin');
    await queryInterface.removeColumn('SemopayOrder', 'escrow_status_locale');
    await queryInterface.removeColumn('SemopayOrder', 'escrow_status');
    await queryInterface.removeColumn('SemopayOrder', 'status_locale');
    await queryInterface.removeColumn('SemopayOrder', 'status');
  },
};
