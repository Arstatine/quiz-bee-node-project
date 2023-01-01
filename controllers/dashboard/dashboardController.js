const { Users, Questions } = require('../../models');
const mongoose = require('mongoose');

const DB_URL = process.env.MONGO_URL;

const conn = mongoose.createConnection(DB_URL);

const isUserLoggedIn = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const _id = req.session.user_id;

    const findUser = await Users.findOne({ _id }, '_id name email isAdmin');
    const findQuestion = await Questions.find(
      { user_id: _id },
      '_id user_id title description'
    );

    return res.render('dashboard.ejs', { findUser, findQuestion });
  } catch (error) {
    next(error);
  }
};

module.exports = { isUserLoggedIn };
