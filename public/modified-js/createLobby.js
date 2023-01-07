$(document).ready(function () {
  const socket = io('http://localhost:3000');

  socket.on('connect', function () {
    socket.emit('create-lobby', id);
  });

  socket.on('hostDisconnect', function () {
    window.location.href = '/';
  });

  socket.on('updatePlayerLobby', (data) => {
    $('.remove-user').remove();
    for (var i = 0; i < data.length; i++) {
      appendUser(data[i].name, data[i].playerId);
    }
  });

  function appendUser(user, id) {
    $('#lobby-container').append(
      `<a class="border border-2 text-secondary border-secondary rounded p-3 fs-5 m-2 remove-user"
      id="remove"
          style="text-decoration: none"
          data-player-id="` +
        id +
        `" >` +
        user +
        `</a>`
    );
  }

  // not - working
  // $('#remove').click(function () {
  //   alert('clicked');
  // });

  // function removeUser(id) {
  //   console.log(id);
  //   var player_id = id.getAttribute('data-player-id');
  //   socket.emit('remove-user', player_id);
  // }
});
