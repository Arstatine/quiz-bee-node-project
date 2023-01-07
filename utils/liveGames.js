class LiveGames {
  constructor() {
    this.games = [];
  }
  addGame(socketId, pin, hostId, gameLive, gameData) {
    var game = { socketId, pin, hostId, gameLive, gameData };
    this.games.push(game);
    return game;
  }
  removeGame(socketId) {
    var game = this.getGame(socketId);

    if (game) {
      this.games = this.games.filter((game) => game.socketId !== socketId);
    }
    return game;
  }
  getGame(socketId) {
    return this.games.filter((game) => game.socketId === socketId)[0];
  }
  validateGame(hostId) {
    return this.games.filter((game) => game.gameData.gameid === hostId)[0];
  }
  checkGame(hostId) {
    return this.games.filter((game) => game.hostId === hostId)[0];
  }
}

module.exports = { LiveGames };
