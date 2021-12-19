module.exports = (app) => {
  const login = require("../controllers/login.js");

  var router = require("express").Router();

  router.get("/info/category", login.category);
  router.get("/info/major", login.major);

  app.use("/login", router);
};
