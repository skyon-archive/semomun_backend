const { ForeignKeyConstraintError } = require('sequelize');
const redis = require('../services/redis');
const { parseIntDefault, parseIntList } = require('../utils');
const { BadRequest } = require('../errors');
const {
  Workbooks,
  Items,
  WorkbookTags,
  WorkbookHistory,
  sequelize,
  WorkbookGroups,
  WorkbookGroupHistory,
} = require('../models/index');
const {
  getPurchasedWorkbooks,
  fetchWorkbooks,
  fetchWorkbooksByWids,
} = require('../services/workbooks');

exports.fetchWorkbooks = async (req, res) => {
  try {
    const { page, limit, tids, keyword } = req.query;
    res.json(
      await fetchWorkbooks(
        parseIntDefault(page, 1),
        parseIntDefault(limit, 25),
        parseIntList(tids ?? []),
        keyword ?? ''
      )
    );
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

exports.fetchWorkbook = async (req, res) => {
  try {
    const { wid } = req.params;

    const workbook = await Workbooks.findOne({
      where: { wid },
      include: {
        association: 'sections',
        order: [['index', 'ASC']],
      },
    });
    if (!workbook) return res.status(404).send();

    const workbookData = workbook.get();
    delete workbookData.type;

    const item = await Items.findOne({
      where: { id: workbook.id },
      raw: true,
    });
    workbookData.price = item.price;
    workbookData.sales = item.sales;

    const workbookTags = await WorkbookTags.findAll({
      where: { wid },
      order: [['createdAt', 'ASC']],
      include: 'tid_Tag',
      raw: true,
      nest: true,
    });
    workbookData.tags = workbookTags.map(({ tid_Tag }) => tid_Tag);

    res.json(workbookData).send();
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

exports.solveWorkbook = async (req, res) => {
  try {
    const uid = req.uid;
    if (!uid) return res.status(401).send(req.jwtMessage);

    const { wid, datetime } = req.body;
    if (!wid || !datetime) throw new BadRequest();

    await sequelize.transaction(async (transaction) => {
      const history = await WorkbookHistory.findOne({
        where: { uid, wid, type: 'solve' },
        transaction,
      });

      const workbook = await Workbooks.findOne({
        where: { wid },
        transaction,
      });

      const wgid = workbook.wgid;
      const date = new Date(datetime);
      if (history) {
        await history.update({ datetime: date }, { transaction });
        if (wgid !== null) {
          const groupHistory = await WorkbookGroupHistory.findOne({ where: { uid, wgid } });
          console.log(groupHistory);
          if (groupHistory) {
            // 있었다면 현재 버전 이후인 것들
            await groupHistory.update({ datetime: date }, { transaction });
            console.log(groupHistory);
          } else {
            // 기존 데이터는 워크북에 대한 솔브 생성 시, 그룹에 대한 솔브 생성 기록이 없다. *예외처리인 것.*
            await WorkbookGroupHistory.create(
              { uid, wgid, type: 'solve', datetime: date },
              { transaction }
            );
          }
        }
      } else {
        await WorkbookHistory.create({ uid, wid, type: 'solve', datetime: date }, { transaction });
        if (wgid !== null) {
          // 애초에 기록이 없었다면, Workbook과 WorkbookGroup을 함께 생성함.(단, if (wgid !== null))
          await WorkbookGroupHistory.create(
            { uid, wgid, type: 'solve', datetime: date },
            { transaction }
          );
        }
      }
    });
    res.json({});
  } catch (err) {
    if (err instanceof ForeignKeyConstraintError) {
      console.log(err.fields);
      res.status(404).send(`Wrong ${err.fields}`);
    } else if (err instanceof BadRequest) res.status(400).send(err.message);
    else {
      console.log(err);
      res.status(500).send();
    }
  }
};

exports.getPurchasedWorkbooks = async (req, res) => {
  try {
    const uid = req.uid;
    if (!uid) return res.status(401).send(req.jwtMessage);

    const { order } = req.query;
    const workbooks = await getPurchasedWorkbooks(uid, order);

    res.json(workbooks);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

exports.getBestsellers = async (req, res) => {
  try {
    const wids = await redis.lRange('workbook:bestseller', 0, -1);
    console.log(wids);
    const result = await fetchWorkbooksByWids(wids.map((wid) => +wid));
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

/*
exports.put = (req, res) => {
  req.body.index
  req.body.title
  req.body.detail
  req.body.cutoff

  req.body.views

  const section = {
    index: req.body.index,
    title: req.body.title,
    detail: req.body.detail,
    cutoff: req.body.cutoff
  }

  Section.create(section)
    .then((data) => {
      data
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating Sections.'
      })
    })
  View.bulkCreate(views)
    .then((data) => {
      data
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating Views.'
      })
    })
  Problem.bulkCreate(problems)
    .then((data) => {
      data
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating Problems.'
      })
    })
}
*/
