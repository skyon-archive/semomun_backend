'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Submissions', {
      uid: {
        type: Sequelize.UUID,
        refernces: {
          model: 'Users',
          key: 'uid'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
        primaryKey: true
      },
      pid: {
        type: Sequelize.INTEGER,
        refernces: {
          model: 'Problems',
          key: 'pid'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
        primaryKey: true
      },
      elapsed: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      recent_time: {
        type: Sequelize.STRING(256),
        allowNull: false
      },
      user_answer: {
        type: Sequelize.STRING(256)
      },
      correct: {
        type: Sequelize.BOOLEAN
      },
      note: {
        type: Sequelize.BLOB
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Submissions')
  }
}
