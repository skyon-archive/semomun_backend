'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ResultSubmissions', {
      rsid: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      uid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'uid' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      wgid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'WorkbookGroups', key: 'wgid' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      wid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Workbooks', key: 'wid' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      sid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Submissions', key: 'sbid' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      rank: { type: Sequelize.STRING(10), allowNull: false }, // 등급
      rawScore: { type: Sequelize.INTEGER, allowNull: false }, // 원점수
      perfectScore: { type: Sequelize.INTEGER, allowNull: false }, // 만점 점수
      standardScore: { type: Sequelize.INTEGER, allowNull: false }, // 표준 점수
      percentile: { type: Sequelize.INTEGER, allowNull: false }, // 백분위
      corrctCount: { type: Sequelize.INTEGER, allowNull: false }, // 맞은 개수 (웹 + 동기화를 위함)
      totalCount: { type: Sequelize.INTEGER, allowNull: false }, // 전체 개수 (웹 + 동기화를 위함))
      totalTime: { type: Sequelize.INTEGER, allowNull: false }, // 시간
      subject: { type: Sequelize.STRING(50), allowNull: false }, // 과목명
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('ResultSubmissions');
  },
};
