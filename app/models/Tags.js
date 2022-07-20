module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'Tags',
    {
      tid: { autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
      cid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Categories', key: 'cid' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      name: { type: DataTypes.STRING(32), allowNull: false },
    },
    {
      sequelize,
      tableName: 'Tags',
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'tid' }],
        },
      ],
    }
  );
};
