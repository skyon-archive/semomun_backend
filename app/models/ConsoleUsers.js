module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'ConsoleUsers',
    {
      cuid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        comment: '콘솔 유저 고유 아이디',
      },
      pcid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'publishCompanies', key: 'pcid' },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        comment: '출판사 참조 아이디',
      },
      name: { type: DataTypes.STRING(30), allowNull: false, comment: '이름' },
      username: { type: DataTypes.STRING(50), unique: true, allowNull: false, comment: '아이디(계정)' },
      password: { type: DataTypes.STRING(300), allowNull: false, comment: '비밀번호' },
      role: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '권한/역할',
      },
      lastLoggedInAt: { type: DataTypes.DATE, allowNull: true, comment: '마지막 로그인 시간' },
      otherNotes: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: '기타(메모용)',
        comment: '기타(메모용)',
      },
    },
    { sequelize, tableName: 'ConsoleUsers' }
  );
};
