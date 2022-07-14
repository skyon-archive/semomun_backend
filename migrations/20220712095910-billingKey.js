'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserBillingKeys', {
      bkid: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      uid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'uid' },
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE',
      },
      billing_key: { type: Sequelize.STRING(50), allowNull: false },
      billing_data: { type: Sequelize.JSON, allowNull: false },
      billing_expire_at: { type: Sequelize.DATE, allowNull: false },

      receipt_id: { type: Sequelize.STRING(50), allowNull: false },
      subscription_id: { type: Sequelize.STRING(50), allowNull: false },
      gateway_url: { type: Sequelize.STRING(500), allowNull: false },
      metadata: { type: Sequelize.JSON, allowNull: false },
      pg: { type: Sequelize.STRING(50), allowNull: false },
      method: { type: Sequelize.STRING(50), allowNull: false },
      method_symbol: { type: Sequelize.STRING(50), allowNull: false },
      method_origin: { type: Sequelize.STRING(50), allowNull: false },
      method_origin_symbol: { type: Sequelize.STRING(50), allowNull: false },
      published_at: { type: Sequelize.DATE, allowNull: false },
      requested_at: { type: Sequelize.DATE, allowNull: false },
      status_locale: { type: Sequelize.STRING(50), allowNull: false },
      status: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('UserBillingKeys');
  },
};
