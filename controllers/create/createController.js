const { Users, Questions } = require('../../models');
const mongoose = require('mongoose');

const DB_URL = process.env.MONGO_URL;

const conn = mongoose.createConnection(DB_URL);

const isUserLoggedIn = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const _id = req.session.user_id;

    const findUser = await Users.findOne({ _id }, '_id name email isAdmin');

    return res.render('create.ejs', { findUser });
  } catch (error) {
    next(error);
  }
};

const createQuiz = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const { title, description } = req.body;

    const _id = req.session.user_id;

    const findUser = await Users.findOne({ _id }, '_id name email isAdmin');

    const question = await Questions.create({
      user_id: _id,
      title,
      description,
    });

    return res.redirect('/create/' + question._id);
  } catch (e) {
    next(e);
  }
};

const createQuestion = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const question_id = req.params.id;
    const _id = req.session.user_id;

    const findQuestion = await Questions.findOne(
      { _id: question_id },
      '_id title description questions'
    );

    const findUser = await Users.findOne({ _id }, '_id name email isAdmin');

    return res.render('editquestion.ejs', { findUser, findQuestion });
  } catch (e) {
    next(e);
  }
};

module.exports = { isUserLoggedIn, createQuiz, createQuestion };
