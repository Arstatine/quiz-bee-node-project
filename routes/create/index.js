const express = require('express');
const router = express();
const { createController } = require('../../controllers');
const auth = require('../../middlewares/auth_user_cookie');

router
  .route('/create')
  .get(auth, createController.isUserLoggedIn)
  .post(auth, createController.createQuiz);

router.route('/create/:id').get(auth, createController.createQuestion);
module.exports = router;
