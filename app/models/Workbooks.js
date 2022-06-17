module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'Workbooks',
    {
      wid: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      id: {
        type: DataTypes.INTEGER,
        allowNull: true, // 모의고사면 해당 id: null.
        references: { model: 'Items', key: 'id' },
      },
      wgid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'WorkbookGroups', key: 'id' },
      },
      title: { type: DataTypes.STRING(256), allowNull: false },
      detail: { type: DataTypes.STRING(4096), allowNull: false },
      subject: { type: DataTypes.string(255), allowNull: false }, // 과목 이름
      area: { type: DataTypes.string(255), allowNull: false }, // 영역 이름
      cutoff: { type: DataTypes.JSON, allowNull: true }, // 등급 컷
      isbn: { type: DataTypes.STRING(32), allowNull: false },
      author: { type: DataTypes.STRING(32), allowNull: false },
      date: { type: DataTypes.DATE, allowNull: false },
      publishMan: { type: DataTypes.STRING(32), allowNull: false },
      publishCompany: { type: DataTypes.STRING(32), allowNull: false },
      originalPrice: { type: DataTypes.INTEGER, allowNull: false },
      bookcover: { type: DataTypes.UUID, allowNull: false },
      type: { type: DataTypes.STRING(32), allowNull: false, defaultValue: '' },
      // createdAt: DataTypes.DATE, // Sequelize ORM v5's TIMESTAMP
      // updatedAt: DataTypes.DATE,
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
