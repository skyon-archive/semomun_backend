module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Users', {
    uid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    birth: {
      type: DataTypes.DATE,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    degree: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    degreeStatus: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    credit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    auth: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Users',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'uid' }
        ]
      }
    ]
  })
}
