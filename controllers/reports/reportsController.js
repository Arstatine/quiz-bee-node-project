const { Users } = require('../../models');
const mongoose = require('mongoose');

const DB_URL = process.env.MONGO_URL;

const conn = mongoose.createConnection(DB_URL);

const isUserLoggedIn = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const _id = req.session.user_id;

    const findUser = await Users.findById({ _id }, '_id name email isAdmin');

    return res.render('reports.ejs', { findUser });
  } catch (error) {
    next(error);
  }
};

module.exports = { isUserLoggedIn };
