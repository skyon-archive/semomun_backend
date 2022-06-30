const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const {
  readConfig,
  confirmWorkbook,
  updateBookcover,
  readGroupConfig,
  confirmWorkbookGroup,
} = require('../controllers/upload');
const { authJwt } = require('../middleware/auth');

module.exports = (app) => {
  router.post('/config', upload.single('config'), authJwt, readConfig);
  router.post('/confirm', authJwt, confirmWorkbook);
  router.post('/group-config', upload.single('config'), authJwt, readGroupConfig);
  router.post('/group-confirm', authJwt, confirmWorkbookGroup);
  router.patch('/bookcover', authJwt, updateBookcover);
  app.use('/upload', router);
};
