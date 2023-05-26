const mongoose = require('mongoose');

const reportsSchema = new mongoose.Schema(
  {
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
    question_text: {
      type: String,
      required: true,
    },
    question_description: {
      type: String,
      required: true,
    },
    socket_id: {
      type: String,
      required: true,
    },
    players: {
      type: Array,
      required: false,
      player_id: {
        type: String,
        required: false,
      },
      player_socket: {
        type: String,
        required: false,
      },
      player_name: {
        type: String,
        required: false,
      },
      total_points: {
        type: Number,
        required: true,
      },
      question: {
        type: Array,
        required: false,
        question_text: {
          type: String,
          required: false,
        },
        question_type: {
          type: String,
          required: false,
        },
        question_level: {
          type: String,
          required: false,
        },
        isCorrect: {
          type: Boolean,
          required: false,
        },
        answer: {
          type: String,
          required: false,
        },
        correctAnswer: {
          type: String,
          required: false,
        },
        points: {
          type: Number,
          required: false,
        },
      },
    },
    createdAt: {
      type: Date,
      default: () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })),
      immutable: true,
    },
    updatedAt: {
      type: Date,
      default: () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })),
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Reports', reportsSchema);
