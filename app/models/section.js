module.exports = (sequelize, Sequelize) => {
  const Section = sequelize.define("Sections", {
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
  }, {
    timestamps: false
  });

  return Section;
};