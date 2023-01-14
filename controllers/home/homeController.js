const { Users, Questions, Reports } = require('../../models');

const isUserLoggedIn = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const _id = req.session.user_id;

    const findUser = await Users.findOne(
      { _id },
      '_id name email isAdmin avatar'
    );

    return res.render('home.ejs', { findUser });
  } catch (error) {
    next(error);
  }
};

const joinLobby = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');
    const date = new Date();

    const _id = req.session.user_id;
    const findUser = await Users.findOne({ _id }, '_id isAdmin');

    if (!findUser) return res.redirect('/');

    const { name, pin } = req.body;

    const findQuestion = await Questions.findOne({ pin: pin }, '_id title pin');

    if (!findQuestion) return res.redirect('/');

    return res.render('playersLobby.ejs', {
      findQuestion,
      findUser,
      uName: name,
      pin: pin,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { isUserLoggedIn, joinLobby };
