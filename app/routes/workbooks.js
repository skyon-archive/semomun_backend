module.exports = app => {
  const workbooks = require("../controllers/workbook.js");

  var router = require("express").Router();

  router.get("/preview", workbooks.preview);
  router.get("/", workbooks.create);
  router.get("/:wid", workbooks.get);

  app.use('/workbooks', router);
};