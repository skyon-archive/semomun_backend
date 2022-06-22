'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('WorkbookGroups', {
      wgid: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Items', key: 'id' },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      title: { type: Sequelize.STRING(256), allowNull: false },
      detail: { type: Sequelize.STRING(4096), allowNull: false },
      type: { type: Sequelize.STRING(32), allowNull: false },
      groupCover: { type: Sequelize.UUID, allowNull: false },
      isGroupOnlyPurchasable: { type: Sequelize.BOOLEAN, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('WorkbookGroups');
  },
};
