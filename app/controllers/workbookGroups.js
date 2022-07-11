const { parseIntDefault, parseIntList } = require('../utils.js');

const {
  selectWorkbookGroups,
  selectOneWorkbookGroup,
  selectPurchasedWorkbookGroups,
} = require('../services/workbookGroups.js');

exports.getWorkbookGroups = async (req, res) => {
  // Query Params
  const { page, limit, tids, keyword } = req.query;
  let { order } = req.query;
  order =
    order === 'titleDescending'
      ? 'titleDesceding'
      : order === 'titleAscending'
      ? 'titleAsceding'
      : 'recentUpload';
  console.log('Order =', order);
  res
    .status(200)
    .json(
      await selectWorkbookGroups(
        parseIntDefault(page, 1),
        parseIntDefault(limit, 25),
        parseIntList(tids ?? []),
        keyword ?? ''
      )
    );
};

exports.getOneWorkbookGroup = async (req, res) => {
  const { wgid } = req.params;
  workbookgroup = await selectOneWorkbookGroup(wgid);
  if (!workbookgroup) return res.status(404).send();

  const workbookgroupData = workbookgroup.get({ plain: true });
  Array.from(workbookgroupData.workbooks).forEach((workbook) => {
    // cutoff.rank int to string 관련
    if (Array.isArray(workbook.cutoff)) {
      workbook.cutoff.forEach((cutoff) => {
        cutoff.rank = cutoff.rank.toString();
      });
    }

    // item 관련
    workbook.price = workbook.item.price;
    workbook.sales = workbook.item.sales;
    delete workbook.item;

    // tags 관련
    workbook.tags = [];
    workbook.WorkbookTags.forEach((WorkbookTags) => {
      workbook.tags.push(WorkbookTags.tid_Tag);
    });
    delete workbook.WorkbookTags;
  });

  res.status(200).json(workbookgroupData);
};

exports.getPurchasedWorkbookGroups = async (req, res) => {
  try {
    const uid = req.uid;
    if (!uid) return res.status(401).send(req.jwtMessage);

    const { order } = req.query;
    console.log(order);
    const result = await selectPurchasedWorkbookGroups(uid, order);

    const resultData = result.map((workbookgroup) => {
      const workbookgroupData = workbookgroup.get({ plain: true });
      return {
        ...workbookgroupData,
        workbookgroupHistories: undefined,
        workbooks: workbookgroupData.workbooks.map((workbook) => workbook.wid),
        createdAt: workbookgroupData.workbooks.reduce((accu, curr) => {
          const currentCreatedAt = curr.item.payHistory[0].createdAt;
          if (!accu) return currentCreatedAt;
          return accu > currentCreatedAt ? accu : currentCreatedAt;
        }, null),
      };
    });

    res.status(200).json(resultData);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};
