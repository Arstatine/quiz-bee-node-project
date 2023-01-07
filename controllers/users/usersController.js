const { Users } = require('../../models');
const bcryptjs = require('bcryptjs');

const userLogout = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    res.clearCookie('_id');
    req.session.destroy();

    return res.redirect('/login');
  } catch (e) {
    next(e);
  }
};

const isLogLoggedIn = async (req, res, next) => {
  try {
    if (!req.session.user_id)
      return res.render('login.ejs', { loggedin: false, error: 'None' });

    return res.redirect('/home');
  } catch (error) {
    next(error);
  }
};

const isRegLoggedIn = async (req, res, next) => {
  try {
    if (!req.session.user_id)
      return res.render('registration.ejs', { register: false, error: 'None' });

    return res.redirect('/home');
  } catch (error) {
    next(error);
  }
};

const isUserLoggedIn = async (req, res, next) => {
  try {
    if (!req.session.user_id)
      return res.render('index.ejs', { loggedin: false });

    return res.redirect('/home');
  } catch (error) {
    next(error);
  }
};

const createNewUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const canSave = [name, email, password].every(Boolean);

    if (!canSave)
      return res.status(400).json({ err: 'required field must be filled' });

    const findEmail = await Users.find({ email: email });

    if (findEmail != '')
      return res.render('registration.ejs', {
        register: false,
        error: 'Email already exist.',
      });

    const hashPassword = await bcryptjs.hash(password, 10);

    const user = await Users.create({
      name,
      isAdmin: false,
      email,
      password: hashPassword,
    });

    if (!user) return res.json({ err: 'error' });

    return res.render('registration.ejs', { register: true, error: 'None' });
  } catch (e) {
    next(e);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const findUser = await Users.findOne({ email }, '_id email password');

    if (!findUser)
      return res.render('login.ejs', {
        loggedin: false,
        error: 'No user found!',
      });

    bcryptjs.compare(password, findUser?.password).then((match) => {
      if (!match)
        return res.render('login.ejs', {
          loggedin: false,
          error: 'Your email and password do not match.',
        });

      req.session.user_id = findUser._id.toJSON();

      return res.render('login.ejs', { loggedin: true, error: 'None' });
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createNewUser,
  userLogin,
  isUserLoggedIn,
  isRegLoggedIn,
  isLogLoggedIn,
  userLogout,
};
