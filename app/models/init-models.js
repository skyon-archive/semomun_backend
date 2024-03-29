const DataTypes = require('sequelize').DataTypes;

// Notices - 1
const _Notices = require('./Notices.js');

// BootPay - 1
const _BootPayWebhook = require('./BootPayWebhook.js');
const _BootpayOrders = require('./BootpayOrders.js');

// Items - 6
const _Items = require('./Items.js');
const _WorkbookGroups = require('./WorkbookGroups.js'); // WorkbookGroups Model
const _Workbooks = require('./Workbooks.js');
const _Sections = require('./Sections.js');
const _Views = require('./Views.js');
const _Problems = require('./Problems.js');

// User - 2
const _ConsoleUsers = require('./ConsoleUsers.js');
const _Users = require('./Users.js');
const _UserInfo = require('./UserInfo.js');
const _UserBillingKeys = require('./UserBillingKeys.js');

// Tag - 1
const _Categories = require('./Categories.js');
const _Tags = require('./Tags.js');

// Relationship Tables - 7
const _PayHistory = require('./PayHistory.js');
const _FavoriteTags = require('./FavoriteTags.js');
const _WorkbookTags = require('./WorkbookTags.js');
const _WorkbookGroupHistory = require('./WorkbookGroupHistory.js');
const _WorkbookHistory = require('./WorkbookHistory.js');
const _ViewSubmissions = require('./ViewSubmissions.js');
const _Submissions = require('./Submissions.js');
const _ResultSubmissions = require('./ResultSubmissions.js');
const _ErrorReports = require('./ErrorReports.js');

