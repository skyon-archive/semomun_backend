const DataTypes = require('sequelize').DataTypes
const _ErrorReports = require('./ErrorReports')
const _FavoriteTags = require('./FavoriteTags')
const _Items = require('./Items')
const _Notices = require('./Notices.js')
const _PayHistory = require('./PayHistory')
const _Problems = require('./Problems')
const _Sections = require('./Sections')
const _Submissions = require('./Submissions')
const _Tags = require('./Tags')
const _UserInfo = require('./UserInfo')
const _Users = require('./Users')
const _Views = require('./Views')
const _ViewSubmissions = require('./ViewSubmissions')
const _WorkbookHistory = require('./WorkbookHistory')
const _WorkbookTags = require('./WorkbookTags')
const _Workbooks = require('./Workbooks')

function initModels (sequelize) {
  const ErrorReports = _ErrorReports(sequelize, DataTypes)
  const FavoriteTags = _FavoriteTags(sequelize, DataTypes)
  const Items = _Items(sequelize, DataTypes)
  const Notices = _Notices(sequelize, DataTypes)
  const PayHistory = _PayHistory(sequelize, DataTypes)
  const Problems = _Problems(sequelize, DataTypes)
  const Sections = _Sections(sequelize, DataTypes)
  const Submissions = _Submissions(sequelize, DataTypes)
  const Tags = _Tags(sequelize, DataTypes)
  const UserInfo = _UserInfo(sequelize, DataTypes)
  const Users = _Users(sequelize, DataTypes)
  const Views = _Views(sequelize, DataTypes)
  const ViewSubmissions = _ViewSubmissions(sequelize, DataTypes)
  const WorkbookHistory = _WorkbookHistory(sequelize, DataTypes)
  const WorkbookTags = _WorkbookTags(sequelize, DataTypes)
  const Workbooks = _Workbooks(sequelize, DataTypes)

  ErrorReports.belongsTo(Problems, { as: 'pid_Problem', foreignKey: 'pid' })
  Problems.hasMany(ErrorReports, { as: 'errorReports', foreignKey: 'pid' })
  ErrorReports.belongsTo(Users, { as: 'uid_User', foreignKey: 'uid' })
  Users.hasMany(ErrorReports, { as: 'errorReports', foreignKey: 'uid' })
  Tags.belongsToMany(Users, { as: 'uid_Users', through: FavoriteTags, foreignKey: 'tid', otherKey: 'uid' })
  Tags.belongsToMany(Workbooks, { as: 'wid_Workbooks', through: WorkbookTags, foreignKey: 'tid', otherKey: 'wid' })
  Users.belongsToMany(Tags, { as: 'tid_Tags', through: FavoriteTags, foreignKey: 'uid', otherKey: 'tid' })
  Workbooks.belongsToMany(Tags, { as: 'tid_Tags_WorkbookTags', through: WorkbookTags, foreignKey: 'wid', otherKey: 'tid' })
  Workbooks.belongsTo(Items, { as: 'item', foreignKey: 'id' })
  Items.hasOne(Workbooks, { as: 'workbook', foreignKey: 'id' })
  Submissions.belongsTo(Problems, { as: 'pid_Problem', foreignKey: 'pid' })
  Problems.hasMany(Submissions, { as: 'Submissions', foreignKey: 'pid' })
  ViewSubmissions.belongsTo(Views, { as: 'vid_View', foreignKey: 'vid' })
  Views.hasMany(ViewSubmissions, { as: 'ViewSubmissions', foreignKey: 'vid' })
  Views.belongsTo(Sections, { as: 'sid_Section', foreignKey: 'sid' })
  Sections.hasMany(Views, { as: 'views', foreignKey: 'sid' })
  FavoriteTags.belongsTo(Tags, { as: 'tid_Tag', foreignKey: 'tid' })
  Tags.hasMany(FavoriteTags, { as: 'FavoriteTags', foreignKey: 'tid' })
  WorkbookTags.belongsTo(Tags, { as: 'tid_Tag', foreignKey: 'tid' })
  Tags.hasMany(WorkbookTags, { as: 'WorkbookTags', foreignKey: 'tid' })
  PayHistory.belongsTo(Users, { as: 'uid_User', foreignKey: 'uid' })
  Users.hasMany(PayHistory, { as: 'PayHistories', foreignKey: 'uid' })
  PayHistory.belongsTo(Items, { as: 'item', foreignKey: 'id' })
  Items.hasMany(PayHistory, { as: 'payHistory', foreignKey: 'id' })
  FavoriteTags.belongsTo(Users, { as: 'uid_User', foreignKey: 'uid' })
  Users.hasOne(UserInfo, { as: 'userInfo', foreignKey: 'uid' })
  UserInfo.belongsTo(Users, { as: 'user', foreignKey: 'uid' })
  Users.hasMany(FavoriteTags, { as: 'favoriteTags', foreignKey: 'uid' })
  Submissions.belongsTo(Users, { as: 'uid_User', foreignKey: 'uid' })
  Users.hasMany(Submissions, { as: 'Submissions', foreignKey: 'uid' })
  ViewSubmissions.belongsTo(Users, { as: 'uid_User', foreignKey: 'uid' })
  Users.hasMany(ViewSubmissions, { as: 'ViewSubmissions', foreignKey: 'uid' })
  WorkbookHistory.belongsTo(Users, { as: 'uid_User', foreignKey: 'uid' })
  Users.hasMany(WorkbookHistory, { as: 'WorkbookHistories', foreignKey: 'uid' })
  Problems.belongsTo(Views, { as: 'vid_View', foreignKey: 'vid' })
  Views.hasMany(Problems, { as: 'problems', foreignKey: 'vid' })
  Sections.belongsTo(Workbooks, { as: 'wid_Workbook', foreignKey: 'wid' })
  Workbooks.hasMany(Sections, { as: 'sections', foreignKey: 'wid' })
  WorkbookHistory.belongsTo(Workbooks, { as: 'wid_Workbook', foreignKey: 'wid' })
  Workbooks.hasMany(WorkbookHistory, { as: 'workbookHistories', foreignKey: 'wid' })
  WorkbookTags.belongsTo(Workbooks, { as: 'wid_Workbook', foreignKey: 'wid' })
  Workbooks.hasMany(WorkbookTags, { as: 'WorkbookTags', foreignKey: 'wid' })

  return {
    ErrorReports,
    FavoriteTags,
    Items,
    Notices,
    Problems,
    Sections,
    Submissions,
    PayHistory,
    Tags,
    UserInfo,
    Users,
    Views,
    ViewSubmissions,
    WorkbookHistory,
    WorkbookTags,
    Workbooks
  }
}
module.exports = initModels
module.exports.initModels = initModels
module.exports.default = initModels
