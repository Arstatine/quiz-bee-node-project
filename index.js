const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const fileupload = require('express-fileupload');
require('dotenv').config();

// socket.io
const socketIO = require('socket.io');
const io = socketIO(httpServer);

// mongo db
require('./config/db');

// access port
const PORT = process.env.PORT || 3000;

// use express-fileupload
app.use(fileupload());

// built-in middleware (express json)
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join('node_modules', 'bootstrap', 'dist')));

// setting ejs as view-engine
app.set('view-engine', 'ejs');

// cookie and body parser middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// routers
const indexRouter = require('./routes');
app.use('/', indexRouter);

// server running
httpServer.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

//
const { Users, Questions, Reports } = require('./models');
const { LiveGames } = require('./utils/liveGames');
const { Players } = require('./utils/players');
const e = require('express');

var games = new LiveGames();
var players = new Players();

// socket.io
io.on('connection', (socket) => {
  socket.on('create-lobby', (room_id) => {
    Questions.findById({ _id: room_id }).then((result) => {
      if (result != undefined) {
        games.addGame(result.pin, socket.id, false, {
          playersAnswered: 0,
          questionLive: false,
          gameid: room_id,
          question: 1,
          isStarted: false,
        });

        socket.join(room_id);
      }
    });
  });

  // player join the quiz
  socket.on('player-join', (data) => {
    for (var i = 0; i < games.games.length; i++) {
      if (data.pin == games.games[i].pin) {
        var hostId = games.games[i].hostId;

        var playerInGame = players.checkPlayer(data.user_id);

        if (playerInGame != null) return;

        players.addPlayer(
          hostId,
          socket.id,
          data.id,
          data.user_id,
          data.uName,
          {
            inGame: false,
          }
        );

        socket.join(data.id);

        var playersInGame = players.getPlayers(data.id);

        if (playersInGame) {
          io.to(data.id).emit('update-player-lobby', playersInGame);
        }
      }
    }
  });

  // redirect all players
  socket.on('redirect-player', (id) => {
    var game = games.getGame(socket.id);
    game.gameLive = true;
    io.to(game.gameData.gameid).emit(
      'game-started-player',
      game.gameData.gameid
    );
  });

  // host click the next roun button
  socket.on('next-round', (id) => {
    var playerData = players.getPlayers(id);
    var game = games.validateGame(id);
    game.gameData.questionLive = true;
    game.gameData.question += 1;
    var gameQuestion = game.gameData.question;

    if (playerData.length == 0) {
      games.removeGameBased(id);
      io.to(game.gameData.gameid).emit('host-disconnect');
      socket.leave(game.gameData.gameid);
    }

    Questions.findOne({ _id: id }).then((result) => {
      if (result) {
        if (result.questions.length == 0)
          return io.to(game.gameData.gameid).emit('unauthorized-player');

        if (result.questions.length == gameQuestion - 1) {
          var leaderboard_list = [];
          Reports.findOne({ socket_id: game.hostId }).then((result) => {
            if (result) {
              for (var i = 0; i < result.players.length; i++) {
                total_score = 0;

                total_score = result.players[i].total_score;

                leaderboard_list[i] = {
                  name: result.players[i].player_name,
                  score: total_score,
                };
              }

              io.in(id).emit('game-over', leaderboard_list);

              game.gameLive = false;
              game.gameData.playersAnswered = 0;
              socket.leave(game.gameData.gameid);
              return;
            }
          });
        } else {
          var data = result.questions;
          io.in(id).emit('next-question-to-player', {
            text: data[gameQuestion - 1].question.text,
            points: data[gameQuestion - 1].question.points,
            timer: data[gameQuestion - 1].question.timer,
            level: data[gameQuestion - 1].question.level,
            img: data[gameQuestion - 1].question.img,
            type: data[gameQuestion - 1].question.type,
            choices: data[gameQuestion - 1].question.choices,
            playersInGame: playerData.length,
          });
          io.in(id).emit('next-question-to-host', {
            text: data[gameQuestion - 1].question.text,
            points: data[gameQuestion - 1].question.points,
            timer: data[gameQuestion - 1].question.timer,
            level: data[gameQuestion - 1].question.level,
            img: data[gameQuestion - 1].question.img,
            type: data[gameQuestion - 1].question.type,
            choices: data[gameQuestion - 1].question.choices,
            playersInGame: playerData.length,
          });
        }
      }
    });
  });

  // player starts the game
  socket.on('player-start', (data) => {
    const date = new Date();
    var playerData = players.getPlayers(data.id);
    var playerAuth = players.checkPlayer(data.user);
    var game = games.validateGame(data.id);
    var gameQuestion = game.gameData.question;

    if (!playerAuth) return socket.emit('host-disconnect');

    playerAuth.socketId = socket.id;
    socket.join(data.id);

    if (!playerAuth) return io.to(data.id).emit('unauthorized-player');

    Questions.findOne({ _id: data.id }).then((result) => {
      if (result) {
        if (result.questions.length == 0)
          return io.to(game.gameData.gameid).emit('unauthorized-player');

        var data = result.questions;
        socket.emit('question-to-player', {
          text: data[gameQuestion - 1].question.text,
          points: data[gameQuestion - 1].question.points,
          timer: data[gameQuestion - 1].question.timer,
          level: data[gameQuestion - 1].question.level,
          img: data[gameQuestion - 1].question.img,
          type: data[gameQuestion - 1].question.type,
          choices: data[gameQuestion - 1].question.choices,
          playersInGame: playerData.length,
        });
      }
    });

    setTimeout(function () {
      Reports.findOne({ socket_id: game.hostId }).then((result) => {
        if (result) {
          for (let a = 0; a < result.players.length; a++) {
            if (result.players[a].player_id == data.user) {
              result.players[a].player_socket = socket.id;

              result.updatedAt = date;
              result.markModified('players');
              result.save();
            }
          }
        }
      });
    }, 1000);
  });

  // if host starts the game
  socket.on('host-join-game', (id, user_id) => {
    const date = new Date();
    var game = games.validateGame(id);
    var playerList = players.getPlayers(id);

    if (!game) return socket.emit('host-disconnect');

    var gameQuestion = game.gameData.question;
    game.gameData.isStarted = true;

    var addPlayer = [];

    for (let i = 0; i < playerList.length; i++) {
      addPlayer[i] = {
        player_id: playerList[i].playerId,
        player_socket: playerList[i].socketId,
        player_name: playerList[i].name,
        total_score: 0,
        question: [],
      };
    }

    if (game) {
      game.hostId = socket.id;
      socket.join(id);

      Questions.findById({ _id: id }).then((result) => {
        if (result) {
          result.pin = null;
          result.inLobby = false;
          result.updatedAt = date;

          result.save();

          if (result.questions.length != 0) {
            Reports.create({
              user_id,
              question_id: id,
              question_text: result.title,
              question_description: result.description,
              socket_id: socket.id,
              players: addPlayer,
            });
          }
        }
      });

      if (playerList.length == 0) return io.to(id).emit('host-get-player', id);

      var playerData = players.getPlayers(id);

      for (var i = 0; i < Object.keys(players.players).length; i++) {
        if (players.players[i].hostId == id) {
          players.players[i].gameBased = socket.id;
          players.players[i].gameData.inGame = true;
        }
      }

      Questions.findOne({ _id: id }).then((result) => {
        if (result) {
          if (result.questions.length == 0) {
            game.gameLive = false;
            return io.to(id).emit('host-add-question', id);
          }

          var data = result.questions;
          socket.emit('question-to-host', {
            text: data[gameQuestion - 1].question.text,
            points: data[gameQuestion - 1].question.points,
            timer: data[gameQuestion - 1].question.timer,
            level: data[gameQuestion - 1].question.level,
            img: data[gameQuestion - 1].question.img,
            type: data[gameQuestion - 1].question.type,
            choices: data[gameQuestion - 1].question.choices,
            playersInGame: playerData.length,
          });
        }
      });

      game.gameData.questionLive = true;
    } else {
      socket.emit('unauthorized-host');
    }
  });

  // if player-answers the question
  socket.on('player-answer', (data) => {
    const date = new Date();
    var player = players.checkPlayer(data.user_id);
    var hostId = player.hostId;
    var playerNum = players.getPlayers(hostId);
    var game = games.validateGame(hostId);
    var gameQuestion = game.gameData.question;
    player.gameData.inGame = true;

    if (game.gameData.questionLive == true) {
      game.gameData.playersAnswered += 1;

      var gameid = game.gameData.gameid;

      Questions.findOne({ _id: gameid }).then((result) => {
        var res = result.questions;
        var text = res[gameQuestion - 1].question.text;
        var correctAnswer = res[gameQuestion - 1].question.answer;
        var level = res[gameQuestion - 1].question.level;
        var type = res[gameQuestion - 1].question.type;
        var score = res[gameQuestion - 1].question.points;
        var isCorrect = false;

        if (data.answer == correctAnswer) {
          isCorrect = true;

          Reports.findOne({ socket_id: game.hostId }).then((result) => {
            if (result) {
              for (let i = 0; i < result.players.length; i++) {
                if (result.players[i].player_id == data.user_id) {
                  result.players[i].total_score =
                    parseInt(score) + parseInt(result.players[i].total_score);
                  result.players[i].question[gameQuestion - 1] = {
                    question_text: text,
                    question_level: level,
                    question_type: type,
                    correctAnswer: correctAnswer,
                    answer: data.answer,
                    points: score,
                    isCorrect: isCorrect,
                  };
                } else {
                  result.players[i].question[gameQuestion - 1] = {
                    question_text: text,
                    question_level: level,
                    question_type: type,
                    correctAnswer: correctAnswer,
                    answer: '',
                    points: 0,
                    isCorrect: false,
                  };
                }
              }

              result.updatedAt = date;
              result.markModified('players');
              result.markModified('players.question');
              result.save();
            }
          });

          io.to(game.gameData.gameid).emit('hands-up-player', {
            game_id: game.gameData.gameid,
            user_id: data.user_id,
            correctAnswer: correctAnswer,
            isCorrect: isCorrect,
          });
          io.to(game.gameData.gameid).emit('hands-up-host', {
            game_id: game.gameData.gameid,
            user_id: data.user_id,
            correctAnswer: correctAnswer,
            isCorrect: isCorrect,
          });

          game.gameData.playersAnswered = 0;
          game.gameData.questionLive = false;
          return;
        } else {
          Reports.findOne({ socket_id: game.hostId }).then((result) => {
            if (result) {
              for (let i = 0; i < result.players.length; i++) {
                if (result.players[i].player_id == data.user_id) {
                  result.players[i].question[gameQuestion - 1] = {
                    question_text: text,
                    question_level: level,
                    question_type: type,
                    correctAnswer: correctAnswer,
                    answer: data.answer,
                    points: 0,
                    isCorrect: false,
                  };
                }
              }

              result.updatedAt = date;
              result.markModified('players');
              result.markModified('players.question');
              result.save();
            }
          });
        }

        if (game.gameData.playersAnswered == playerNum.length) {
          io.to(game.gameData.gameid).emit('hands-up-player', {
            game_id: game.gameData.gameid,
            user_id: null,
            correctAnswer: correctAnswer,
            isCorrect: false,
          });
          io.to(game.gameData.gameid).emit('hands-up-host', {
            game_id: game.gameData.gameid,
            user_id: null,
            correctAnswer: correctAnswer,
            isCorrect: false,
          });

          game.gameData.questionLive = false;
          game.gameData.playersAnswered = 0;
        }
      });
    }
  });

  // if the host time = 0
  socket.on('time-up', (id) => {
    const date = new Date();
    var game = games.validateGame(id);
    var gameQuestion = game.gameData.question;
    game.gameData.questionLive = false;

    Questions.findOne({ _id: id }).then((result) => {
      if (result) {
        var res = result.questions;
        var text = res[gameQuestion - 1].question.text;
        var correctAnswer = res[gameQuestion - 1].question.answer;
        var level = res[gameQuestion - 1].question.level;
        var type = res[gameQuestion - 1].question.type;

        Reports.findOne({ socket_id: game.hostId }).then((result) => {
          if (result) {
            for (let i = 0; i < result.players.length; i++) {
              result.players[i].question[gameQuestion - 1] = {
                question_text: text,
                question_level: level,
                question_type: type,
                correctAnswer: correctAnswer,
                answer: '',
                points: 0,
                isCorrect: false,
              };
            }

            result.updatedAt = date;
            result.markModified('players');
            result.markModified('players.question');
            result.save();
          }
        });

        io.to(game.gameData.gameid).emit('hands-up-player', {
          game_id: game.gameData.gameid,
          user_id: null,
          correctAnswer: correctAnswer,
          isCorrect: false,
        });
        io.to(game.gameData.gameid).emit('hands-up-host', {
          game_id: game.gameData.gameid,
          user_id: null,
          correctAnswer: correctAnswer,
          isCorrect: false,
        });
      }
    });
  });

  // show leaderboard for both player and host
  socket.on('show-leaderboards', (id) => {
    var game = games.validateGame(id);
    var total_score = 0;
    var leaderboard_list = [];

    Reports.findOne({ socket_id: game.hostId }).then((result) => {
      if (result) {
        for (var i = 0; i < result.players.length; i++) {
          total_score = 0;

          total_score = result.players[i].total_score;

          leaderboard_list[i] = {
            name: result.players[i].player_name,
            score: total_score,
          };
        }

        io.in(id).emit('show-leaderboard-list', leaderboard_list);
      }
    });
  });

  // update score and push to all player inside room
  socket.on('update-score-get-score', (id) => {
    var game = games.validateGame(id);
    var total_score = 0;

    Reports.findOne({ socket_id: game.hostId }).then((result) => {
      if (result) {
        for (var i = 0; i < result.players.length; i++) {
          total_score = 0;

          total_score = result.players[i].total_score;

          io.to(result.players[i].player_socket).emit(
            'update-player-score',
            total_score
          );
        }
      }
    });
  });

  // remove user in room by admin/game master
  socket.on('remove-user', (id) => {
    var player = players.checkPlayer(id);

    if (player) {
      var hostId = player.hostId;
      var game = games.validateGame(hostId);
      var socketId = player.socketId;

      if (game.gameLive == false) {
        var playersInGame = players.getPlayers(hostId);

        io.to(socketId).emit('user-removed');
        io.to(game.gameData.gameid).emit('update-player-lobby', playersInGame);
      }
    }
  });

  // on player/host disconnect
  socket.on('disconnect', () => {
    var game = games.getGame(socket.id);

    if (game) {
      if (game.gameLive == false) {
        games.removeGame(socket.id);

        var playersToRemove = players.getPlayers(game.gameData.gameid);

        for (var i = 0; i < playersToRemove.length; i++) {
          players.removePlayer(playersToRemove[i].socketId);
        }

        const date = new Date();

        Questions.findById({ _id: game.gameData.gameid }).then((result) => {
          result.pin = null;
          result.inLobby = false;
          result.updatedAt = date;

          result.save();
        });

        io.to(game.gameData.gameid).emit('host-disconnect');
        socket.leave(game.gameData.gameid);
      } else {
        if (game.gameData.isStarted) {
          games.removeGame(socket.id);

          var playersToRemove = players.getPlayers(game.gameData.gameid);

          for (var i = 0; i < playersToRemove.length; i++) {
            players.removePlayer(playersToRemove[i].socketId);
          }

          const date = new Date();

          Questions.findById({ _id: game.gameData.gameid }).then((result) => {
            result.pin = null;
            result.inLobby = false;
            result.updatedAt = date;

            result.save();
          });

          io.to(game.gameData.gameid).emit('host-disconnect');
          socket.leave(game.gameData.gameid);
        }
      }
    } else {
      var player = players.getPlayer(socket.id);

      if (player) {
        var hostId = player.hostId;
        var game = games.validateGame(hostId);

        if (game.gameLive == false) {
          players.removePlayer(socket.id);
          var playersInGame = players.getPlayers(hostId);

          io.to(game.gameData.gameid).emit(
            'update-player-lobby',
            playersInGame
          );
          socket.leave(game.gameData.gameid);
        } else {
          if (player.gameData.inGame) {
            players.removePlayer(socket.id);
            io.to(player.socketId).emit('host-disconnect');
            socket.leave(game.gameData.gameid);
          }
        }
      }
    }
  });
});
