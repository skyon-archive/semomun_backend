module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Workbooks', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Items',
        key: 'id'
      }
    },
    wid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    detail: {
      type: DataTypes.STRING(4096),
      allowNull: false
    },
    isbn: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    author: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    publishMan: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    publishCompany: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    originalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bookcover: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Workbooks',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'wid' }
        ]
      },
      {
        name: 'id',
        using: 'BTREE',
        fields: [
          { name: 'id' }
        ]
      }
    ]
  })
}
