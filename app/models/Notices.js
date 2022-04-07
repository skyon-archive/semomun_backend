module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Notices', {
    nid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.TEXT('tiny'),
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT(),
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(256),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Notices',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'nid' }
        ]
      }
    ]
  })
}
