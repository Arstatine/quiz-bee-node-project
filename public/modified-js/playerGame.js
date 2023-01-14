const socket = io('http://localhost:3000');

var playerAnswered = false;
var correct = false;

// update timer
function updateTimer(timeLevel) {
  document.getElementById('time-count').textContent = parseInt(timeLevel);
  time = parseInt(timeLevel);
  timer = setInterval(function () {
    time -= 1;
    document.getElementById('time-count').textContent = time;
    if (time == 0) {
      clearInterval(timer);
      document.getElementById('time-count').textContent = "Time's Up";
      return;
    }
  }, 1000);
}

// submit identification answer
function submitAnswer() {
  $(document).ready(function () {
    var answer = $('#identifyAnswer').val();
    if (playerAnswered == false) {
      playerAnswered = true;
      socket.emit('player-answer', { answer, user_id });

      $('.remove-img').remove();
      $('.remove-answered-class').remove();
      $('#waiting-others').append(
        `<h3 class="text-center text-light remove-waiting">Answer Submitted! Waiting on other players...</h3>`
      );
    }
  });
}

// submit true answer
function submitTrue() {
  $(document).ready(function () {
    var answer = 'true';

    if (playerAnswered == false) {
      playerAnswered = true;
      socket.emit('player-answer', { answer, user_id });

      $('.remove-img').remove();
      $('.remove-answered-class').remove();
      $('#waiting-others').append(
        `<h3 class="text-center text-light remove-waiting">Answer Submitted! Waiting on other players...</h3>`
      );
    }
  });
}

// submit false answer
function submitFalse() {
  $(document).ready(function () {
    var answer = 'false';

    if (playerAnswered == false) {
      playerAnswered = true;
      socket.emit('player-answer', { answer, user_id });

      $('.remove-img').remove();
      $('.remove-answered-class').remove();
      $('#waiting-others').append(
        `<h3 class="text-center text-light remove-waiting">Answer Submitted! Waiting on other players...</h3>`
      );
    }
  });
}

// submit choice 1 answer
function submitChoiceOne() {
  $(document).ready(function () {
    var answer = $('#option1').val();
    if (playerAnswered == false) {
      playerAnswered = true;
      socket.emit('player-answer', { answer, user_id });

      $('.remove-img').remove();
      $('.remove-answered-class').remove();
      $('#waiting-others').append(
        `<h3 class="text-center text-light remove-waiting">Answer Submitted! Waiting on other players...</h3>`
      );
    }
  });
}

// submit choice 2 answer
function submitChoiceTwo() {
  $(document).ready(function () {
    var answer = $('#option2').val();

    if (playerAnswered == false) {
      playerAnswered = true;
      socket.emit('player-answer', { answer, user_id });

      $('.remove-img').remove();
      $('.remove-answered-class').remove();
      $('#waiting-others').append(
        `<h3 class="text-center text-light remove-waiting">Answer Submitted! Waiting on other players...</h3>`
      );
    }
  });
}

// submit choice 3 answer
function submitChoiceThree() {
  $(document).ready(function () {
    var answer = $('#option3').val();
    if (playerAnswered == false) {
      playerAnswered = true;
      socket.emit('player-answer', { answer, user_id });

      $('.remove-img').remove();
      $('.remove-answered-class').remove();
      $('#waiting-others').append(
        `<h3 class="text-center text-light remove-waiting">Answer Submitted! Waiting on other players...</h3>`
      );
    }
  });
}

// submit choice 4 answer
function submitChoiceFour() {
  $(document).ready(function () {
    var answer = $('#option4').val();
    if (playerAnswered == false) {
      playerAnswered = true;
      socket.emit('player-answer', { answer, user_id });

      $('.remove-img').remove();
      $('.remove-answered-class').remove();
      $('#waiting-others').append(
        `<h3 class="text-center text-light remove-waiting">Answer Submitted! Waiting on other players...</h3>`
      );
    }
  });
}

