const { parseIntDefault, parseIntList } = require('../utils.js');
const { selectWorkbookGroups, selectOneWorkbookGroup } = require('../services/workbookGroups.js');

exports.getWorkbookGroups = async (req, res) => {
  // Query Params
  const { page, limit, tids, keyword } = req.query;
  console.log('!@!@!@!@@#@#@#@#');
  console.log(page);
  console.log(limit);
  console.log(tids);
  console.log(keyword);
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

exports.getOneWorkbookGroup = async (req, res, next) => {
  const { wgid } = req.params;
  console.log('@@@');
  console.log(wgid);
  workbookgroup = await selectOneWorkbookGroup(wgid);
  if (!workbookgroup) return res.status(404).send();

  res.status(200).json({ workbookgroup });
};
