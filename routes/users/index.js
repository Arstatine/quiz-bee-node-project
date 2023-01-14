const express = require('express');
const router = express();
const { usersController } = require('../../controllers');
const auth = require('../../middlewares/auth_user_cookie');

router.get('/', auth, usersController.isUserLoggedIn);

router
  .route('/registration')
  .get(auth, usersController.isRegLoggedIn)
  .post(auth, usersController.createNewUser);

router
  .route('/login')
  .get(auth, usersController.isLogLoggedIn)
  .post(auth, usersController.userLogin);

router
  .route('/profile')
  .get(auth, usersController.fetchProfile)
  .post(auth, usersController.updateProfile);
router.route('/api/users/logout').get(auth, usersController.userLogout);

module.exports = router;
