const { sequelize } = require('./models');

async function initializeDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ force: true }); 
    console.log('All models were synchronized successfully.');

  } catch (error) {
    console.error('Unable to initialize database:', error);
    process.exit(1);
  }
}

initializeDatabase();