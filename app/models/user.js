module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "Users",
    {
      uid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      googleId: {
        type: Sequelize.STRING(256),
        unique: true,
      },
      appleId: {
        type: Sequelize.STRING(256),
        unique: true,
      },
      auth: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      nickname: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      profile_image: {
        type: Sequelize.STRING(256),
      },
      school: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },
      grade: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      info: {
        type: Sequelize.JSON,
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      timestamps: false,
    }
  );

  return User;
};
