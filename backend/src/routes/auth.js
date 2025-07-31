const express = require('express');
const jwt = require('jsonwebtoken');
const Student = require('../models/mongo/Student');
const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find student by username or enrollment_id
    const student = await Student.findOne({
      $or: [
        { username: username.toLowerCase() },
        { enrollment_id: username }
      ]
    });

    if (!student) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await student.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last active
    student.last_active = new Date();
    await student.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        studentId: student._id,
        username: student.username,
        enrollment_id: student.enrollment_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      student: {
        id: student._id,
        name: student.name,
        username: student.username,
        enrollment_id: student.enrollment_id,
        email: student.email,
        gfg_id: student.gfg_id,
        leetcode_id: student.leetcode_id,
        streak_count: student.streak_count,
        last_active: student.last_active
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const student = await Student.findById(req.user.studentId).select('-password');
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ student });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, gfg_id, leetcode_id } = req.body;
    
    const student = await Student.findByIdAndUpdate(
      req.user.studentId,
      { name, email, phone, gfg_id, leetcode_id, updated_at: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Profile updated successfully', student });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    const student = await Student.findById(req.user.studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Verify current password
    const isValidPassword = await student.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    student.password = newPassword;
    await student.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

module.exports = router;
