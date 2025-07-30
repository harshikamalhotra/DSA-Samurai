const { DataTypes } = require('sequelize');
const sequelize = require('../config/dsasamuraitracker');

const StudentProgress = sequelize.define('StudentProgress', {
  status: { 
    type: DataTypes.ENUM('Solved', 'Attempted', 'Pending'), 
    defaultValue: 'Pending' 
  },
  solved_at: { 
    type: DataTypes.DATE 
  },
  solution_url: { 
    type: DataTypes.STRING 
  },
  attempts: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  }
}, {
  tableName: 'student_progress',
  timestamps: true
});

module.exports = StudentProgress;