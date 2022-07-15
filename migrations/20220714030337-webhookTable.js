'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BootPayWebhook', {
      bpwhid: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      receipt_id: { type: Sequelize.STRING(50), allowNull: false },
      order_id: { type: Sequelize.STRING(50), allowNull: false },
      price: { type: Sequelize.INTEGER, allowNull: false },
      tax_free: { type: Sequelize.INTEGER, allowNull: false },
      cancelled_price: { type: Sequelize.INTEGER, allowNull: false },
      cancelled_tax_free: { type: Sequelize.INTEGER, allowNull: false },
      order_name: { type: Sequelize.STRING(50), allowNull: false },
      company_name: { type: Sequelize.STRING(50), allowNull: false },
      gateway_url: { type: Sequelize.STRING(500), allowNull: false },
      metadata: { type: Sequelize.JSON, allowNull: false },
      sandbox: { type: Sequelize.BOOLEAN, allowNull: false },
      pg: { type: Sequelize.STRING(50), allowNull: false },
      method: { type: Sequelize.STRING(50), allowNull: false },
      method_symbol: { type: Sequelize.STRING(50), allowNull: false },
      method_origin: { type: Sequelize.STRING(50), allowNull: false },
      method_origin_symbol: { type: Sequelize.STRING(50), allowNull: false },
      purchased_at: { type: Sequelize.DATE, allowNull: false },
      cancelled_at: { type: Sequelize.DATE, allowNull: false },
      requested_at: { type: Sequelize.DATE, allowNull: false },
      receipt_url: { type: Sequelize.STRING(500), allowNull: false },
      status: { type: Sequelize.INTEGER, allowNull: false },
      escrow_data: { type: Sequelize.JSON, allowNull: true },
      card_data: { type: Sequelize.JSON, allowNull: true },
      phone_data: { type: Sequelize.JSON, allowNull: true },
      bank_data: { type: Sequelize.JSON, allowNull: true },
      vbank_data: { type: Sequelize.JSON, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('BootPayWebhook');
  },
};
