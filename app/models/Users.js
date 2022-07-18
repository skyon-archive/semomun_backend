module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'Users',
    {
      uid: { autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
      username: { type: DataTypes.STRING(256), allowNull: false, unique: true },
      credit: { type: DataTypes.INTEGER, allowNull: false },
      role: { type: DataTypes.STRING(32), allowNull: false },
      deleted: { type: DataTypes.INTEGER, allowNull: false },
      isAutoCharged: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      lessThenAmount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10000 },
      chargeAmount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 20000 },
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
