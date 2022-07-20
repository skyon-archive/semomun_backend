module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'ConsoleUsers',
    {
      cuid: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true, comment: '콘솔 유저 고유 아이디' },
      name: { type: DataTypes.STRING(30), allowNull: false, comment: '이름' },
      account: { type: DataTypes.STRING(50), unique: true, allowNull: false, comment: '아이디' },
      password: { type: DataTypes.STRING(300), allowNull: false, comment: '비밀번호' },
      publishCompany: { type: DataTypes.STRING(50), allowNull: false, comment: '출판사' },
      role: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'User', comment: '권한/역할' },
      lastLoggedInAt: { type: DataTypes.DATE, allowNull: false, comment: '마지막 로그인 시간' },
      isHidden: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment: '숨김 여부' },
      deletedAt: { type: DataTypes.DATE, allowNull: true, comment: '탈퇴 또는 삭제 시간' },
    },
    { sequelize, tableName: 'ConsoleUsers' }
  );
};
