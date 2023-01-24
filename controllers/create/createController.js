const { Users, Questions, Reports } = require('../../models');
const fs = require('fs');
var crypto = require('crypto');

const randomizeFeature = async (question_id) => {
  await Questions.findById({ _id: question_id }).then((result) => {
    if (result) {
      var easy = [];
      var average = [];
      var difficult = [];

      const randomize = (array) => {
        const newArray = [...array];

        newArray.reverse().forEach((item, index) => {
          const j = Math.floor(Math.random() * (index + 1));
          [newArray[index], newArray[j]] = [newArray[j], newArray[index]];
        });

        return newArray;
      };

      for (let i = 0; i < result.questions.length; i++) {
        if (result.questions[i].question.level === 'easy') {
          easy.push(result.questions[i]);
        } else if (result.questions[i].question.level === 'average') {
          average.push(result.questions[i]);
        } else {
          difficult.push(result.questions[i]);
        }
      }

      var newArrayList = [];
      easy = randomize(easy);
      average = randomize(average);
      difficult = randomize(difficult);

      for (let i = 0; i < easy.length; i++) {
        newArrayList.push(easy[i]);
      }

      for (let i = 0; i < average.length; i++) {
        newArrayList.push(average[i]);
      }

      for (let i = 0; i < difficult.length; i++) {
        newArrayList.push(difficult[i]);
      }

      result.questions = newArrayList;

      result.markModified('questions');
      result.save();
    }
  });
};

const isUserLoggedIn = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const _id = req.session.user_id;

    const findUser = await Users.findOne(
      { _id },
      '_id name email isAdmin avatar'
    );

    return res.render('create.ejs', { findUser });
  } catch (error) {
    next(error);
  }
};

const createQuiz = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const { title, description } = req.body;

    var desc = description.charAt(0).toUpperCase() + description.slice(1);

    const _id = req.session.user_id;

    const findUser = await Users.findOne(
      { _id },
      '_id name email isAdmin avatar'
    );

    if (!findUser.isAdmin) return res.redirect('/home');

    const question = await Questions.create({
      user_id: _id,
      title,
      description: desc,
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

    if (!question_id.match(/^[0-9a-fA-F]{24}$/))
      return res.redirect('/dashboard');

    const findQuestion = await Questions.findOne(
      { _id: question_id },
      '_id title description questions'
    );

    if (!findQuestion) return res.redirect('/dashboard');

    const findUser = await Users.findOne(
      { _id },
      '_id name email isAdmin avatar'
    );

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

    if (!question_id.match(/^[0-9a-fA-F]{24}$/))
      return res.redirect('/dashboard');

    const findQuestion = await Questions.findOne(
      { _id: question_id },
      '_id title description questions'
    );

    const findUser = await Users.findOne(
      { _id },
      '_id name email isAdmin avatar'
    );

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

    const findUser = await Users.findById({ _id }, '_id isAdmin avatar');

    if (!findUser.isAdmin) return res.redirect('/home');

    const arrayNum = req.params.arr;
    const arr = arrayNum - 1;
    const question_id = req.params.id;

    const {
      text,
      points,
      timer,
      level,
      type,
      answer,
      choice1,
      choice2,
      choice3,
      choice4,
    } = req.body;

    if (!question_id.match(/^[0-9a-fA-F]{24}$/))
      return res.redirect('/dashboard');

    const findQuestion = await Questions.findById(
      { _id: question_id },
      'questions updatedAt'
    );

    if (!findQuestion) return res.redirect('/dashboard');

    if (req.files) {
      var imgFile = req.files.file;
      var fileName =
        crypto.randomBytes(20).toString('hex') + '-' + imgFile.name;
      imgFile.mv('./public/uploads/' + fileName);
    } else {
      var fileName = findQuestion.questions[arr].question.img;
    }

    findQuestion.questions[arr].question = {
      text,
      points: parseInt(points),
      timer: parseInt(timer),
      level,
      img: fileName,
      type,
      answer,
      choices: [choice1, choice2, choice3, choice4],
    };

    findQuestion.updatedAt = date;

    findQuestion.markModified('questions');
    await findQuestion.save();

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

    if (!question_id.match(/^[0-9a-fA-F]{24}$/))
      return res.redirect('/dashboard');

    const findQuestion = await Questions.findById(
      { _id: question_id },
      'questions updatedAt'
    );

    if (!findQuestion) return res.redirect('/dashboard');

    fs.unlinkSync(
      './public/uploads/' + findQuestion.questions[arr].question.img
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

    const findUser = await Users.findById({ _id }, '_id isAdmin avatar');

    if (!findUser.isAdmin) return res.redirect('/home');

    const question_id = req.params.id;
    if (!question_id.match(/^[0-9a-fA-F]{24}$/))
      return res.redirect('/dashboard');

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

    const findUser = await Users.findById({ _id }, '_id isAdmin avatar');

    if (!findUser.isAdmin) return res.redirect('/home');

    const question_id = req.params.id;
    if (!question_id.match(/^[0-9a-fA-F]{24}$/))
      return res.redirect('/dashboard');

    const {
      text,
      points,
      timer,
      level,
      type,
      answer,
      choice1,
      choice2,
      choice3,
      choice4,
    } = req.body;

    const findQuestion = await Questions.findById(
      { _id: question_id },
      'questions updatedAt'
    );

    if (!findQuestion) return res.redirect('/dashboard');

    if (req.files) {
      var imgFile = req.files.file;
      var fileName =
        crypto.randomBytes(20).toString('hex') + '-' + imgFile.name;
      imgFile.mv('./public/uploads/' + fileName);
    }

    findQuestion.questions[findQuestion.questions.length] = {
      question: {
        text,
        points: parseInt(points),
        timer: parseInt(timer),
        level,
        img: fileName,
        type,
        answer,
        choices: [choice1, choice2, choice3, choice4],
      },
    };

    findQuestion.updatedAt = date;

    findQuestion.markModified('questions');
    await findQuestion.save();

    randomizeFeature(question_id);

    return res.redirect('/quiz/' + question_id);
  } catch (e) {
    next(e);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const _id = req.session.user_id;

    const findUser = await Users.findById({ _id }, '_id isAdmin avatar');

    if (!findUser.isAdmin) return res.redirect('/home');

    const question_id = req.params.id;
    if (!question_id.match(/^[0-9a-fA-F]{24}$/))
      return res.redirect('/dashboard');

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

    const findUser = await Users.findById({ _id }, '_id isAdmin avatar');

    if (!findUser.isAdmin) return res.redirect('/home');

    const question_id = req.params.id;
    var pin = Math.floor(100000 + Math.random() * 999999);

    if (!question_id.match(/^[0-9a-fA-F]{24}$/))
      return res.redirect('/dashboard');

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

const randomizeQuestion = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const _id = req.session.user_id;

    const findUser = await Users.findById({ _id }, '_id isAdmin');

    if (!findUser.isAdmin) return res.redirect('/home');

    const question_id = req.params.id;

    if (!question_id.match(/^[0-9a-fA-F]{24}$/)) return res.redirect('/home');

    randomizeFeature(question_id);

    return res.redirect('/quiz/' + question_id);
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
  randomizeQuestion,
};
