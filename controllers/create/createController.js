const { Users, Questions, Reports } = require('../../models');

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

    if (!findUser.isAdmin) return res.redirect('/home');

    const question = await Questions.create({
      user_id: _id,
      title,
      description,
    });

    return res.redirect('/quiz/' + question._id);
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

    if (!findUser.isAdmin) return res.redirect('/home');

    return res.render('questionsview.ejs', { findUser, findQuestion });
  } catch (e) {
    next(e);
  }
};

const editQuestion = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const arrayNum = req.params.arr;
    const question_id = req.params.id;
    const _id = req.session.user_id;

    const findQuestion = await Questions.findOne(
      { _id: question_id },
      '_id title description questions'
    );

    const findUser = await Users.findOne({ _id }, '_id name email isAdmin');

    if (!findUser.isAdmin) return res.redirect('/home');

    return res.render('editquestion.ejs', {
      findUser,
      findQuestion,
      arr: arrayNum,
    });
  } catch (e) {
    next(e);
  }
};

const updateQuestion = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');
    const date = new Date();

    const _id = req.session.user_id;

    const findUser = await Users.findById({ _id }, '_id isAdmin');

    if (!findUser.isAdmin) return res.redirect('/home');

    const arrayNum = req.params.arr;
    const arr = arrayNum - 1;
    const question_id = req.params.id;

    const { text, level, type, answer, choice1, choice2, choice3, choice4 } =
      req.body;

    const findQuestion = await Questions.findById(
      { _id: question_id },
      'questions updatedAt'
    );

    findQuestion.questions[arr].question = {
      text,
      level,
      type,
      answer,
      choices: [choice1, choice2, choice3, choice4],
    };

    findQuestion.updatedAt = date;

    findQuestion.markModified('questions');
    await findQuestion.save();

    console.log(findQuestion.questions[arr]);
    return res.redirect('/quiz/' + question_id);
  } catch (e) {
    next(e);
  }
};

const questionDelete = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const _id = req.session.user_id;

    const findUser = await Users.findById({ _id }, '_id isAdmin');

    if (!findUser.isAdmin) return res.redirect('/home');

    const arrayNum = req.params.arr;
    const arr = arrayNum - 1;
    const question_id = req.params.id;

    const findQuestion = await Questions.findById(
      { _id: question_id },
      'questions updatedAt'
    );

    findQuestion.questions = findQuestion.questions.filter(
      (q, index) => index != arr
    );

    findQuestion.markModified('questions');
    await findQuestion.save();

    return res.redirect('/quiz/' + question_id);
  } catch (e) {
    next(e);
  }
};

const fetchQuestion = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const _id = req.session.user_id;

    const findUser = await Users.findById({ _id }, '_id isAdmin');

    if (!findUser.isAdmin) return res.redirect('/home');

    const question_id = req.params.id;

    return res.render('addquestion.ejs', { question_id: question_id });
  } catch (e) {
    next(e);
  }
};

const addQuestion = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');
    const date = new Date();

    const _id = req.session.user_id;

    const findUser = await Users.findById({ _id }, '_id isAdmin');

    if (!findUser.isAdmin) return res.redirect('/home');

    const question_id = req.params.id;

    const { text, level, type, answer, choice1, choice2, choice3, choice4 } =
      req.body;

    const obj = { text, level, answer, choice1, choice2, choice3, choice4 };

    const findQuestion = await Questions.findById(
      { _id: question_id },
      'questions updatedAt'
    );

    findQuestion.questions[findQuestion.questions.length] = {
      question: {
        text,
        level,
        type,
        answer,
        choices: [choice1, choice2, choice3, choice4],
      },
    };

    findQuestion.updatedAt = date;

    findQuestion.markModified('questions');
    await findQuestion.save();

    return res.redirect('/quiz/' + question_id);
  } catch (e) {
    next(e);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const _id = req.session.user_id;

    const findUser = await Users.findById({ _id }, '_id isAdmin');

    if (!findUser.isAdmin) return res.redirect('/home');

    const question_id = req.params.id;

    await Questions.deleteOne({ _id: question_id });

    return res.redirect('/dashboard');
  } catch (e) {
    next(e);
  }
};

const createLobby = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');
    const date = new Date();

    const _id = req.session.user_id;

    const findUser = await Users.findById({ _id }, '_id isAdmin');

    const question_id = req.params.id;
    var pin = Math.floor(100000 + Math.random() * 999999);

    const findQuestion = await Questions.findById(
      { _id: question_id },
      '_id title questions isStarted inLobby pin'
    );

    if (findQuestion.inLobby)
      return res.render('lobby.ejs', {
        findQuestion,
        findUser,
        uName: '',
        pin: '',
      });

    findQuestion.updatedAt = date;
    findQuestion.inLobby = true;
    findQuestion.pin = pin;
    await findQuestion.save();

    return res.render('lobby.ejs', {
      findQuestion,
      findUser,
      uName: '',
      pin: '',
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  isUserLoggedIn,
  createQuiz,
  createQuestion,
  editQuestion,
  updateQuestion,
  questionDelete,
  fetchQuestion,
  addQuestion,
  deleteQuestion,
  createLobby,
};
