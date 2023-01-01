const express = require('express');
const router = express();
const { dashboardController } = require('../../controllers');
const auth = require('../../middlewares/auth_user_cookie');

router.route('/dashboard').get(auth, dashboardController.isUserLoggedIn);

module.exports = router;
