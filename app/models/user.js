module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'Users',
    {
      uid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      nickName: {
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
      birthday: {
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
    },
    {
      charset: 'utf8',
      timestamps: false
    }
  )
  return User
}
