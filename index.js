const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// socket.io
const socketIO = require('socket.io');
const io = socketIO(httpServer);

// mongo db
require('./config/db');

// access port
const PORT = process.env.PORT || 3000;

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

var games = new LiveGames();
var players = new Players();

// socket.io
io.on('connection', (socket) => {
  Reports.find().then((result) => {
    socket.emit('player-list', result);
  });

  socket.on('create-lobby', (room_id) => {
    Questions.findById({ _id: room_id }).then((result) => {
      if (result != undefined) {
        games.addGame(socket.id, result.pin, result._id, false, {
          playersAnswered: 0,
          questionLive: false,
          gameid: room_id,
          question: 1,
        });

        socket.join(room_id);
      }
    });
  });

  socket.on('player-join', (data) => {
    var gameFound = false;
    for (var i = 0; i < games.games.length; i++) {
      if (data.pin == games.games[i].pin) {
        var hostId = games.games[i].hostId;

        var playerInGame = players.checkPlayer(data.user_id);

        if (playerInGame != null) return;

        players.addPlayer(socket.id, data.id, data.user_id, data.uName, {
          score: 0,
          answer: 0,
        });

        socket.join(data.id);

        var playersInGame = players.getPlayers(data.id);

        if (playersInGame) {
          io.to(data.id).emit('updatePlayerLobby', playersInGame);
        }
        gameFound = true;
      }
    }
  });

  // not - working
  // socket.on('remove-user', (id) => {
  //   var player = players.checkPlayer(id);

  //   if (player) {
  //     var hostId = player.hostId;
  //     var game = games.validateGame(hostId);
  //     var socketId = player.socketId;

  //     if (game.gameLive == false) {
  //       players.removePlayer(socketId);
  //       var playersInGame = players.getPlayers(hostId);

  //       io.to(game.gameData.gameid)
  //         .emit('updatePlayerLobby', playersInGame)
  //         .emit('user-removed');
  //       socket.leave(game.gameData.gameid);
  //     }
  //   }
  // });

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

        io.to(game.gameData.gameid).emit('hostDisconnect');
        socket.leave(game.gameData.gameid);
      }
    } else {
      var player = players.getPlayer(socket.id);

      if (player) {
        var hostId = player.hostId;
        var game = games.validateGame(hostId);

        if (game.gameLive == false) {
          players.removePlayer(socket.id);
          var playersInGame = players.getPlayers(hostId);

          io.to(game.gameData.gameid).emit('updatePlayerLobby', playersInGame);
          socket.leave(game.gameData.gameid);
        }
      }
    }
  });
});
