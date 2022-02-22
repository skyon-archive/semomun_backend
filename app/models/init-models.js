const DataTypes = require('sequelize').DataTypes
const _ChargeHistory = require('./ChargeHistory')
const _FavoriteTags = require('./FavoriteTags')
const _Items = require('./Items')
const _Problems = require('./Problems')
const _Sections = require('./Sections')
const _Submissions = require('./Submissions')
const _Tags = require('./Tags')
const _Users = require('./Users')
const _Views = require('./Views')
const _WorkbookHistory = require('./WorkbookHistory')
const _WorkbookTags = require('./WorkbookTags')
const _Workbooks = require('./Workbooks')

function initModels (sequelize) {
  const ChargeHistory = _ChargeHistory(sequelize, DataTypes)
  const FavoriteTags = _FavoriteTags(sequelize, DataTypes)
  const Items = _Items(sequelize, DataTypes)
  const Problems = _Problems(sequelize, DataTypes)
  const Sections = _Sections(sequelize, DataTypes)
  const Submissions = _Submissions(sequelize, DataTypes)
  const Tags = _Tags(sequelize, DataTypes)
  const Users = _Users(sequelize, DataTypes)
  const Views = _Views(sequelize, DataTypes)
  const WorkbookHistory = _WorkbookHistory(sequelize, DataTypes)
  const WorkbookTags = _WorkbookTags(sequelize, DataTypes)
  const Workbooks = _Workbooks(sequelize, DataTypes)

  Tags.belongsToMany(Users, { as: 'uid_Users', through: FavoriteTags, foreignKey: 'tid', otherKey: 'uid' })
  Tags.belongsToMany(Workbooks, { as: 'wid_Workbooks', through: WorkbookTags, foreignKey: 'tid', otherKey: 'wid' })
  Users.belongsToMany(Tags, { as: 'tid_Tags', through: FavoriteTags, foreignKey: 'uid', otherKey: 'tid' })
  Workbooks.belongsToMany(Tags, { as: 'tid_Tags_WorkbookTags', through: WorkbookTags, foreignKey: 'wid', otherKey: 'tid' })
  Workbooks.belongsTo(Items, { as: 'id_Item', foreignKey: 'id' })
  Items.hasMany(Workbooks, { as: 'Workbooks', foreignKey: 'id' })
  Submissions.belongsTo(Problems, { as: 'pid_Problem', foreignKey: 'pid' })
  Problems.hasMany(Submissions, { as: 'Submissions', foreignKey: 'pid' })
  Views.belongsTo(Sections, { as: 'sid_Section', foreignKey: 'sid' })
  Sections.hasMany(Views, { as: 'Views', foreignKey: 'sid' })
  FavoriteTags.belongsTo(Tags, { as: 'tid_Tag', foreignKey: 'tid' })
  Tags.hasMany(FavoriteTags, { as: 'FavoriteTags', foreignKey: 'tid' })
  WorkbookTags.belongsTo(Tags, { as: 'tid_Tag', foreignKey: 'tid' })
  Tags.hasMany(WorkbookTags, { as: 'WorkbookTags', foreignKey: 'tid' })
  ChargeHistory.belongsTo(Users, { as: 'uid_User', foreignKey: 'uid' })
  Users.hasMany(ChargeHistory, { as: 'ChargeHistories', foreignKey: 'uid' })
  FavoriteTags.belongsTo(Users, { as: 'uid_User', foreignKey: 'uid' })
  Users.hasMany(FavoriteTags, { as: 'FavoriteTags', foreignKey: 'uid' })
  Submissions.belongsTo(Users, { as: 'uid_User', foreignKey: 'uid' })
  Users.hasMany(Submissions, { as: 'Submissions', foreignKey: 'uid' })
  WorkbookHistory.belongsTo(Users, { as: 'uid_User', foreignKey: 'uid' })
  Users.hasMany(WorkbookHistory, { as: 'WorkbookHistories', foreignKey: 'uid' })
  Problems.belongsTo(Views, { as: 'vid_View', foreignKey: 'vid' })
  Views.hasMany(Problems, { as: 'Problems', foreignKey: 'vid' })
  Sections.belongsTo(Workbooks, { as: 'wid_Workbook', foreignKey: 'wid' })
  Workbooks.hasMany(Sections, { as: 'Sections', foreignKey: 'wid' })
  WorkbookHistory.belongsTo(Workbooks, { as: 'wid_Workbook', foreignKey: 'wid' })
  Workbooks.hasMany(WorkbookHistory, { as: 'WorkbookHistories', foreignKey: 'wid' })
  WorkbookTags.belongsTo(Workbooks, { as: 'wid_Workbook', foreignKey: 'wid' })
  Workbooks.hasMany(WorkbookTags, { as: 'WorkbookTags', foreignKey: 'wid' })

  return {
    ChargeHistory,
    FavoriteTags,
    Items,
    Problems,
    Sections,
    Submissions,
    Tags,
    Users,
    Views,
    WorkbookHistory,
    WorkbookTags,
    Workbooks
  }
}
module.exports = initModels
module.exports.initModels = initModels
module.exports.default = initModels