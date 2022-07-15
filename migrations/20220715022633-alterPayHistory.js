'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('PayHistory', 'soid', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'SemopayOrder', key: 'soid' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('PayHistory', 'soid');
  },
};
