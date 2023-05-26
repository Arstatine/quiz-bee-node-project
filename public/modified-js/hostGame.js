const socket = io('http://localhost:3000');

// update timer
function updateTimer(timeLevel) {
  document.getElementById('time-count').textContent = parseInt(timeLevel);
  time = parseInt(timeLevel);
  timer = setInterval(function () {
    time -= 1;
    document.getElementById('time-count').textContent = time;
    if (time == 0) {
      socket.emit('time-up', id);
      clearInterval(timer);
      document.getElementById('time-count').textContent = "Time's Up";
      return;
    }
  }, 1000);
}

//show leaderboard to players
function showLeaderboard() {
  $(document).ready(function () {
    //remove other content except times up
    $('#remove-leaderboard').remove();
    $('.remove-correct-answer').remove();
    $('.remove-question-text').remove();
    $('.remove-question-level').text('Leaderboards');
    socket.emit('show-leaderboards', id);
    appendNextRoundBtn();
  });
}

// append button for next
function appendNextRoundBtn() {
  $(document).ready(function () {
    $('#next-round-btn').append(`
    <button
      class="fixed-bottom2 m-3 bg-light w-auto p-3 d-flex justify-content-between align-items-center rounded"
      onclick="nextRound()"
      id="remove-next"
      style="font-weight: bold; font-size: 1.5rem; border: none !important"
    >
    Next Round
    </button>
  `);
  });
}

// call next round
function nextRound() {
  socket.emit('next-round', id);
}

