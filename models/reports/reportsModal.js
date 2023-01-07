const mongoose = require('mongoose');

const reportsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Questions',
    required: true,
  },
  question_title: {
    type: String,
    required: true,
  },
  pin: {
    type: Number,
    required: true,
  },
  players: {
    type: Array,
    required: false,
    player_id: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
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

module.exports = mongoose.model('Reports', reportsSchema);
