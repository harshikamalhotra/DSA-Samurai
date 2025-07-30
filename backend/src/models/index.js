const sequelize = require('../config/dsasamuraitracker');
const Student = require('./Student');
const Question = require('./Question');
const Assignment = require('./Assignment');
const AssignmentQuestion = require('./AssignmentQuestion');
const StudentProgress = require('./StudentProgress');


Assignment.belongsToMany(Question, {
  through: AssignmentQuestion,
  foreignKey: 'assignment_id'
});
Question.belongsToMany(Assignment, {
  through: AssignmentQuestion,
  foreignKey: 'question_id'
});

Student.belongsToMany(Question, {
  through: StudentProgress,
  foreignKey: 'student_id'
});
Question.belongsToMany(Student, {
  through: StudentProgress,
  foreignKey: 'question_id'
});

Assignment.hasMany(StudentProgress, {
  foreignKey: 'assignment_id'
});
StudentProgress.belongsTo(Assignment, {
  foreignKey: 'assignment_id'
});

module.exports = {
  sequelize,
  Student,
  Question,
  Assignment,
  AssignmentQuestion,
  StudentProgress
};