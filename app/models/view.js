module.exports = (sequelize, Sequelize) => {
  const View = sequelize.define("Views", {
    vid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    sid: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    index_start: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    index_end: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    form: {
      type: Sequelize.TINYINT,
      allowNull: false,
    },
    material: {
      type: Sequelize.STRING(256),
    },
  }, {
    timestamps: false
  });

  return View;
};