$(document).ready(function () {
  socket.on('connect', () => {
    socket.emit('host-join-game', id, user_id);
  });

  // tie breaker
  socket.on('question-tie', (data) => {
    $('.remove-correct-answer').remove();
    $('.remove-question-text').remove();
    $('.remove-question-level').remove();
    $('.remove-table').remove();
    $('#remove-next').remove();

    if (data.tie) {
      appendTie();
    }

    updateTimer(3);

    appendText(data.text);
    appendLevel(data.level, data.points);

    setTimeout(() => {
      clearInterval(timer);
      if (data.img != null) {
        appendImg(data.img);
      }
      appendPlayTimer();
      updateTimer(data.timer);

      if (data.type === 'trueFalse') {
        appendTrueFalse();
      } else if (data.type === 'multipleChoice') {
        appendChoices(data.choices);
      } else {
        appendIdentification();
      }
    }, 2900);
  });

  // if question == 0
  socket.on('game-over', (leaderboard) => {
    appendWinner();
    document.getElementById('time-count').textContent = 'Game Over';
    $('#remove-leaderboard').remove();
    $('.remove-correct-answer').remove();
    $('.remove-question-text').remove();
    $('.remove-question-level').remove();
    $('.remove-table').remove();
    $('#remove-next').remove();

    $('#text-id').append(
      `<h1 class="text-center fw-bold text-light">TOP PLAYER</h1>`
    );

    leaderboard.sort(function (a, b) {
      return b.score - a.score;
    });

    if (leaderboard.length >= 3) {
      appendFinalLeaderboard(leaderboard, 3);
    } else if (leaderboard.length == 2) {
      appendFinalLeaderboard(leaderboard, 2);
    } else if (leaderboard.length == 1) {
      appendFinalLeaderboard(leaderboard, 1);
    }

    $('#remove-leaderboard').remove();
  });

  // if question already answered
  socket.on('hands-up-host', (data) => {
    $('.remove-correct-answer').remove();
    $('.remove-img').remove();
    $('.remove-answered-class').remove();
    $('.remove-audio-timer').remove();

    clearInterval(timer);
    document.getElementById('time-count').textContent = "Time's Up";
    appendCorrectAnswer(data.correctAnswer);

    setTimeout(function () {
      socket.emit('update-score-get-score', id);
    }, 1000);

    appendLeaderboard();
  });

  // show leaderboards
  socket.on('show-leaderboard-list', (leaderboard) => {
    leaderboard.sort(function (a, b) {
      return b.score - a.score;
    });

    if (leaderboard.length >= 5) {
      appendTopLeaderboard(leaderboard, 3);
    } else if (leaderboard.length == 4) {
      appendTopLeaderboard(leaderboard, 3);
    } else if (leaderboard.length == 3) {
      appendTopLeaderboard(leaderboard, 3);
    } else if (leaderboard.length == 2) {
      appendTopLeaderboard(leaderboard, 2);
    } else if (leaderboard.length == 1) {
      appendTopLeaderboard(leaderboard, 1);
    }
  });

  // fetch next question
  socket.on('next-question-to-host', (data) => {
    $('.remove-question-text').remove();
    $('#remove-leaderboard').remove();
    $('.remove-correct-answer').remove();
    $('.remove-question-text').remove();
    $('.remove-question-level').remove();
    $('.remove-table').remove();
    $('#remove-next').remove();

    updateTimer(3);
    appendText(data.text);
    appendLevel(data.level, data.points);

    setTimeout(() => {
      clearInterval(timer);

      if (data.img != null) {
        appendImg(data.img);
      }
      appendPlayTimer();

      updateTimer(data.timer);

      if (data.type === 'trueFalse') {
        appendTrueFalse();
      } else if (data.type === 'multipleChoice') {
        appendChoices(data.choices);
      } else {
        appendIdentification();
      }
    }, 2900);
  });

  // get first question
  socket.on('question-to-host', (data) => {
    updateTimer(3);

    appendText(data.text);
    appendLevel(data.level, data.points);

    setTimeout(() => {
      clearInterval(timer);
      if (data.img != null) {
        appendImg(data.img);
      }
      appendPlayTimer();
      updateTimer(data.timer);

      if (data.type === 'trueFalse') {
        appendTrueFalse();
      } else if (data.type === 'multipleChoice') {
        appendChoices(data.choices);
      } else {
        appendIdentification();
      }
    }, 2900);
  });

  //add tie
  function appendTie() {
    $('#tie-id').append(
      `<p
          class="text-light py-3 px-5 w-50 mt-5 text-level remove-question-level"
          style="
            font-size: 1.75rem;
            font-weight: bolder;
            background-color: #ddd;
            color: #222 !important;
          "
        >Tie Breaker</p>
        `
    );
  }

  //add image
  function appendImg(url) {
    $('#img-id').append(
      `<img src="../../uploads/` +
        url +
        `" alt="" class="img-fluid remove-img" />`
    );
  }

  //add music winner
  function appendWinner() {
    $('#play-timer').append(`
    <audio class="remove-audio-timer" preload="auto" autoplay>
    <source src="../../assets/winner.mp3" type="audio/mpeg" />
    Your browser does not support the audio tag.
  </audio
  `);
  }

  //add music timer
  function appendPlayTimer() {
    $(
      '#play-timer'
    ).append(`<audio class="remove-audio-timer" preload="auto" autoplay loop>
    <source src="../../assets/bg.mp3" type="audio/mpeg" />
    Your browser does not support the audio tag.
  </audio`);
  }

  // append final leaderboard
  function appendFinalLeaderboard(data, num) {
    var count = 0;

    for (let a = 0; a < num; a++) {
      count = a + 1;

      if (data[a].score != 0) {
        $('#top-leaderboards').append(
          `
          <div class="container2 mb-5 remove-top-leaderboard">
          <div class="avatar">
              <img
                class="top-img"
                src="https://avatars.dicebear.com/api/bottts/` +
            data[a].name +
            `.svg"
              />
          </div>
          <h1 class="name-text">` +
            data[a].name +
            `</h1>
          <h2 class="label-name">Top ` +
            count +
            `</h2>
        </div>`
        );
      }
    }

    $('#top-leaderboards').append(
      `
      <a href="/reports" class="btn btn-danger fw-bold text-light btn-lg py-3 px-5 rounded-0 ">EXIT</a>
    `
    );
  }

  // append leaderboard button
  function appendLeaderboard() {
    $('#leaderboard-id').append(`
    <button
      class="fixed-bottom2 m-3 bg-light w-auto p-3 d-flex justify-content-between align-items-center rounded"
      onclick="showLeaderboard()"
      id="remove-leaderboard"
      style="font-weight: bold; font-size: 1.5rem; border: none !important"
    >
    Leaderboard
    </button>
  `);
  }

  // append leaderboards
  function appendTopLeaderboard(data, num) {
    var str = '';
    var count = 0;

    for (let a = 0; a < num; a++) {
      count = a + 1;
      str =
        str +
        `
      <tr>
        <th scope="row" class="p-4">` +
        count +
        `</th>
        <td class="p-4">` +
        data[a].name +
        `</td>
        <td class="p-4">` +
        data[a].score +
        `</td>
      </tr>
      `;
    }

    $('#leaderboard-table-id').append(
      `
      <table class="table bg-light table-striped remove-table">
      <thead>
        <tr>
          <th scope="col" class="p-4">Rank No.</th>
          <th scope="col" class="p-4">Player Name</th>
          <th scope="col" class="p-4">Player Score</th>
        </tr>
      </thead>
      <tbody>
      ` +
        str +
        `
      </tbody>
    </table>
    `
    );
  }

  // append correct answer
  function appendCorrectAnswer(answer) {
    var first = answer.charAt(0).toUpperCase();
    var last = answer.substring(1);

    $('#correct-answer-id').append(
      `
      <div class="mt-5 remove-correct-answer">
        <h4 class="text-light text-center" style="font-size: 2.5rem">Correct Answer:</h4>
        <p
          class="text-center text-success text-question my-5"
          style="font-size: 4rem; font-weight: bolder"
        >
        ` +
        first +
        last +
        `
        </p>
      </div>
      `
    );
  }

  // append question
  function appendText(text) {
    $('#text-id').append(
      `<p
    class="text-center text-light text-question my-5 remove-question-text"
    style="font-size: 2.5rem; font-weight: bolder"
  >` +
        text +
        `</p>`
    );
  }

  // append true or false type
  function appendTrueFalse() {
    $('#tof-id').append(
      `
      <div class="outer-fit-this remove-answered-class">
          <input
          type="radio"
          class="btn-check type"
          name="answer"
          id="optionTrue"
          readonly
          value="true"
          required
          />
          <label class="btn btn-primary btn-lg p-5 m-2 rounded fit-this" for="optionTrue"
          >True</label
          >
          <input
          type="radio"
          class="btn-check type"
          name="answer"
          readonly
          value="false"
          id="optionFalse"
          required
          />
          <label class="btn btn-danger btn-lg p-5 m-2 rounded fit-this" for="optionFalse"
          >False</label
          >`
    );
  }

  // append multiple choices type
  function appendChoices(data) {
    $('#choices-id').append(
      `
    <div class="outer-fit-this remove-answered-class">
        <input
        type="radio"
        class="btn-check type"
        name="answer"
        id="option1"
        readonly
        value="` +
        data[0] +
        `"
        required
        />
        <label class="btn btn-success btn-lg p-5 m-2 rounded fit-this" for="option1"
        >` +
        data[0] +
        `</label
        >
        <input
        type="radio"
        class="btn-check type"
        name="answer"
        id="option2"
        readonly
        value="` +
        data[1] +
        `"
        required
        />
        <label class="btn btn-danger btn-lg p-5 m-2 rounded fit-this" for="option2"
        >` +
        data[1] +
        `</label
        >
        <input
        type="radio"
        class="btn-check type"
        name="answer"
        id="option3"
        readonly
        value="` +
        data[2] +
        `"
        required
        />
        <label class="btn btn-warning btn-lg p-5 m-2 rounded fit-this" for="option3"
        >` +
        data[2] +
        `</label
        >
        <input
        type="radio"
        class="btn-check type"
        name="answer"
        id="option4"
        readonly
        value="` +
        data[3] +
        `"
        required
        />
        <label class="btn btn-primary btn-lg p-5 m-2 rounded fit-this" for="option4"
        >` +
        data[3] +
        `</label
        >
    </div>
    `
    );
  }

  // append identification type
  function appendIdentification() {
    $('#identification-id').append(`
    <input
        type="text"
        class="p-4 rounded fs-4 w-75 remove-answered-class text-light"
        name="answer"
        id="identifyAnswer"
        placeholder="Enter your answer"
        required
        disabled
    />
    <br />
    <button
        class="btn btn-primary px-5 py-3 fs-4 mt-4 remove-answered-class"
        style="font-weight: bold"
        disabled
    >
        SUBMIT
    </button>`);
  }

  // append level of question
  function appendLevel(level, points) {
    if (level === 'easy') {
      $('#level-id').append(
        `<p
            class="text-light py-3 px-5 w-50 text-level remove-question-level"
            style="
              font-size: 1.75rem;
              font-weight: bolder;
              background-color: #61b754;
            "
          >
            Easy &nbsp;+` +
          points +
          `
          </p>
          `
      );
    } else if (level === 'average') {
      $('#level-id').append(
        `<p
          class="text-light py-3 px-5 w-50 text-level remove-question-level"
          style="
            font-size: 1.75rem;
            font-weight: bolder;
            background-color: #ff940a;
          "
        >
          Average &nbsp;+` +
          points +
          `
        </p>
          `
      );
    } else {
      $('#level-id').append(
        `
          <p
            class="text-light py-3 px-5 w-50 text-level remove-question-level"
            style="
              font-size: 1.75rem;
              font-weight: bolder;
              background-color: #ec5051;
            "
          >
            Difficult &nbsp;+` +
          points +
          `
          </p>`
      );
    }
  }

  //if not authorized
  socket.on('unauthorized-host', function () {
    window.location = '/dashboard';
  });

  // reload new lobby if no player
  socket.on('host-get-player', (id) => {
    window.location = '/host/' + id;
  });

  //if no question
  socket.on('host-add-question', (id) => {
    window.location = '/quiz/' + id;
  });

  //on disconnect
  socket.on('host-disconnect', function () {
    window.location.href = '/';
  });
});
