module.exports = (sequelize, Sequelize) => {
  const Submission = sequelize.define(
    'Submissions',
    {
      uid: {
        type: Sequelize.UUID,
        refernces: {
          model: 'Users',
          key: 'uid'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
        primaryKey: true
      },
      pid: {
        type: Sequelize.INTEGER,
        refernces: {
          model: 'Problems',
          key: 'pid'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
