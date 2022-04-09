module.exports = function (sequelize, DataTypes) {
  return sequelize.define('UserInfo', {
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'uid'
      }
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    addressDetail: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    birth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    googleId: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    appleId: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(32),
      allowNull: false,
      validate: {
        is: /(^\+\d{1,4}-\d{1,3}-\d{3,4}-\d{3,4}$)|(^$)/i
      }
    },
    major: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    majorDetail: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    school: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    graduationStatus: {
      type: DataTypes.STRING(32),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'UserInfo',
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
