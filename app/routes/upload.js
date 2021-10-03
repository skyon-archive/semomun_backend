module.exports = (app) => {
  const uploader = require("../controllers/upload.js");

  var router = require("express").Router();

  router.get("/", uploader.upload);

  app.use("/upload", router);
};
