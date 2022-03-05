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
      allowNull: false,
      unique: true
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
        is: /^\+\d{1,4}-\d{1,3}-\d{3,4}-\d{3,4}$/i
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
