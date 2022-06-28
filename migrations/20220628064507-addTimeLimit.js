'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Workbooks', 'timelimit', {
      // 모의고사 풀이에 주어지는 시간(단위 : 초)
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Workbooks', 'timelimit')
  },
};
