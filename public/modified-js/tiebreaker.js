$(document).ready(function () {
  $('#questionType').change(function () {
    var type = $('#questionType').val();
    if (type === 'trueFalse') {
      $('.type').remove();
      $('.question-type').append(
        `<div class="w-100 d-flex justify-content-between align-items-center type">
            <input type="radio" class="btn-check type" name="answer" id="option1" value="true" required>
            <label class="btn btn-primary btn-lg w-100 m-2 type rounded-0 p-5" for="option1">True</label>
  
            <input type="radio" class="btn-check type" name="answer" id="option2" value="false" required>
            <label class="btn btn-danger btn-lg w-100 m-2 type rounded-0 p-5" for="option2">False</label>
          </div>
        `
      );
    } else if (type === 'multipleChoice') {
      $('.type').remove();
      $('.question-type').append(
        `<div class="w-100 d-flex justify-content-between align-items-center mb-2 type">
            <input
            type="radio"
            id="first"
            class="form-check-input fs-2 me-2 type"
            style="aspect-ratio: 1/1"
            readonly
            name="answer"
            required
          />
          <input
            type="text"
            class="form-control-lg w-100 type rounded-0 border border-2 border-secondary p-3"
            id="first-choice"
            name="choice1"
            onkeypress="updateRadioValue()"
            placeholder="Enter first choice"
            required
          />
        </div>
  
        <div class="w-100 d-flex justify-content-between align-items-center my-2 type">
          <input
            type="radio"
            id="second"
            class="form-check-input fs-2 me-2 type"
            style="aspect-ratio: 1/1"
            readonly
            name="answer"
            required
          />
          <input
            type="text"
            class="form-control-lg w-100 type rounded-0 border border-2 border-secondary p-3"
            id="second-choice"
            placeholder="Enter second choice"
            onkeypress="updateRadioValue()"
            name="choice2"
            required
          /> 
        </div>
        
        <div class="w-100 d-flex justify-content-between align-items-center my-2 type">
          <input
            type="radio"
            id="third"
            class="form-check-input fs-2 me-2 type"
            style="aspect-ratio: 1/1"
            readonly
            name="answer"
            required
          />
          <input
            type="text"
            class="form-control-lg w-100 type rounded-0 border border-2 border-secondary p-3"
            placeholder="Enter third choice"
            onkeypress="updateRadioValue()"
            id="third-choice"
            name="choice3"
            required
          />
        </div>
        
        <div class="w-100 d-flex justify-content-between align-items-center my-2 type">
          <input
            type="radio"
            id="fourth"
            class="form-check-input fs-2 me-2 type"
            style="aspect-ratio: 1/1"
            readonly
            name="answer"
            required
          />
          <input
            type="text"
            class="form-control-lg w-100 type rounded-0 border border-2 border-secondary p-3"
            placeholder="Enter fourth choice"
            onkeypress="updateRadioValue()"
            id="fourth-choice"
            name="choice4"
            required
          />
        </div>
        `
      );
    } else if (type === 'identification') {
      $('.type').remove();
      $('.question-type').append(
        `<input
          type="text"
          class="form-control-lg w-100 type rounded-0 border border-2 border-secondary p-3"
          name="answer"
          placeholder="Enter answer"
          required
        />`
      );
    } else {
      $('.type').remove();
    }
  });
});

$(document).ready(function () {
  $('#questionTypeUpdate').change(function () {
    var type = $('#questionTypeUpdate').val();
    if (type === 'trueFalse') {
      $('.type').remove();
      $('.question-type-update').append(
        `<div class="w-100 d-flex justify-content-between align-items-center type">
            <input type="radio" class="btn-check type" name="answer" id="option1" value="true" required>
            <label class="btn btn-primary btn-lg w-100 m-2 type rounded-0 p-5" for="option1">True</label>
  
            <input type="radio" class="btn-check type" name="answer" id="option2" value="false" required>
            <label class="btn btn-danger btn-lg w-100 m-2 type rounded-0 p-5" for="option2">False</label>
          </div>
        `
      );
    } else if (type === 'multipleChoice') {
      $('.type').remove();
      $('.question-type-update').append(
        `<div class="w-100 d-flex justify-content-between align-items-center mb-2 type">
            <input
            type="radio"
            id="first"
            class="form-check-input fs-2 me-2 type"
            style="aspect-ratio: 1/1"
            readonly
            name="answer"
            required
          />
          <input
            type="text"
            class="form-control-lg w-100 type rounded-0 border border-2 border-secondary p-3"
            id="first-choice"
            name="choice1"
            onkeypress="updateRadioValue()"
            placeholder="Enter first choice"
            required
          />
        </div>
  
        <div class="w-100 d-flex justify-content-between align-items-center my-2 type">
          <input
            type="radio"
            id="second"
            class="form-check-input fs-2 me-2 type"
            style="aspect-ratio: 1/1"
            readonly
            name="answer"
            required
          />
          <input
            type="text"
            class="form-control-lg w-100 type rounded-0 border border-2 border-secondary p-3"
            id="second-choice"
            placeholder="Enter second choice"
            onkeypress="updateRadioValue()"
            name="choice2"
            required
          /> 
        </div>
        
        <div class="w-100 d-flex justify-content-between align-items-center my-2 type">
          <input
            type="radio"
            id="third"
            class="form-check-input fs-2 me-2 type"
            style="aspect-ratio: 1/1"
            readonly
            name="answer"
            required
          />
          <input
            type="text"
            class="form-control-lg w-100 type rounded-0 border border-2 border-secondary p-3"
            placeholder="Enter third choice"
            onkeypress="updateRadioValue()"
            id="third-choice"
            name="choice3"
            required
          />
        </div>
        
        <div class="w-100 d-flex justify-content-between align-items-center my-2 type">
          <input
            type="radio"
            id="fourth"
            class="form-check-input fs-2 me-2 type"
            style="aspect-ratio: 1/1"
            readonly
            name="answer"
            required
          />
          <input
            type="text"
            class="form-control-lg w-100 type rounded-0 border border-2 border-secondary p-3"
            placeholder="Enter fourth choice"
            onkeypress="updateRadioValue()"
            id="fourth-choice"
            name="choice4"
            required
          />
        </div>
        `
      );
    } else if (type === 'identification') {
      $('.type').remove();
      $('.question-type-update').append(
        `<input
          type="text"
          class="form-control-lg w-100 type rounded-0 border border-2 border-secondary p-3"
          name="answer"
          placeholder="Enter answer"
          required
        />`
      );
    } else {
      $('.type').remove();
    }
  });
});

function updateRadioValue() {
  $(document).ready(function () {
    $('#first').val($('#first-choice').val());
    $('#second').val($('#second-choice').val());
    $('#third').val($('#third-choice').val());
    $('#fourth').val($('#fourth-choice').val());
  });
}
