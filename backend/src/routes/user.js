const express = require('express');
const authenticateToken = require('../middleware/auth');
const { Student } = require('../models');
const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { firebase_uid: req.user.uid }
    });
    
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    
    res.json({ user: req.user, profile: student });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Link Firebase account to existing student profile
router.post('/link-account', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    
    // Check if this Firebase user is already linked
    const existingLinkedStudent = await Student.findOne({
      where: { firebase_uid: req.user.uid }
    });
    
    if (existingLinkedStudent) {
      return res.json({ 
        message: 'Account already linked', 
        student: existingLinkedStudent 
      });
    }
    
    // Find student by email in pre-existing database
    const student = await Student.findOne({
      where: { email: userEmail }
    });
    
    if (!student) {
      return res.status(403).json({ 
        error: 'Access denied. Your email is not registered in our system. Please contact your administrator.' 
      });
    }
    
    // Link Firebase UID to existing student
    student.firebase_uid = req.user.uid;
    student.email = userEmail; // Ensure email is set
    await student.save();
    
    res.json({ 
      message: 'Account linked successfully!', 
      student: {
        id: student.id,
        name: student.name,
        enrollment_id: student.enrollment_id,
        email: student.email
      }
    });
    
  } catch (error) {
    console.error('Error linking account:', error);
    res.status(500).json({ error: 'Failed to link account' });
  }
});

// Register student profile (Admin only - for adding new students)
router.post('/register', authenticateToken, async (req, res) => {
  try {
    // TODO: Add admin check here
    const { name, enrollment_id, email, gfg_id, leetcode_id, phone } = req.body;
    
    const student = await Student.create({
      name,
      enrollment_id,
      email,
      gfg_id,
      leetcode_id,
      phone
    });
    
    res.status(201).json({ message: 'Student registered successfully', student });
  } catch (error) {
    console.error('Error registering student:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Enrollment ID or email already exists' });
    } else if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ error: error.errors.map(e => e.message) });
    } else {
      res.status(500).json({ error: 'Failed to register student' });
    }
  }
});

// Update student profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, gfg_id, leetcode_id, phone } = req.body;
    
    const [updatedRows] = await Student.update(
      { name, gfg_id, leetcode_id, phone },
      { where: { firebase_uid: req.user.uid } }
    );
    
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    
    const updatedStudent = await Student.findOne({
      where: { firebase_uid: req.user.uid }
    });
    
    res.json({ message: 'Profile updated successfully', student: updatedStudent });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ error: error.errors.map(e => e.message) });
    } else {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
});

module.exports = router;
