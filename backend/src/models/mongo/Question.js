const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  title_slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Basic', 'School'],
    required: true
  },
  platform: {
    type: String,
    enum: ['LeetCode', 'GeeksforGeeks'],
    required: true
  },
  question_url: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Compound index for platform and title_slug
questionSchema.index({ platform: 1, title_slug: 1 });

questionSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Question', questionSchema);
