'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'publishCompanies',
      {
        pcid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          comment: '출판사 고유 아이디',
        },
        name: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
          comment: '출판사 이름',
        },
        createdAt: { type: Sequelize.DATE, allowNull: false, comment: '생성 일시' },
        updatedAt: { type: Sequelize.DATE, allowNull: false, comment: '수정 일시' },
      },
      { comment: '출판사 정보 테이블', charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('publishCompanies');
  },
};
