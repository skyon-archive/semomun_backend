const { parseIntDefault, parseIntList } = require('../utils.js');
const { selectWorkbookGroups } = require('../services/workbookGroups.js');

exports.getWorkbookGroups = async (req, res) => {
  // Query Params
  const { page, limit, tids, keyword } = req.query;
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
