module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'WorkbookGroups',
    {
      wgid: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      id: {
        type: DataTypes.INTEGER,
        allowNull: true, // 현재로썬 개별 구매만 가능하기에 아이템을 바라보는 그룹의 FK는 nullable 허용
        references: { model: 'Items', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      title: { type: DataTypes.STRING(256), allowNull: false },
      detail: { type: DataTypes.STRING(4096), allowNull: false },
      type: { type: DataTypes.STRING(32), allowNull: false },
      groupCover: { type: DataTypes.UUID, allowNull: false },
      isGroupOnlyPurchasable: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    { sequelize, tableName: 'WorkbookGroups' }
  );
};
