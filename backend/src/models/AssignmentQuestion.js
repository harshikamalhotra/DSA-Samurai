const { DataTypes } = require('sequelize');
const sequelize = require('../config/dsasamuraitracker');

const AssignmentQuestion = sequelize.define('AssignmentQuestion', {
  assignment_id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true 
  },
  question_id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true 
  },
  order: { 
    type: DataTypes.INTEGER 
  }
}, {
  tableName: 'assignment_questions',
  timestamps: false
});

module.exports = AssignmentQuestion;