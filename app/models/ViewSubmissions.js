module.exports = function (sequelize, DataTypes) {
  return sequelize.define('ViewSubmissions', {
    vsbid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'uid'
      }
    },
    vid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Views',
        key: 'vid'
      }
    },
    attempt: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    note: {
      type: DataTypes.BLOB('medium'),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ViewSubmissions',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'vsbid' }
        ]
      },
      {
        name: 'uid',
        using: 'BTREE',
        fields: [
          { name: 'uid' }
        ]
      },
      {
        name: 'vid',
        using: 'BTREE',
        fields: [
          { name: 'vid' }
        ]
      }
    ]
  })
}
