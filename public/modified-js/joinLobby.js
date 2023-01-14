$(document).ready(function () {
  const socket = io('http://localhost:3000');

  socket.emit('player-join', { uName, pin, user_id, id });

  socket.on('host-disconnect', function () {
    window.location.href = '/';
  });

  socket.on('game-started-player', (id) => {
    window.location = '/player/game/' + id;
  });

  //not - working
  socket.on('user-removed', function () {
    window.location = '/';
  });
});
