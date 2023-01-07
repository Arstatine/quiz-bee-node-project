const express = require('express');
const router = express();
const { homeController } = require('../../controllers');
const auth = require('../../middlewares/auth_user_cookie');

router
  .route('/home')
  .get(auth, homeController.isUserLoggedIn)
  .post(auth, homeController.joinLobby);

module.exports = router;
