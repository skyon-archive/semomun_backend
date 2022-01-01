module.exports = (app) => {
  const auth = require("../controllers/auth.js");

  var router = require("express").Router();

  router.post("/login", auth.login);
  router.get("/", auth.url);
  app.use("/auth", router);
};
