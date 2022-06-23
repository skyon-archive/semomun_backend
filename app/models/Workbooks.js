module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'Workbooks',
    {
      wid: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Items', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      wgid: {
        type: DataTypes.INTEGER,
        allowNull: true, // 모의고사면 해당 id: null.
        references: { model: 'WorkbookGroups', key: 'wgid' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      title: { type: DataTypes.STRING(256), allowNull: false },
      detail: { type: DataTypes.STRING(4096), allowNull: false },
      isbn: { type: DataTypes.STRING(32), allowNull: false },
      author: { type: DataTypes.STRING(32), allowNull: false },
      date: { type: DataTypes.DATE, allowNull: false },
      publishMan: { type: DataTypes.STRING(32), allowNull: false },
      publishCompany: { type: DataTypes.STRING(32), allowNull: false },
      paperbookPrice: { type: DataTypes.INTEGER, allowNull: false }, // originalPrice => paperbookPrice로 변경
      bookcover: { type: DataTypes.UUID, allowNull: false },
      type: { type: DataTypes.STRING(32), allowNull: false, defaultValue: '' },

      subject: { type: DataTypes.STRING(50), allowNull: false, defaultValue: '' }, // 과목 이름
      area: { type: DataTypes.STRING(50), allowNull: false, defaultValue: '' }, // 영역 이름
      standardDeviation: { type: DataTypes.INTEGER, allowNull: true }, // 표준편차
      averageScore: { type: DataTypes.INTEGER, allowNull: true }, // 평균 점수
      cutoff: { type: DataTypes.JSON, allowNull: true }, // 등급 컷
    },
    {
      sequelize,
      tableName: 'Workbooks',
      indexes: [
        { name: 'PRIMARY', unique: true, using: 'BTREE', fields: [{ name: 'wid' }] },
        { name: 'id', using: 'BTREE', fields: [{ name: 'id' }] },
      ],
    }
  );
};
