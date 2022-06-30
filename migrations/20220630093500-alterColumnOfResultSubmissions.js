'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('ResultSubmissions', 'corrctCount', 'correctProblemCount');
    await queryInterface.renameColumn('ResultSubmissions', 'totalCount', 'totalProblemCount');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('ResultSubmissions', 'correctProblemCount', 'corrctCount');
    await queryInterface.renameColumn('ResultSubmissions', 'totalProblemCount', 'totalCount');
  },
};