function initModels(sequelize) {
  const ErrorReports = _ErrorReports(sequelize, DataTypes);
  const FavoriteTags = _FavoriteTags(sequelize, DataTypes);
  const Items = _Items(sequelize, DataTypes);
  const Notices = _Notices(sequelize, DataTypes);
  const PayHistory = _PayHistory(sequelize, DataTypes);
  const Problems = _Problems(sequelize, DataTypes);
  const Sections = _Sections(sequelize, DataTypes);
  const Submissions = _Submissions(sequelize, DataTypes);
  const Tags = _Tags(sequelize, DataTypes);
  const UserInfo = _UserInfo(sequelize, DataTypes);
  const Users = _Users(sequelize, DataTypes);
  const Views = _Views(sequelize, DataTypes);
  const ViewSubmissions = _ViewSubmissions(sequelize, DataTypes);
  const WorkbookHistory = _WorkbookHistory(sequelize, DataTypes);
  const WorkbookTags = _WorkbookTags(sequelize, DataTypes);
  const Workbooks = _Workbooks(sequelize, DataTypes);
  const WorkbookGroups = _WorkbookGroups(sequelize, DataTypes);
  const WorkbookGroupHistory = _WorkbookGroupHistory(sequelize, DataTypes);
  const ResultSubmissions = _ResultSubmissions(sequelize, DataTypes);
  const UserBillingKeys = _UserBillingKeys(sequelize, DataTypes);
  const BootPayWebhook = _BootPayWebhook(sequelize, DataTypes);
  const BootpayOrders = _BootpayOrders(sequelize, DataTypes);
  const ConsoleUsers = _ConsoleUsers(sequelize, DataTypes);
  const Categories = _Categories(sequelize, DataTypes);

  ErrorReports.belongsTo(Problems, { as: 'pid_Problem', foreignKey: 'pid' });
  Problems.hasMany(ErrorReports, { as: 'errorReports', foreignKey: 'pid' });
  ErrorReports.belongsTo(Users, { as: 'uid_User', foreignKey: 'uid' });
  Users.hasMany(ErrorReports, { as: 'errorReports', foreignKey: 'uid' });
  Tags.belongsToMany(Users, {
    as: 'uid_Users',
    through: FavoriteTags,
    foreignKey: 'tid',
    otherKey: 'uid',
  });
  Tags.belongsToMany(Workbooks, {
    as: 'wid_Workbooks',
    through: WorkbookTags,
    foreignKey: 'tid',
    otherKey: 'wid',
  });
  Users.belongsToMany(Tags, {
    as: 'tid_Tags',
    through: FavoriteTags,
    foreignKey: 'uid',
    otherKey: 'tid',
  });
  Workbooks.belongsToMany(Tags, {
    as: 'tid_Tags_WorkbookTags',
    through: WorkbookTags,
    foreignKey: 'wid',
    otherKey: 'tid',
  });
  Workbooks.belongsTo(Items, { as: 'item', foreignKey: 'id' });
  Items.hasOne(Workbooks, { as: 'workbook', foreignKey: 'id' });
  Submissions.belongsTo(Problems, { as: 'pid_Problem', foreignKey: 'pid' });
  Problems.hasMany(Submissions, { as: 'Submissions', foreignKey: 'pid' });
  ViewSubmissions.belongsTo(Views, { as: 'vid_View', foreignKey: 'vid' });
  Views.hasMany(ViewSubmissions, { as: 'ViewSubmissions', foreignKey: 'vid' });
  Views.belongsTo(Sections, { as: 'Section', foreignKey: 'sid' });
  Sections.hasMany(Views, { as: 'views', foreignKey: 'sid' });
  FavoriteTags.belongsTo(Tags, { as: 'tid_Tag', foreignKey: 'tid' });
  Tags.hasMany(FavoriteTags, { as: 'FavoriteTags', foreignKey: 'tid' });
  WorkbookTags.belongsTo(Tags, { as: 'tid_Tag', foreignKey: 'tid' });
  Tags.hasMany(WorkbookTags, { as: 'WorkbookTags', foreignKey: 'tid' });
  PayHistory.belongsTo(Users, { as: 'uid_User', foreignKey: 'uid' });
  Users.hasMany(PayHistory, { as: 'PayHistories', foreignKey: 'uid' });
  PayHistory.belongsTo(Items, { as: 'item', foreignKey: 'id' });
  Items.hasMany(PayHistory, { as: 'payHistory', foreignKey: 'id' });
  FavoriteTags.belongsTo(Users, { as: 'uid_User', foreignKey: 'uid' });
  Users.hasOne(UserInfo, { as: 'userInfo', foreignKey: 'uid' });
  UserInfo.belongsTo(Users, { as: 'user', foreignKey: 'uid' });
  Users.hasMany(FavoriteTags, { as: 'favoriteTags', foreignKey: 'uid' });
  Submissions.belongsTo(Users, { as: 'uid_User', foreignKey: 'uid' });
  Users.hasMany(Submissions, { as: 'Submissions', foreignKey: 'uid' });
  ViewSubmissions.belongsTo(Users, { as: 'uid_User', foreignKey: 'uid' });
  Users.hasMany(ViewSubmissions, { as: 'ViewSubmissions', foreignKey: 'uid' });
  WorkbookHistory.belongsTo(Users, { as: 'uid_User', foreignKey: 'uid' });
  Users.hasMany(WorkbookHistory, { as: 'WorkbookHistories', foreignKey: 'uid' });
  Problems.belongsTo(Views, { as: 'View', foreignKey: 'vid' });
  Views.hasMany(Problems, { as: 'problems', foreignKey: 'vid' });
  Sections.belongsTo(Workbooks, { as: 'Workbook', foreignKey: 'wid' });
  Workbooks.hasMany(Sections, { as: 'sections', foreignKey: 'wid' });
  WorkbookHistory.belongsTo(Workbooks, { as: 'Workbook', foreignKey: 'wid' });
  Workbooks.hasMany(WorkbookHistory, { as: 'workbookHistories', foreignKey: 'wid' });
  WorkbookTags.belongsTo(Workbooks, { as: 'wid_Workbook', foreignKey: 'wid' });
  Workbooks.hasMany(WorkbookTags, { as: 'WorkbookTags', foreignKey: 'wid' });

  // // New Option
  WorkbookGroups.hasMany(Workbooks, {
    as: 'workbooks',
    foreignKey: 'wgid',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });

  // // New Option
  Items.hasMany(WorkbookGroups, {
    as: 'workbookGroups',
    foreignKey: 'id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });

  Workbooks.belongsTo(WorkbookGroups, { as: 'workbookgroups', foreignKey: 'wgid' });

  WorkbookGroups.hasMany(WorkbookGroupHistory, {
    as: 'workbookgroupHistories',
    foreignKey: 'wgid',
  });
  WorkbookGroupHistory.belongsTo(WorkbookGroups, { as: 'workbookgroup', foreignKey: 'wgid' });

  Workbooks.hasMany(ResultSubmissions, { as: 'resultSubmissions', foreignKey: 'wid' });
  ResultSubmissions.belongsTo(Workbooks, { as: 'workbook', foreignKey: 'wid' });

  Categories.hasMany(Tags, { as: 'tags', foreignKey: 'cid' });
  Tags.belongsTo(Categories, { as: 'category', foreignKey: 'cid' });

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
    Workbooks,
    WorkbookGroups,
    WorkbookGroupHistory,
    ResultSubmissions,
    UserBillingKeys,
    BootPayWebhook,
    BootpayOrders,
    ConsoleUsers,
    Categories,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
