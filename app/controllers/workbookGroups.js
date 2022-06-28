const { parseIntDefault, parseIntList } = require('../utils.js');
const { selectWorkbookGroups, selectOneWorkbookGroup } = require('../services/workbookGroups.js');

exports.getWorkbookGroups = async (req, res) => {
  // Query Params
  const { page, limit, tids, keyword } = req.query;
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

  res.status(200).json(workbookgroup);
};

exports.getPurchasedWorkbookGroups = async (req, res) => {
  try {
    const uid = req.uid;
    if (!uid) return res.status(401).send(req.jwtMessage);

    const { order } = req.query;
    console.log(order);

    res.status(200).json([
      // Mock Data Return
      {
        wgid: 2,
        solve: '2022-03-09T17:03:34.000Z',
        createdAt: '2022-03-10T19:37:11.000Z',
        workbooks: [2, 3],
      },
      {
        wgid: 3,
        solve: '2022-03-09T17:03:34.000Z',
        createdAt: '2022-03-10T19:37:11.000Z',
        workbooks: [3, 4],
      },
    ]);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};
