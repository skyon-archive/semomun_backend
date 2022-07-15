module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'Users',
    {
      uid: { autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
      username: { type: DataTypes.STRING(256), allowNull: false, unique: true },
      credit: { type: DataTypes.INTEGER, allowNull: false },
      role: { type: DataTypes.STRING(32), allowNull: false },
      deleted: { type: DataTypes.INTEGER, allowNull: false },
      isAutoCharge: { type: DataTypes.BOOLEAN, allowNull: true },
      lessThenAmount: { type: DataTypes.INTEGER, allowNull: true },
      chargeAmount: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      tableName: 'Users',
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'uid' }],
        },
      ],
    }
  );
};
