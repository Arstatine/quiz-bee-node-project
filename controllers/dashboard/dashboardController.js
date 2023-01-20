const { Users, Questions } = require('../../models');

const isUserLoggedIn = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const _id = req.session.user_id;

    const findUser = await Users.findOne(
      { _id },
      '_id name email isAdmin avatar'
    );

    if (!findUser.isAdmin) return res.redirect('/home');

    if (!req.query.search) {
      const findQuestion = await Questions.find(
        { user_id: _id },
        '_id user_id title description'
      ).sort({ createdAt: -1 });

      return res.render('dashboard.ejs', { findUser, findQuestion });
    }

    let key = req.query.search;

    const findQuestion = await Questions.find(
      {
        $and: [
          { user_id: _id },
          {
            $or: [
              {
                title: { $regex: key.toString(), $options: 'i' },
              },
              {
                description: { $regex: key.toString(), $options: 'i' },
              },
            ],
          },
        ],
      },
      '_id user_id title description'
    ).sort({ createdAt: -1 });

    return res.render('dashboard.ejs', { findUser, findQuestion });
  } catch (error) {
    next(error);
  }
};

module.exports = { isUserLoggedIn };
