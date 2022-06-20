module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'WorkbookGroups',
    {
      wgid: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      id: {
        type: DataTypes.INTEGER,
        allowNull: false, // 전체 구매든 개별 구매든 item을 참조해야 하지 않을까?
        references: { model: 'Items', key: 'id' },
      },
      title: { type: DataTypes.STRING(256), allowNull: false },
      detail: { type: DataTypes.STRING(4096), allowNull: false },
      type: { type: DataTypes.STRING(32), allowNull: false, defaultValue: '' },
      groupCover: { type: DataTypes.UUID, allowNull: false },
      isGroupOnlyPurchasable: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    { sequelize, tableName: 'WorkbookGroups' }
  );
};
