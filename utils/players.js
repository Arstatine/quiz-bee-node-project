// gameBased = hostid/game socketid/game room
// socketId = socket.id
// hostId = questionid
// playerId = userid
// name = name
// gameData = some data

class Players {
  constructor() {
    this.players = [];
  }
  addPlayer(gameBased, socketId, hostId, playerId, name, gameData) {
    var player = { gameBased, socketId, hostId, playerId, name, gameData };
    this.players.push(player);
    return player;
  }
  removePlayer(socketId) {
    var player = this.getPlayer(socketId);

    if (player) {
      this.players = this.players.filter(
        (player) => player.socketId !== socketId
      );
    }
    return player;
  }
  getPlayer(socketId) {
    return this.players.filter((player) => player.socketId === socketId)[0];
  }
  checkPlayer(playerId) {
    return this.players.filter((player) => player.playerId === playerId)[0];
  }
  getPlayers(hostId) {
    return this.players.filter((player) => player.hostId === hostId);
  }
}

module.exports = { Players };
