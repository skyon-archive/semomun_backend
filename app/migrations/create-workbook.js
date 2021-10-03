'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Workbooks', {
      wid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },
      year: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      month: {
        type: Sequelize.TINYINT,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      detail: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING(256),
      },
      sales: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      publisher: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },
      subject: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },
      grade: {
        type: Sequelize.TINYINT,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Workbooks');
  }
};