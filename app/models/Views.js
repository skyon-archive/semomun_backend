module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Views', {
    sid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Sections',
        key: 'sid'
      }
    },
    vid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    form: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    passage: {
      type: DataTypes.UUID,
      allowNull: true
    },
    attachment: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Views',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'vid' }
        ]
      },
      {
        name: 'sid',
        using: 'BTREE',
        fields: [
          { name: 'sid' }
        ]
      }
    ]
  })
}
