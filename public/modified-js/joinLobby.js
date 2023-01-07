$(document).ready(function () {
  const socket = io('http://localhost:3000');

  socket.emit('player-join', { uName, pin, user_id, id });

  socket.on('hostDisconnect', function () {
    window.location.href = '/';
  });

  // not - working
  // socket.on('user-removed', function () {
  //   window.location.href = '/';
  // });
});
