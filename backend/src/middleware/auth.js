const jwt = require('jsonwebtoken');
const Student = require('../models/mongo/Student');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the student in database
    const student = await Student.findById(decoded.studentId);
    if (!student) {
      return res.status(401).json({ error: 'Invalid token - student not found' });
    }

    // Add student info to request object
    req.student = student;
    req.user = { uid: student._id };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    } else {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = authenticateToken;
