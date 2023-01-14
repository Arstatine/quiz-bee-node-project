const socket = io('http://localhost:3000');

function removeUser(id) {
  socket.emit('remove-user', id);
}

$(document).ready(function () {
  socket.on('connect', function () {
    socket.emit('create-lobby', id);
  });

  socket.on('host-disconnect', function () {
    window.location.href = '/';
  });

  socket.on('update-player-lobby', (data) => {
    $('#player-count').html(
      `<ion-icon name="person"></ion-icon>&nbsp;` + data.length
    );

    $('.remove-user').remove();
    for (var i = 0; i < data.length; i++) {
      appendUser(data[i].name, data[i].playerId);
    }
  });

  function appendUser(user, id) {
    $('#lobby-container').append(
      `<a class="border border-2 text-secondary border-secondary rounded p-3 fs-5 m-2 remove-user"
          onclick="removeUser('` +
        id +
        `')"
          style="text-decoration: none">` +
        user +
        `</a>`
    );
  }

  $('#start-btn').click(function () {
    socket.emit('redirect-player', id);
  });

  // not - working
  // $('#remove').click(function () {
  //   alert('clicked');
  // });
});