$(document).ready(function () {
  // player start
  socket.on('connect', () => {
    socket.emit('player-start', { id: id, user: user_id });
  });

  // if the game is over
  socket.on('game-over', (leaderboard) => {
    appendWinner();
    document.getElementById('time-count').textContent = 'Game Over';
    $('.remove-correct-answer').remove();
    $('.remove-question-text').remove();
    $('.remove-question-level').remove();
    $('.remove-table').remove();

    $('#text-id').append(
      `<h1 class="text-center fw-bold text-light">TOP PLAYER</h1>`
    );

    leaderboard.sort(function (a, b) {
      return b.score - a.score;
    });

    if (leaderboard.length == 3) {
      appendFinalLeaderboard(leaderboard, 3);
    } else if (leaderboard.length == 2) {
      appendFinalLeaderboard(leaderboard, 2);
    } else if (leaderboard.length == 1) {
      appendFinalLeaderboard(leaderboard, 1);
    }
  });

  // updates player score client base
  socket.on('update-player-score', (score) => {
    document.getElementById('points-count').textContent = 'Score: ' + score;
  });

  // if someone answered
  socket.on('hands-up-player', (data) => {
    $('.remove-img').remove();
    $('.remove-answered-class').remove();
    $('.remove-waiting').remove();
    $('.remove-audio-timer').remove();

    clearInterval(timer);
    document.getElementById('time-count').textContent = "Time's Up";

    if (data.isCorrect) {
      if (data.user_id == user_id) {
        appendPlayCorrect();
        appendCorrectAnswer(data.correctAnswer);
      } else {
        appendPlayWrong();
        appendWrongAnswer(data.correctAnswer);
      }
    } else {
      appendPlayWrong();
      appendWrongAnswer(data.correctAnswer);
    }
  });

  //show leaderboard to players
  socket.on('show-leaderboard-list', (leaderboard) => {
    $('.remove-correct-answer').remove();
    $('.remove-question-text').remove();
    $('.remove-question-level').text('Leaderboards');

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

  // if player not authorized
  socket.on('unauthorized-player', function () {
    window.location.href = '/home';
  });

  // first question for player
  socket.on('question-to-player', (data) => {
    updateTimer(3);

    appendLevel(data.level, data.points);
    appendText(data.text);

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

  // next question to player
  socket.on('next-question-to-player', (data) => {
    $('.remove-question-text').remove();
    $('.remove-correct-answer').remove();
    $('.remove-question-level').remove();
    $('.remove-table').remove();

    updateTimer(3);

    appendLevel(data.level, data.points);
    appendText(data.text);

    setTimeout(() => {
      clearInterval(timer);
      if (data.img != null) {
        appendImg(data.img);
      }
      playerAnswered = false;
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
    $(
      '#play-timer'
    ).append(`<audio class="remove-audio-timer" preload="auto" autoplay>
  <source src="../../assets/winner.mp3" type="audio/mpeg" />
  Your browser does not support the audio tag.
</audio`);
  }

  //add music wrong
  function appendPlayWrong() {
    $(
      '#play-timer'
    ).append(`<audio class="remove-audio-timer" preload="auto" autoplay>
    <source src="../../assets/wrong.mp3" type="audio/mpeg" />
    Your browser does not support the audio tag.
  </audio`);
  }

  //add music correct
  function appendPlayCorrect() {
    $(
      '#play-timer'
    ).append(`<audio class="remove-audio-timer" preload="auto" autoplay>
  <source src="../../assets/correct.mp3" type="audio/mpeg" />
  Your browser does not support the audio tag.
</audio`);
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
    let del;

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
      <a href="/dashboard" class="btn btn-danger fw-bold text-light btn-lg py-3 px-5 rounded-0 ">EXIT</a>
    `
    );
  }

  // append leaderboard
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
        <h4 class="text-light text-center" style="font-size: 2.5rem">Correct Answer: ` +
        first +
        last +
        `</h4>
        <p
          class="text-center text-success text-question my-5"
          style="font-size: 4rem; font-weight: bolder"
        >
        Correct
        </p>
      </div>
      `
    );
  }

  // append wrong answer
  function appendWrongAnswer(answer) {
    var first = answer.charAt(0).toUpperCase();
    var last = answer.substring(1);

    $('#correct-answer-id').append(
      `
      <div class="mt-5 remove-correct-answer">
        <h4 class="text-light text-center"  style="font-size: 2.5rem">Correct Answer: ` +
        first +
        last +
        `</h4>
        <p
          class="text-center text-danger text-question my-5"
          style="font-size: 4rem; font-weight: bolder"
        >
        Wrong
        </p>
      </div>
      `
    );
  }

  // append question text
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

  // append true or false type of question
  function appendTrueFalse() {
    $('#tof-id').append(
      `
      <div class="outer-fit-this remove-answered-class">
          <input
          type="radio"
          class="btn-check type"
          name="answer"
          id="optionTrue"
          onclick="submitTrue()"
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
          onclick="submitFalse()"
          value="false"
          id="optionFalse"
          required
          />
          <label class="btn btn-danger btn-lg p-5 m-2 rounded fit-this" for="optionFalse"
          >False</label
          >`
    );
  }

  // append multiple choice type of question
  function appendChoices(data) {
    $('#choices-id').append(
      `
    <div class="outer-fit-this remove-answered-class">
        <input
        type="radio"
        class="btn-check type"
        name="answer"
        id="option1"
        onclick="submitChoiceOne()"
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
        onclick="submitChoiceTwo()"
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
        onclick="submitChoiceThree()"
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
        onclick="submitChoiceFour()"
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

  // append identification type of question
  function appendIdentification() {
    $('#identification-id').append(`
    <input
        type="text"
        class="p-4 rounded fs-4 w-75 remove-answered-class"
        name="answer"
        id="identifyAnswer"
        placeholder="Enter your answer"
        required
    />
    <br />
    <button
        class="btn btn-primary px-5 py-3 fs-4 mt-4 remove-answered-class"
        style="font-weight: bold"
        id="submitAnswer"
        onclick="submitAnswer()"
    >
        SUBMIT
    </button>`);
  }

  // append level of question
  function appendLevel(level, points) {
    switch (level) {
      case 'easy':
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
        break;
      case 'average':
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
        break;

      case 'difficult':
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
        break;
      default:
        break;
    }
  }

  // host disconnect
  socket.on('host-disconnect', function () {
    window.location.href = '/';
  });
});
