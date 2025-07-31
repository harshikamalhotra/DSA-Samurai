const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  enrollment_id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  gfg_id: {
    type: String,
    trim: true
  },
  leetcode_id: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  streak_count: {
    type: Number,
    default: 0
  },
  last_active: {
    type: Date
  },
  // Additional fields for better tracking
  profile_complete: {
    type: Boolean,
    default: false
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

// Hash password before saving
const bcrypt = require('bcrypt');

studentSchema.pre('save', async function(next) {
  this.updated_at = Date.now();
  
  // Hash password if it's modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  
  next();
});

// Method to compare passwords
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes are created through schema field definitions

module.exports = mongoose.model('Student', studentSchema);
