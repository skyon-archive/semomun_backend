module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'Items',
    {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      type: { type: DataTypes.STRING(32), allowNull: false },
      price: { type: DataTypes.INTEGER, allowNull: false },
      sales: { type: DataTypes.INTEGER, allowNull: false },
      // originalPrice: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      tableName: 'Items',
      indexes: [{ name: 'PRIMARY', unique: true, using: 'BTREE', fields: [{ name: 'id' }] }],
    }
  );
};
