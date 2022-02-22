module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Sections', {
    wid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Workbooks',
        key: 'wid'
      }
    },
    sid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    detail: {
      type: DataTypes.STRING(4096),
      allowNull: false
    },
    cutoff: {
      type: DataTypes.JSON,
      allowNull: false
    },
    sectioncover: {
      type: DataTypes.UUID,
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    audio: {
      type: DataTypes.UUID,
      allowNull: true
    },
    audioDetail: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Sections',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'sid' }
        ]
      },
      {
        name: 'wid',
        using: 'BTREE',
        fields: [
          { name: 'wid' }
        ]
      }
    ]
  })
}
