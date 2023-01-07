$(document).ready(function () {
  const socket = io('http://localhost:3000');

  // function appendUser(user) {
  //   $('#lobby-container').append(
  //     `<a href="/api/lobby/remove/` +
  //       user +
  //       `" class="border border-2 text-secondary border-secondary rounded p-3 fs-5 m-2 remove-user" style="text-decoration: none">` +
  //       user +
  //       `</a>`
  //   );
  // }

  // socket.on('updatePlayerLobby', (data) => {
  //   for (var i = 0; i < data.length; i++) {
  //     appendUser(data[i].name);
  //   }
  // });
});
