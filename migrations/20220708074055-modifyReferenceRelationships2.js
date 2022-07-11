'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Workbooks
    await queryInterface.addConstraint('Workbooks', ['wgid'], {
      type: 'foreign key',
      references: { table: 'WorkbookGroups', field: 'wgid' },
      onDelete: 'set null',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Workbooks', ['id'], {
      type: 'foreign key',
      references: { table: 'Items', field: 'id' },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    // Sections
    await queryInterface.addConstraint('Sections', ['wid'], {
      type: 'foreign key',
      references: { table: 'Workbooks', field: 'wid' },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    // Views
    await queryInterface.addConstraint('Views', ['sid'], {
      type: 'foreign key',
      references: { table: 'Sections', field: 'sid' },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    // Problems
    await queryInterface.addConstraint('Problems', ['vid'], {
      type: 'foreign key',
      references: { table: 'Views', field: 'vid' },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    // PayHistory
    await queryInterface.addConstraint('PayHistory', ['id'], {
      type: 'foreign key',
      references: { table: 'Items', field: 'id' },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('PayHistory', ['uid'], {
      type: 'foreign key',
      references: { table: 'Users', field: 'uid' },
      onDelete: 'no action',
      onUpdate: 'cascade',
    });

    // WorkbookTags
    await queryInterface.addConstraint('WorkbookTags', ['wid'], {
      type: 'foreign key',
      references: { table: 'Workbooks', field: 'wid' },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('WorkbookTags', ['tid'], {
      type: 'foreign key',
      references: { table: 'Tags', field: 'tid' },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    // ViewSubmissions
    await queryInterface.addConstraint('ViewSubmissions', ['vid'], {
      type: 'foreign key',
      references: { table: 'Views', field: 'vid' },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('ViewSubmissions', ['uid'], {
      type: 'foreign key',
      references: { table: 'Users', field: 'uid' },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    // Submissions
    await queryInterface.addConstraint('Submissions', ['pid'], {
      type: 'foreign key',
      references: { table: 'Problems', field: 'pid' },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Submissions', ['uid'], {
      type: 'foreign key',
      references: { table: 'Users', field: 'uid' },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    // ResultSubmissions
    await queryInterface.changeColumn('ResultSubmissions', 'wgid', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn('ResultSubmissions', 'sid', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addConstraint('ResultSubmissions', ['wgid'], {
      type: 'foreign key',
      references: { table: 'WorkbookGroups', field: 'wgid' },
      onDelete: 'set null',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('ResultSubmissions', ['wid'], {
      type: 'foreign key',
      references: { table: 'Workbooks', field: 'wid' },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('ResultSubmissions', ['sid'], {
      type: 'foreign key',
      references: { table: 'Sections', field: 'sid' },
      onDelete: 'set null',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('ResultSubmissions', ['uid'], {
      type: 'foreign key',
      references: { table: 'Users', field: 'uid' },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    // ErrorReports
    await queryInterface.addConstraint('ErrorReports', ['pid'], {
      type: 'foreign key',
      references: { table: 'Problems', field: 'pid' },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('ErrorReports', ['uid'], {
      type: 'foreign key',
      references: { table: 'Users', field: 'uid' },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  down: async (queryInterface, Sequelize) => {},
};
