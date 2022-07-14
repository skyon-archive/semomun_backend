module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'SemopayOrder',
    {
      soid: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      uid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'uid' },
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE',
      },
      bkid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'UserBillingKeys', key: 'bkid' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      receipt_id: { type: DataTypes.STRING(50), allowNull: false },
      order_id: { type: DataTypes.STRING(50), allowNull: false },
      price: { type: DataTypes.INTEGER, allowNull: false },
      tax_free: { type: DataTypes.INTEGER, allowNull: false },
      order_name: { type: DataTypes.STRING(50), allowNull: false },
      pg: { type: DataTypes.STRING(50), allowNull: false },
      method: { type: DataTypes.STRING(50), allowNull: false },
      purchased_at: { type: DataTypes.DATE, allowNull: false },
      requested_at: { type: DataTypes.DATE, allowNull: false },
      card_data: { type: DataTypes.JSON, allowNull: true },
    },
    { sequelize, tableName: 'SemopayOrder' }
  );
};
