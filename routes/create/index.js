const express = require('express');
const router = express();
const { createController } = require('../../controllers');
const auth = require('../../middlewares/auth_user_cookie');

router
  .route('/create')
  .get(auth, createController.isUserLoggedIn)
  .post(auth, createController.createQuiz);

router.route('/quiz/:id').get(auth, createController.createQuestion);

router.route('/host/:id').get(auth, createController.createLobby);

router.route('/api/quiz/:id/delete').get(auth, createController.deleteQuestion);

router
  .route('/api/question/randomize/:id')
  .get(auth, createController.randomizeQuestion);

router
  .route('/quiz/:id/add')
  .get(auth, createController.fetchQuestion)
  .post(auth, createController.addQuestion);

router
  .route('/quiz/:id/:arr')
  .get(auth, createController.editQuestion)
  .post(auth, createController.updateQuestion);

router
  .route('/quiz/:id/:arr/delete')
  .get(auth, createController.questionDelete);

module.exports = router;
