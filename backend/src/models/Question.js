const { DataTypes } = require('sequelize');
const sequelize = require('../config/dsasamuraitracker');

const Question = sequelize.define('Question', {
  title: { 
    type: DataTypes.STRING, 
    allowNull: false 
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