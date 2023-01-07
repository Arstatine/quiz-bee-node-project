const mongoose = require('mongoose');

const question = {
  text: {
    type: String,
    required: false,
  },
  level: {
    type: String,
    required: false,
  },
  img: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  choices: {
    type: Array,
    required: false,
  },
  correctAnswer: {
    type: String,
    required: false,
  },
};

const questionsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pin: {
    type: Number,
    required: false,
  },
  questions: {
    type: Array,
    required: false,
    question,
  },
  inLobby: {
    type: Boolean,
    default: false,
  },
  isStarted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model('Questions', questionsSchema);
