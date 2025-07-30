const { DataTypes } = require('sequelize');
const sequelize = require('../config/dsasamuraitracker');

const AssignmentQuestion = sequelize.define('AssignmentQuestion', {
  assignment_id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true,
    references: {
      model: 'assignments',
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
  order: { 
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'assignment_questions',
  timestamps: false
});

module.exports = AssignmentQuestion;
