'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sections', {
      sid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      wid: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      index: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },
      detail: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING(256),
      },
      cutoff: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Sections');
  }
};