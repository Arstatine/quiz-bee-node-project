const express = require('express');
const router = express();
const { reportsController } = require('../../controllers');
const auth = require('../../middlewares/auth_user_cookie');

router.route('/reports').get(auth, reportsController.isUserLoggedIn);

module.exports = router;
