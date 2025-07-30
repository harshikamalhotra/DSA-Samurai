const { DataTypes } = require('sequelize');
const sequelize = require('../config/dsasamuraitracker');

const Assignment = sequelize.define('Assignment', {
  title: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT 
  },
  due_date: { 
    type: DataTypes.DATE 
  },
  is_active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  tableName: 'assignments',
  timestamps: true
});

module.exports = Assignment;