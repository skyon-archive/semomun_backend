'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ConsoleUsers', 'otherNotes', {
      type: Sequelize.STRING(500),
      allowNull: false,
      defaultValue: '기타(메모용)',
      comment: '기타(메모용)',
    });
    await queryInterface.removeColumn('ConsoleUsers', 'updatedAt');
    await queryInterface.removeColumn('ConsoleUsers', 'isHidden');
    await queryInterface.removeColumn('ConsoleUsers', 'deletedAt');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ConsoleUsers', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      comment: '수정 일시',
    });
    await queryInterface.addColumn('ConsoleUsers', 'isHidden', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '숨김 여부',
    });
    await queryInterface.addColumn('ConsoleUsers', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: '탈퇴 또는 삭제 시간',
    });
    await queryInterface.removeColumn('ConsoleUsers', 'otherNotes');
  },
};
