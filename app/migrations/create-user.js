'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      uid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      nickname: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      gender: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      school: {
        type: Sequelize.STRING(256),
        allowNull: false
      },
      major: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      majorDetail: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      favoriteCategory: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      graduationStatus: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      profileImage: {
        type: Sequelize.STRING(256)
      },
      googleId: {
        type: Sequelize.STRING(256),
        unique: true
      },
      appleId: {
        type: Sequelize.STRING(256),
        unique: true
      },
      auth: {
        type: Sequelize.INTEGER
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users')
  }
}
