'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('# ----- Workbooks ----- #');
    const Workbooks = await queryInterface.getForeignKeyReferencesForTable('Workbooks');
    for (const Workbook of Workbooks) {
      console.log(Workbook.constraintName);
      await queryInterface.removeConstraint('Workbooks', Workbook.constraintName);
    }

    console.log('# ----- Sections ----- #');
    const Sections = await queryInterface.getForeignKeyReferencesForTable('Sections');
    for (const Section of Sections) {
      console.log(Section.constraintName);
      await queryInterface.removeConstraint('Sections', Section.constraintName);
    }

    console.log('# ----- Views ----- #');
    const Views = await queryInterface.getForeignKeyReferencesForTable('Views');
    for (const View of Views) {
      console.log(View.constraintName);
      await queryInterface.removeConstraint('Views', View.constraintName);
    }

    console.log('# ----- Problems ----- #');
    const Problems = await queryInterface.getForeignKeyReferencesForTable('Problems');
    for (const Problem of Problems) {
      console.log(Problem.constraintName);
      await queryInterface.removeConstraint('Problems', Problem.constraintName);
    }

    console.log('# ----- PayHistory ----- #');
    const PayHistories = await queryInterface.getForeignKeyReferencesForTable('PayHistory');
    for (const PayHistory of PayHistories) {
      console.log(PayHistory.constraintName);
      await queryInterface.removeConstraint('PayHistory', PayHistory.constraintName);
    }

    console.log('# ----- WorkbookTags ----- #');
    const WorkbookTags = await queryInterface.getForeignKeyReferencesForTable('WorkbookTags');
    for (const WorkbookTag of WorkbookTags) {
      console.log(WorkbookTag.constraintName);
      await queryInterface.removeConstraint('WorkbookTags', WorkbookTag.constraintName);
    }

    console.log('# ----- WorkbookHistory ----- #');
    const WorkbookHistories = await queryInterface.getForeignKeyReferencesForTable(
      'WorkbookHistory'
    );
    for (const WorkbookHistory of WorkbookHistories) {
      console.log(WorkbookHistory.constraintName);
      await queryInterface.removeConstraint('WorkbookHistory', WorkbookHistory.constraintName);
    }

    console.log('# ----- ViewSubmissions ----- #');
    const ViewSubmissions = await queryInterface.getForeignKeyReferencesForTable('ViewSubmissions');
    for (const ViewSubmission of ViewSubmissions) {
      console.log(ViewSubmission.constraintName);
      await queryInterface.removeConstraint('ViewSubmissions', ViewSubmission.constraintName);
    }

    console.log('# ----- Submissions ----- #');
    const Submissions = await queryInterface.getForeignKeyReferencesForTable('Submissions');
    for (const Submission of Submissions) {
      console.log(Submission.constraintName);
      await queryInterface.removeConstraint('Submissions', Submission.constraintName);
    }

    console.log('# ----- ResultSubmissions ----- #');
    const ResultSubmissions = await queryInterface.getForeignKeyReferencesForTable('ResultSubmissions');
    for (const ResultSubmission of ResultSubmissions) {
      console.log(ResultSubmission.constraintName);
      await queryInterface.removeConstraint('ResultSubmissions', ResultSubmission.constraintName);
    }

    console.log('# ----- ErrorReports ----- #');
    const ErrorReports = await queryInterface.getForeignKeyReferencesForTable('ErrorReports');
    for (const ErrorReport of ErrorReports) {
      console.log(ErrorReport.constraintName);
      await queryInterface.removeConstraint('ErrorReports', ErrorReport.constraintName);
    }
  },

  down: async (queryInterface, Sequelize) => {},
};
