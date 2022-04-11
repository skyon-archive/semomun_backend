module.exports = function (sequelize, DataTypes) {
  return sequelize.define('ErrorReports', {
    erid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Problems',
        key: 'pid'
      }
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'uid'
      }
    },
    content: {
      type: DataTypes.TEXT(),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ErrorReports',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'erid' }
        ]
      }
    ]
  })
}
