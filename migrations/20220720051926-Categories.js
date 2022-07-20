'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'Categories',
      {
        cid: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true, comment: '태그 카테고리 고유 아이디' },
        name: { type: Sequelize.STRING(30), allowNull: false, comment: '카테고리 이름' },
        createdAt: { type: Sequelize.DATE, allowNull: false, comment: '생성일시' },
        updatedAt: { type: Sequelize.DATE, allowNull: false, comment: '수정일시' },
      },
      { comment: '태그 카테고리', charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
    );
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Categories');
  },
};
