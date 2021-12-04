module.exports = (app) => {
  const auth = require("../controllers/auth.js");

  var router = require("express").Router();

  router.post("/login", auth.login);

  app.use("/auth", router);
};
