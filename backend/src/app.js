const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const syncRoutes = require('./routes/sync');
const leaderboardRoutes = require('./routes/leaderboard');
const questionsRoutes = require('./routes/questions');
const connectDB = require('./config/mongodb');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/questions', questionsRoutes);

// Connect to MongoDB Atlas
connectDB()
  .then(() => {
    console.log('MongoDB Atlas connected successfully!');
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});