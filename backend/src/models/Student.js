const { DataTypes } = require('sequelize');
const sequelize = require('../config/dsasamuraitracker');

const Student = sequelize.define('Student', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  enrollment_id: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    // unique: true, 
    allowNull: true,
    validate: { isEmail: true }
  },
  gfg_id: { 
    type: DataTypes.STRING 
  },
  leetcode_id: { 
    type: DataTypes.STRING 
  },
  phone: { 
    type: DataTypes.STRING,
    validate: {
      is: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    }
  },
  firebase_uid: { 
    type: DataTypes.STRING, 
    unique: true 
  },
  streak_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  last_active: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'students',
  timestamps: false
});

module.exports = Student;