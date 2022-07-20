module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'Categories',
    {
      cid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        comment: '태그 카테고리 고유 아이디',
      },
      name: { type: DataTypes.STRING(32), allowNull: false, comment: '카테고리 이름' },
    },
    { sequelize, tableName: 'Categories' }
  );
};
