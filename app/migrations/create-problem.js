"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Problems", {
      pid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      vid: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sid: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      icon_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      icon_name: {
        type: Sequelize.STRING(4),
      },
      type: {
        type: Sequelize.TINYINT,
        allowNull: false,
      },
      answer: {
        type: Sequelize.STRING(256),
      },
      content: {
        type: Sequelize.STRING(256),
      },
      explanation: {
        type: Sequelize.STRING(256),
      },
      attempt_total: {
        type: Sequelize.INT,
        allowNull: false,
        defaultValue: 0,
      },
      attempt_correct: {
        type: Sequelize.INT,
        allowNull: false,
        defaultValue: 0,
      },
      rate: {
        type: Sequelize.TINYINT,
        allowNull: true,
      },
      elapsed_total: {
        type: Sequelize.INT,
        allowNull: false,
        defaultValue: 0,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Problems");
  },
};
