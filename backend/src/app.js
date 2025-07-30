// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const userRoutes = require('./routes/user');
// const sequelize = require('./config/dsasamuraitracker');
// const Student = require('./models/Student');

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use('/api/user', userRoutes);

// sequelize.authenticate()
//   .then(() => console.log('PostgreSQL connected!'))
//   .catch(err => console.error('Connection error:', err));

// sequelize.sync()
//   .then(() => console.log('Models synced!'))
//   .catch(err => console.error('Sync error:', err));

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/user');
const { sequelize, Student } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);

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