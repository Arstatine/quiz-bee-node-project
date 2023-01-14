const { Users, Questions, Reports } = require('../../models');

const isHostLoggedIn = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const _id = req.session.user_id;
    const question_id = req.params.id;

    const findUser = await Users.findOne({ _id }, '_id name email isAdmin');

    if (!findUser.isAdmin) return res.redirect('/');

    if (!question_id.match(/^[0-9a-fA-F]{24}$/)) return res.redirect('/');

    const findQuestion = await Questions.findOne(
      { _id: question_id },
      '_id title'
    );

    if (!findQuestion) return res.redirect('/');

    return res.render('hostGame.ejs', { findUser, findQuestion });
  } catch (error) {
    next(error);
  }
};

const isPlayerLoggedIn = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const _id = req.session.user_id;
    const question_id = req.params.id;

    const findUser = await Users.findOne({ _id }, '_id name email isAdmin');

    if (!question_id.match(/^[0-9a-fA-F]{24}$/)) return res.redirect('/');

    const findQuestion = await Questions.findOne(
      { _id: question_id },
      '_id title'
    );

    if (!findQuestion) return res.redirect('/');

    return res.render('playerGame.ejs', { findUser, findQuestion });
  } catch (error) {
    next(error);
  }
};

module.exports = { isHostLoggedIn, isPlayerLoggedIn };
