$(document).ready(function () {
  $('#questionType').change(function () {
    var typeOf = $(this).val();
    $('#text').text(typeOf);

    if (typeOf === 'multipleChoice') {
      $('.nani').append(
        "<input type='text' class='form-control' name='" +
          crypto.randomUUID() +
          "' placeholder='Choose'/>"
      );
      $('.nani').append(
        "<input type='text' class='form-control' name='" +
          crypto.randomUUID() +
          "' placeholder='Choose'/>"
      );
      $('.nani').append(
        "<input type='text' class='form-control' name='" +
          crypto.randomUUID() +
          "' placeholder='Choose'/>"
      );
      $('.nani').append(
        "<input type='text' class='form-control' name='" +
          crypto.randomUUID() +
          "' placeholder='Choose'/>"
      );
    } else if (typeOf === 'trueFalse') {
      $('.nani').append(
        "<input type='text' class='form-control' name='" +
          crypto.randomUUID() +
          "' placeholder='Choose'/>"
      );
      $('.nani').append(
        "<input type='text' class='form-control' name='" +
          crypto.randomUUID() +
          "' placeholder='Choose'/>"
      );
    } else if (typeOf === 'identification') {
      $('.nani').append(
        "<input type='text' class='form-control' name='" +
          crypto.randomUUID() +
          "' placeholder='Choose'/>"
      );
    } else if (typeOf === 'enumeration') {
      $('.nani').append(
        "<input type='text' class='form-control' name='" +
          crypto.randomUUID() +
          "' placeholder='Choose'/>"
      );
      $('.nani').append(
        "<input type='text' class='form-control' name='" +
          crypto.randomUUID() +
          "' placeholder='Choose'/>"
      );
      $('.nani').append(
        "<input type='text' class='form-control' name='" +
          crypto.randomUUID() +
          "' placeholder='Choose'/>"
      );
      $('.nani').append(
        "<input type='text' class='form-control' name='" +
          crypto.randomUUID() +
          "' placeholder='Choose'/>"
      );
    }
  });
});
