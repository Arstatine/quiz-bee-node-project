const { Users, Questions, Reports } = require('../../models');
const ExcelJS = require('exceljs');

const isUserLoggedIn = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const _id = req.session.user_id;

    const findUser = await Users.findById(
      { _id },
      '_id name email isAdmin avatar'
    );

    if (!findUser.isAdmin) return res.redirect('/home');

    const findReport = await Reports.find(
      { user_id: _id },
      '_id question_text question_description createdAt socket_id'
    ).sort({ createdAt: -1 });

    return res.render('reports.ejs', { findUser, findReport });
  } catch (error) {
    next(error);
  }
};

const downloadReport = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const _id = req.session.user_id;
    const report_socket = req.params.id;

    const findUser = await Users.findById({ _id }, '_id name email isAdmin');

    if (!findUser.isAdmin) return res.redirect('/home');

    const findReport = await Reports.findOne({ socket_id: report_socket });

    if (!findReport) return res.redirect('/home');

    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet('Quiz Report');
    let worksheet2 = workbook.addWorksheet('Quiz Summary');

    worksheet.columns = [
      {
        header: 'Question',
        key: 'question',
        width: 25,
      },
      {
        header: 'Type',
        key: 'type',
        width: 25,
      },
      {
        header: 'Level',
        key: 'level',
        width: 25,
      },
      {
        header: 'Answer',
        key: 'answer',
        width: 25,
      },
      {
        header: 'Correct Answer',
        key: 'correct',
        width: 25,
      },
      {
        header: 'Points',
        key: 'points',
        width: 25,
      },
    ];

    worksheet2.columns = [
      {
        header: 'Rank No.',
        key: 'rank',
        width: 25,
      },
      {
        header: 'Player Name',
        key: 'player',
        width: 25,
      },
      {
        header: 'Total Score',
        key: 'total',
        width: 25,
      },
    ];

    worksheet.addRow('');

    findReport.players.forEach((row) => {
      worksheet.addRow({
        question: 'Player Name: ' + row.player_name,
      });

      var count = 1;
      row.question.forEach((row1) => {
        worksheet.addRow({
          question: 'Q' + count + '. ' + row1.question_text,
          type: row1.question_type,
          level: row1.question_level,
          answer: row1.answer,
          correct: row1.correctAnswer,
          points: row1.points,
        });
        count++;
      });
      worksheet.addRow('');
    });

    let arrData = findReport.players;

    arrData.sort(function (a, b) {
      return b.total_score - a.total_score;
    });

    var rn = 1;
    arrData.forEach((row) => {
      worksheet2.addRow({
        rank: rn,
        player: row.player_name,
        total: row.total_score,
      });
      rn++;
    });

    let createdDate = findReport.createdAt;
    let year = createdDate.getFullYear();
    let month = createdDate.getMonth() + 1;
    let dt = createdDate.getDate();
    let hours = createdDate.getHours();
    let minute = createdDate.getMinutes();
    let secs = createdDate.getSeconds();

    let date =
      month + '-' + dt + '-' + year + '_' + hours + '-' + minute + '-' + secs;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;  charset=utf-8'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment;filename=' + findReport.question_text + '_' + date + '.xlsx'
    );

    return workbook.xlsx.write(res).then(function (ress) {
      res.end();
    });
  } catch (error) {
    next(error);
  }
};

const deleteReport = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.redirect('/login');

    const _id = req.session.user_id;

    const findUser = await Users.findById({ _id }, '_id isAdmin');

    if (!findUser.isAdmin) return res.redirect('/home');

    const report_id = req.params.id;

    await Reports.deleteOne({ socket_id: report_id });

    return res.redirect('/reports');
  } catch (e) {
    next(e);
  }
};

module.exports = { isUserLoggedIn, downloadReport, deleteReport };
