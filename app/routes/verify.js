module.exports = (app) => {
  const verifier = require("../controllers/verify.js");

  var router = require("express").Router();

  router.get("/", verifier.get);

  app.use("/verify", router);
};
