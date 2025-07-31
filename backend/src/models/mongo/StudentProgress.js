const mongoose = require('mongoose');

const studentProgressSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['Solved', 'Attempted', 'Not Attempted'],
    default: 'Not Attempted'
  },
  solved_at: {
    type: Date
  },
  platform: {
    type: String,
    enum: ['LeetCode', 'GeeksforGeeks'],
    required: true
  },
  submission_count: {
    type: Number,
    default: 1
  },
  time_taken: {
    type: Number // in minutes
  },
  programming_language: {
    type: String,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Compound index for student and question (unique combination)
studentProgressSchema.index({ student_id: 1, question_id: 1 }, { unique: true });

// Index for platform-based queries
studentProgressSchema.index({ student_id: 1, platform: 1 });

// Index for status-based queries
studentProgressSchema.index({ student_id: 1, status: 1 });

studentProgressSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('StudentProgress', studentProgressSchema);
