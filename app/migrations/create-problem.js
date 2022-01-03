'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Problems', {
      pid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      sid: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      icon_index: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      icon_name: {
        type: Sequelize.STRING(4)
      },
      type: {
        type: Sequelize.TINYINT,
        allowNull: false
      },
      answer: {
        type: Sequelize.STRING(256)
      },
      content: {
        type: Sequelize.STRING(256)
      },
      explanation: {
        type: Sequelize.STRING(256)
      },
      score: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0
      },
      attempt_total: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      attempt_correct: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      rate: {
        type: Sequelize.TINYINT
      },
      elapsed_total: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Problems')
  }
}
