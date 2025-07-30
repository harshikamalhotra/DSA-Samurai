const { DataTypes } = require('sequelize');
const sequelize = require('../config/dsasamuraitracker');

const StudentProgress = sequelize.define('StudentProgress', {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  question_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'questions',
      key: 'id'
    }
  },
  assignment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'assignments',
      key: 'id'
    }
  },
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
