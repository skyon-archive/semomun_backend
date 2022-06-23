'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('WorkbookGroupHistory', {
      wghid: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
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
      type: { type: Sequelize.STRING(32), allowNull: false }, // 우선은 type=solve로만 쓰이기 위해 필요한 타입 컬럼.
      datetime: { type: Sequelize.DATE, allowNull: false }, // 최근 접속 일시(가장 최근에 진입한 하위 Workbook의 datetime 시간과 같다.)
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('WorkbookGroupHistory');
  },
};
