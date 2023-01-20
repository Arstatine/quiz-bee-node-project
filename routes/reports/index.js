const express = require('express');
const router = express();
const { reportsController } = require('../../controllers');
const auth = require('../../middlewares/auth_user_cookie');

router.route('/reports').get(auth, reportsController.isUserLoggedIn);

router
  .route('/api/reports/download/:id')
  .get(auth, reportsController.downloadReport);
router
  .route('/api/reports/delete/:id')
  .get(auth, reportsController.deleteReport);

module.exports = router;
