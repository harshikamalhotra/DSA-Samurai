const express = require('express');
const authenticateToken = require('../middleware/auth');
const { syncStudentById } = require('../services/syncService');
const router = express.Router();

// Sync progress for a specific student by ID
router.post('/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // For now, any authenticated user can trigger sync
    // Later you might want to restrict this to admins only
    
    const result = await syncStudentById(studentId);
    res.json(result);
  } catch (error) {
    console.error('Error syncing student:', error);
    if (error.message === 'Student not found') {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.status(500).json({ error: 'Failed to sync student progress' });
    }
  }
});

// Test endpoint to check if sync service is working
router.get('/test', authenticateToken, (req, res) => {
  res.json({ message: 'Sync service is running!' });
});

// Test endpoint WITHOUT authentication (for development only)
router.get('/test-no-auth', (req, res) => {
  res.json({ message: 'Sync service is running! (No auth required)' });
});

// Test sync WITHOUT authentication (for development only)
router.post('/test-sync/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await syncStudentById(studentId);
    res.json(result);
  } catch (error) {
    console.error('Error syncing student:', error);
    if (error.message === 'Student not found') {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.status(500).json({ error: 'Failed to sync student progress' });
    }
  }
});

module.exports = router;
