const { Users } = require('../../models');

const isUserLoggedIn = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const _id = req.session.user_id;

    const findUser = await Users.findById({ _id }, '_id name email isAdmin');

    if (!findUser.isAdmin) return res.redirect('/home');

    return res.render('reports.ejs', { findUser });
  } catch (error) {
    next(error);
  }
};

module.exports = { isUserLoggedIn };
