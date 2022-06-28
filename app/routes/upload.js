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

  const groupConfig = upload.fields([
    { name: 'config', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]);
  router.post('/group-config', groupConfig, authJwt, readGroupConfig);
  router.post('/group-confirm', authJwt, confirmWorkbookGroup);

  router.patch('/bookcover', authJwt, updateBookcover);

  app.use('/upload', router);
};
