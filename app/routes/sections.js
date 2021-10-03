module.exports = (app) => {
  const sections = require("../controllers/section.js");

  var router = require("express").Router();

  router.get("/:sid", sections.get);

  app.use("/sections", router);
};
