const { Op } = require('sequelize');
const {
  Workbooks,
  sequelize,
  Problems,
  PayHistory,
  Items,
  ConsoleUsers,
} = require('../models/index.js');

exports.selectWorkbooks = async (offset, limit, keyword, order) => {
  const like = `%${keyword.replace(/%/, '\\%')}%`;

  const { count, rows } = await Workbooks.findAndCountAll({
    attributes: [
      'wid',
      'wgid',
      'title',
      'author',
      'publishCompany',
      [sequelize.col('`item`.`originalPrice`'), 'originalPrice'],
      [sequelize.col('`item`.`price`'), 'price'],
      ['type', 'isHidden'],
      'createdAt',
      'updatedAt',
    ],
    include: {
      association: 'item',
      attributes: ['originalPrice', 'price'],
      required: true,
    },
    where: { title: { [Op.like]: like } },
    offset: (offset - 1) * limit,
    limit,
    order: [['createdAt', order]],
  });
  return { count, rows };
};

exports.selectWorkbookByWid = async (wid) => {
  return await Workbooks.findOne({
    attributes: [
      'wid',
      'title',
      'author',
      'publishCompany',
      'bookcover',
      [sequelize.col('`item`.`originalPrice`'), 'originalPrice'],
      [sequelize.col('`item`.`price`'), 'price'],
      [sequelize.col('`item`.`sales`'), 'sales'],
      ['type', 'isHidden'],
      'createdAt',
      'updatedAt',
    ],
    include: {
      association: 'item',
      attributes: ['id', 'originalPrice', 'price', 'sales'],
      required: true,
    },
    where: { wid },
  });
};

exports.selectProblemsByWid = async (wid, offset, limit) => {
  const { count, rows } = await Problems.findAndCountAll({
    attributes: [
      //   [sequelize.col('`View->Section->Workbook`.`wid`'), 'wid'], -> 현재는 사용되지 않음.
      //   [sequelize.col('`View->Section`.`sid`'), 'sid'],
      //   [sequelize.col('`View`.`vid`'), 'vid'],
      'pid',
      'index',
      'btType',
      'type',
      'answer',
      'score',
    ],
    include: {
      association: 'View',
      attributes: [],
      required: true,
      include: {
        association: 'Section',
        required: true,
        include: {
          association: 'Workbook',
          required: true,
          where: { wid },
        },
      },
    },
    offset: (offset - 1) * limit,
    limit,
    /**
     * 문제 정보 수정 시, 같은 문제의 번호로 바꾸면 제일 최근에 바꾼 문제가 위로 올라오게 된다.
     * 같은 문제의 번호중, 위에 있는 번호가 제일 최근에 변경한 문제의 번호라고 알면 된다.
     */
    order: [
      ['pid', 'ASC'],
      ['updatedAt', 'DESC'],
    ],
  });
  return { count, rows };
};

exports.selectProblemByPid = async (pid) => {
  return Problems.findOne({
    attributes: [
      [sequelize.col('`View->Section->Workbook`.`wid`'), 'wid'],
      [sequelize.col('`View->Section->Workbook`.`title`'), 'title'],
      'pid',
      'index',
      'btType',
      'type',
      'content',
      'explanation',
      'answer',
      'score',
    ],
    include: {
      association: 'View',
      attributes: [],
      required: true,
      include: {
        association: 'Section',
        required: true,
        include: {
          association: 'Workbook',
          required: true,
        },
      },
    },
    where: { pid },
  });
};

exports.selectWorkbookByTitle = async (wid, title) => {
  return Workbooks.findOne({
    where: { title, wid: { [Op.not]: wid } },
  });
};

exports.selectPayHistoryById = async (id) => {
  return await PayHistory.findAll({ where: { id } });
};

exports.selectItemByWid = async (wid) => {
  return await Items.findOne({
    include: {
      association: 'workbook',
      attributes: ['wid', 'title', 'bookcover'],
      required: true,
      where: { wid },
      include: {
        association: 'sections',
        attributes: ['sid', 'sectioncover'],
        required: true,
        include: {
          association: 'views',
          attributes: ['vid', 'passage'],
          required: true,
          include: {
            association: 'problems',
            attributes: ['pid', 'content', 'explanation'],
            required: true,
          },
        },
      },
    },
  });
};

exports.insertConsoleUser = async (pcid, name, username, hashedPassword, role, otherNotes) => {
  return ConsoleUsers.create({
    pcid,
    name,
    username,
    password: hashedPassword,
    role,
    otherNotes,
  });
};

exports.selectAConsoleUserByCuid = async (cuid) => {
  return await ConsoleUsers.findOne({ where: { cuid } });
};
