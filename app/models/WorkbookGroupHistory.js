module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'WorkbookGroupHistory',
    {
      wghid: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'uid' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      wgid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'WorkbookGroups', key: 'wgid' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      type: { type: DataTypes.STRING(32), allowNull: false }, // 우선은 type=solve로만 쓰이기 위해 필요한 타입 컬럼.
      datetime: { type: DataTypes.DATE, allowNull: false }, // 최근 접속 일시(가장 최근에 진입한 하위 Workbook의 datetime 시간과 같다.)
    },
    { sequelize, tableName: 'WorkbookGroupHistory' }
  );
};
