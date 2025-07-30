const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dsasamuraitracker', 'postgres', 'harshika@1234', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;