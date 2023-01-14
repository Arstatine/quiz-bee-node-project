// pin = pin
// hostId = socket.id
// gameLive = bool
// gameData = { playersAnswered = number of player submitted, questionLive=bool, gameid=room_id/question_id, questionlength }

class LiveGames {
  constructor() {
    this.games = [];
  }
  addGame(pin, hostId, gameLive, gameData) {
    var game = { pin, hostId, gameLive, gameData };
    this.games.push(game);
    return game;
  }
  removeGame(hostId) {
    var game = this.getGame(hostId);

    if (game) {
      this.games = this.games.filter((game) => game.hostId !== hostId);
    }
    return game;
  }

  removeGameBased(hostId) {
    var game = this.validateGame(hostId);

    if (game) {
      this.games = this.games.filter((game) => game.gameData.gameid !== hostId);
    }
    return game;
  }

  getGame(hostId) {
    return this.games.filter((game) => game.hostId === hostId)[0];
  }
  validateGame(hostId) {
    return this.games.filter((game) => game.gameData.gameid === hostId)[0];
  }
}

module.exports = { LiveGames };
