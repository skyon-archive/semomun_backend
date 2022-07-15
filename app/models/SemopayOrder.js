module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'SemopayOrder',
    {
      soid: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'uid' },
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE',
      },
      bkid: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      cancelled_price: { type: DataTypes.INTEGER, allowNull: true },
      cancelled_tax_free: { type: DataTypes.INTEGER, allowNull: true },
      company_name: { type: DataTypes.STRING(50), allowNull: true },
      gateway_url: { type: DataTypes.STRING(500), allowNull: true },
      metadata: { type: DataTypes.JSON, allowNull: true },
      sandbox: { type: DataTypes.BOOLEAN, allowNull: true },
      method_origin: { type: DataTypes.STRING(50), allowNull: true },
      escrow_status_locale: { type: DataTypes.STRING(50), allowNull: true },
      escrow_status: { type: DataTypes.STRING(50), allowNull: true },
      status_locale: { type: DataTypes.STRING(50), allowNull: true },
      status: { type: DataTypes.INTEGER, allowNull: true },
    },
    { sequelize, tableName: 'SemopayOrder' }
  );
};
