const express = require('express');
const router = express();
const { gameController } = require('../../controllers');
const auth = require('../../middlewares/auth_user_cookie');

router.route('/host/game/:id').get(auth, gameController.isHostLoggedIn);

router.route('/player/game/:id').get(auth, gameController.isPlayerLoggedIn);

module.exports = router;
