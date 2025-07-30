const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/user');
const syncRoutes = require('./routes/sync');
const { sequelize, Student } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/sync', syncRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected!');
    

    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('All models were synchronized successfully.');
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database error:', err);
    process.exit(1);
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});