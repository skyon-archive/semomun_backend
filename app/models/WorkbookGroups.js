module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'WorkbookGroups',
    {
      wgid: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Items', key: 'id' },
      },
      title: { type: DataTypes.STRING(256), allowNull: false },
      detail: { type: DataTypes.STRING(4096), allowNull: false },
      type: { type: DataTypes.STRING(32), allowNull: false, defaultValue: '' },
      bookcover: { type: DataTypes.UUID, allowNull: false },
      isGroupOnlyPurchasable: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    { sequelize, tableName: 'WorkbookGroups' }
  );
};
