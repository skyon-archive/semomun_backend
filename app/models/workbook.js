module.exports = (sequelize, Sequelize) => {
  const Workbook = sequelize.define(
    'Workbooks',
    {
      wid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING(256),
        allowNull: false
      },
      year: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      month: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      detail: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      bookcover: {
        type: Sequelize.STRING(256)
      },
      sales: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      publisher: {
        type: Sequelize.STRING(256),
        allowNull: false
      },
      category: {
        type: Sequelize.STRING(256),
        allowNull: false
      },
      subject: {
        type: Sequelize.STRING(256),
        allowNull: false
      },
      grade: {
        type: Sequelize.STRING(32),
        allowNull: false
      }
    },
    {
      charset: 'utf8',
      timestamps: false
    }
  )

  return Workbook
}
