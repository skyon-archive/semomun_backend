const { sequelize, ResultSubmissions } = require('../models/index.js');

exports.selectAllResultByWgid = async (uid, wgid) => {
  return await ResultSubmissions.findAll({
    // exclude: ['workboook'], 왜 적용이 안될까?
    attributes: {
      include: [
        [sequelize.col('`workbook`.`id`'), 'id'],
        [sequelize.col('`workbook`.`title`'), 'title'],
        [sequelize.col('`workbook`.`subject`'), 'subject'], // 어디서 가져올까
        [sequelize.col('`workbook`.`area`'), 'area'],
        [sequelize.col('`workbook`.`standardDeviation`'), 'standardDeviation'], // 표준 편차
      ],
    },
    where: { uid, wgid },
    include: { association: 'workbook', attributes: { exclude: ['workbook'] } },
  });
};

exports.selectOneResultByWid = async (uid, wid) => {
  return await ResultSubmissions.findOne({
    attributes: {
      include: [
        [sequelize.col('`workbook`.`id`'), 'id'],
        [sequelize.col('`workbook`.`title`'), 'title'],
        [sequelize.col('`workbook`.`subject`'), 'subject'], // 어디서 가져올까
        [sequelize.col('`workbook`.`area`'), 'area'],
        [sequelize.col('`workbook`.`standardDeviation`'), 'standardDeviation'], // 표준 편차
      ],
    },
    where: { uid, wid },
    include: { association: 'workbook' },
  });
};

exports.selectResultByWidFromAllUser = async (wid) => {
  return await ResultSubmissions.findAll({
    attributes: {
      include: [
        [sequelize.col('`workbook`.`id`'), 'id'],
        [sequelize.col('`workbook`.`title`'), 'title'],
        [sequelize.col('`workbook`.`subject`'), 'subject'], // 어디서 가져올까
        [sequelize.col('`workbook`.`area`'), 'area'],
        [sequelize.col('`workbook`.`standardDeviation`'), 'standardDeviation'], // 표준 편차
        [sequelize.col('`workbook`.`cutoff`'), 'cutoff'], // 컷오프
      ],
    },
    where: { wid },
    include: { association: 'workbook', attributes: { exclude: ['workbook'] } },
    order: [[sequelize.literal('`createdAt`'), 'DESC']],
  });
};
