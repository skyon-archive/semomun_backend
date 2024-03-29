module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Submissions', {
    sbid: {
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
    pid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Problems',
        key: 'pid'
      }
    },
    elapsed: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    answer: {
      type: DataTypes.STRING(256),
      allowNull: true
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
    tableName: 'Submissions',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'sbid' }
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
        name: 'pid',
        using: 'BTREE',
        fields: [
          { name: 'pid' }
        ]
      }
    ]
  })
}
