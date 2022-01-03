module.exports = (sequelize, Sequelize) => {
  const Submission = sequelize.define(
    'Submissions',
    {
      uid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      pid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      elapsed: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      recent_time: {
        type: Sequelize.STRING(256),
        allowNull: false
      },
      user_answer: {
        type: Sequelize.STRING(256)
      },
      correct: {
        type: Sequelize.BOOLEAN
      },
      note: {
        type: Sequelize.BLOB
      }
    },
    {
      charset: 'utf8',
      timestamps: false
    }
  )

  return Submission
}
