module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'UserBillingKeys',
    {
      bkid: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'uid' },
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE',
      },
      billing_key: { type: DataTypes.STRING(50), allowNull: false },
      billing_data: { type: DataTypes.JSON, allowNull: false },
      billing_expire_at: { type: DataTypes.DATE, allowNull: false },

      receipt_id: { type: DataTypes.STRING(50), allowNull: false },
      subscription_id: { type: DataTypes.STRING(50), allowNull: false },
      gateway_url: { type: DataTypes.STRING(50), allowNull: false },
      metadata: { type: DataTypes.JSON, allowNull: false },
      pg: { type: DataTypes.STRING(50), allowNull: false },
      method: { type: DataTypes.STRING(50), allowNull: false },
      method_symbol: { type: DataTypes.STRING(50), allowNull: false },
      method_origin: { type: DataTypes.STRING(50), allowNull: false },
      method_origin_symbol: { type: DataTypes.STRING(50), allowNull: false },
      published_at: { type: DataTypes.DATE, allowNull: false },
      requested_at: { type: DataTypes.DATE, allowNull: false },
      status_locale: { type: DataTypes.STRING(50), allowNull: false },
      status: { type: DataTypes.INTEGER, allowNull: false },
      deletedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { sequelize, tableName: 'UserBillingKeys' }
  );
};
