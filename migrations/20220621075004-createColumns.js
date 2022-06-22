'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Workbooks.wgid
    await queryInterface.addColumn('Workbooks', 'wgid', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    // Workbooks.wgid -> FK
    await queryInterface.addConstraint('Workbooks', ['wgid'], {
      type: 'foreign key',
      references: { table: 'WorkbookGroups', field: 'wgid' },
      onDelete: 'set null',
      onUpdate: 'cascade',
    });
    // Workbooks.cutoff
    queryInterface.addColumn('Workbooks', 'cutoff', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    // Workbooks.subject
    queryInterface.addColumn('Workbooks', 'subject', {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: '',
    });
    // Workbooks.area
    queryInterface.addColumn('Workbooks', 'area', {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: '',
    });
    // Workbooks.deviation
    queryInterface.addColumn('Workbooks', 'deviation', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    // Workbooks.averageScore
    queryInterface.addColumn('Workbooks', 'averageScore', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    // Workbooks.id
    queryInterface.changeColumn('Workbooks', 'id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    // Workbooks.id -> FK
    await queryInterface.addConstraint('Workbooks', ['id'], {
      type: 'foreign key',
      references: { table: 'Items', field: 'id' },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Workbooks', 'wgid');
    await queryInterface.removeColumn('Workbooks', 'cutoff');
    await queryInterface.removeColumn('Workbooks', 'subject');
    await queryInterface.removeColumn('Workbooks', 'area');
    await queryInterface.removeColumn('Workbooks', 'deviation');
    await queryInterface.removeColumn('Workbooks', 'averageScore');

    const info = await queryInterface.getForeignKeyReferencesForTable('Workbooks');
    info.forEach((data) => {
      if (data.columnName === 'id')
        queryInterface.removeConstraint('Workbooks', data.constraintName);
    });
  },
};
