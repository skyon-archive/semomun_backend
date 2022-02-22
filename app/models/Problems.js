module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Problems', {
    vid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Views',
        key: 'vid'
      }
    },
    pid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    labelType: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    labelNum: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    answer: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    content: {
      type: DataTypes.UUID,
      allowNull: false
    },
    explanation: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Problems',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'pid' }
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
