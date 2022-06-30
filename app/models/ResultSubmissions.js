module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'ResultSubmissions',
    {
      rsid: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'uid' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      wgid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'WorkbookGroups', key: 'wgid' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      wid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Workbooks', key: 'wid' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      sid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Submissions', key: 'sbid' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      rank: { type: DataTypes.STRING(10), allowNull: false }, // 등급
      rawScore: { type: DataTypes.INTEGER, allowNull: false }, // 원점수
      perfectScore: { type: DataTypes.INTEGER, allowNull: false }, // 만점 점수
      standardScore: { type: DataTypes.INTEGER, allowNull: false }, // 표준 점수
      percentile: { type: DataTypes.INTEGER, allowNull: false }, // 백분위
      correctProblemCount: { type: DataTypes.INTEGER, allowNull: false }, // 맞은 개수 (웹 + 동기화를 위함)
      totalProblemCount: { type: DataTypes.INTEGER, allowNull: false }, // 전체 개수 (웹 + 동기화를 위함))
      totalTime: { type: DataTypes.INTEGER, allowNull: false }, // 시간
      subject: { type: DataTypes.STRING(50), allowNull: false }, // 과목명
    },
    { sequelize, tableName: 'ResultSubmissions' }
  );
};
