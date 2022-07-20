'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'ConsoleUsers',
      {
        cuid: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true, comment: '콘솔 유저 고유 아이디' },
        name: { type: Sequelize.STRING(30), allowNull: false, comment: '이름' },
        account: { type: Sequelize.STRING(50), unique: true, allowNull: false, comment: '아이디' },
        password: { type: Sequelize.STRING(300), allowNull: false, comment: '비밀번호' },
        publishCompany: { type: Sequelize.STRING(50), allowNull: false, comment: '출판사' },
        role: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'User', comment: '권한/역할' },
        createdAt: { type: Sequelize.DATE, allowNull: false, comment: '계정 생성일' },
        updatedAt: { type: Sequelize.DATE, allowNull: false, comment: '정보 수정일' },
        lastLoggedInAt: { type: Sequelize.DATE, allowNull: false, comment: '마지막 로그인 시간' },
        isHidden: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, comment: '숨김 여부' },
        deletedAt: { type: Sequelize.DATE, allowNull: true, comment: '탈퇴 또는 삭제 시간' },
      },
      { comment: '콘솔 유저 테이블', charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
    );
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('ConsoleUsers');
  },
};
