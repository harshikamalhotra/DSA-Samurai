const { DataTypes } = require('sequelize');
const sequelize = require('../config/dsasamuraitracker');

const Question = sequelize.define('Question', {
  title: { 
    type: DataTypes.STRING, 
    allowNull: false,
    unique: true
  },
  title_slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: { 
    type: DataTypes.TEXT 
  },
  difficulty: { 
    type: DataTypes.ENUM('Easy', 'Medium', 'Hard'), 
    allowNull: false 
  },
  platform: { 
    type: DataTypes.ENUM('LeetCode', 'GeeksForGeeks', 'CodeForces'), 
    allowNull: false 
  },
  platform_id: { 
    type: DataTypes.STRING  // ID on the original platform
  },
  url: { 
    type: DataTypes.STRING 
  },
  tags: { 
    type: DataTypes.ARRAY(DataTypes.STRING) 
  },
  is_active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  tableName: 'questions',
  timestamps: true
});

module.exports = Question;