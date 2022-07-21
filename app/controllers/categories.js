const { selectAllCategories } = require('../services/categories.js');

exports.getCategories = async (req, res) => {
  const { count, rows: categories } = await selectAllCategories();

  return res.status(200).json({ count, categories });
};
