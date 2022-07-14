'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SemopayOrder', {
      soid: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      uid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'uid' },
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE',
      },
      bkid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'UserBillingKeys', key: 'bkid' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      receipt_id: { type: Sequelize.STRING(50), allowNull: false },
      order_id: { type: Sequelize.STRING(50), allowNull: false },
      price: { type: Sequelize.INTEGER, allowNull: false },
      tax_free: { type: Sequelize.INTEGER, allowNull: false },
      order_name: { type: Sequelize.STRING(50), allowNull: false },
      pg: { type: Sequelize.STRING(50), allowNull: false },
      method: { type: Sequelize.STRING(50), allowNull: false },
      purchased_at: { type: Sequelize.DATE, allowNull: false },
      requested_at: { type: Sequelize.DATE, allowNull: false },
      card_data: { type: Sequelize.JSON, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('SemopayOrder');
  },
};
