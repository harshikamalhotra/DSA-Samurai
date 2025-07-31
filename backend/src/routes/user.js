const express = require('express');
const authenticateToken = require('../middleware/auth');
const Student = require('../models/mongo/Student');
const StudentProgress = require('../models/mongo/StudentProgress');
const Question = require('../models/mongo/Question');
const router = express.Router();

// Get user profile with progress stats
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.student._id
    });

    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Retrieve student's progress
    const progressLeetCode = await StudentProgress.find({ student_id: student._id, platform: 'LeetCode' });
    const progressGFG = await StudentProgress.find({ student_id: student._id, platform: 'GeeksforGeeks' });

    // Use the correct field names from database
    const profileForFrontend = {
      ...student.toObject()
    };

    res.json({
      profile: profileForFrontend,
      progress: {
        leetcode: progressLeetCode,
        geeksforgeeks: progressGFG
      }
    });
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
    const { name, gfg_username, leetcode_username, phone } = req.body;
    
    // Update the student profile
    const updatedStudent = await Student.findByIdAndUpdate(
      req.student._id,
      { 
        name, 
        gfg_username,
        leetcode_username,
        phone,
        updated_at: new Date()
      },
      { new: true } // Return the updated document
    );
    
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    
    res.json({ 
      message: 'Profile updated successfully', 
      student: {
        id: updatedStudent._id,
        name: updatedStudent.name,
        enrollment_id: updatedStudent.enrollment_id,
        email: updatedStudent.email,
        leetcode_username: updatedStudent.leetcode_username,
        gfg_username: updatedStudent.gfg_username,
        phone: updatedStudent.phone
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get detailed student statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const studentId = req.student._id;
    
    // Get all progress records with question details
    const progressWithQuestions = await StudentProgress.find({ student_id: studentId })
      .populate('question_id')
      .sort({ solved_at: -1 });
    
    // Calculate statistics
    const stats = {
      total_solved: progressWithQuestions.length,
      platforms: {
        leetcode: {
          solved: 0,
          easy: 0,
          medium: 0,
          hard: 0,
          recent_submissions: []
        },
        geeksforgeeks: {
          solved: 0,
          basic: 0,
          easy: 0,
          medium: 0,
          hard: 0,
          recent_submissions: []
        }
      },
      recent_activity: [],
      streak_count: req.student.streak_count || 0
    };
    
    // Process each progress record
    progressWithQuestions.forEach(progress => {
      const platform = progress.platform.toLowerCase();
      const difficulty = progress.question_id?.difficulty?.toLowerCase() || 'unknown';
      
      if (platform === 'leetcode') {
        stats.platforms.leetcode.solved++;
        if (difficulty === 'easy') stats.platforms.leetcode.easy++;
        else if (difficulty === 'medium') stats.platforms.leetcode.medium++;
        else if (difficulty === 'hard') stats.platforms.leetcode.hard++;
        
        // Add to recent submissions (last 5)
        if (stats.platforms.leetcode.recent_submissions.length < 5) {
          stats.platforms.leetcode.recent_submissions.push({
            title: progress.question_id?.title,
            difficulty: progress.question_id?.difficulty,
            solved_at: progress.solved_at,
            language: progress.programming_language
          });
        }
      } else if (platform === 'geeksforgeeks') {
        stats.platforms.geeksforgeeks.solved++;
        if (difficulty === 'basic') stats.platforms.geeksforgeeks.basic++;
        else if (difficulty === 'easy') stats.platforms.geeksforgeeks.easy++;
        else if (difficulty === 'medium') stats.platforms.geeksforgeeks.medium++;
        else if (difficulty === 'hard') stats.platforms.geeksforgeeks.hard++;
        
        // Add to recent submissions (last 5)
        if (stats.platforms.geeksforgeeks.recent_submissions.length < 5) {
          stats.platforms.geeksforgeeks.recent_submissions.push({
            title: progress.question_id?.title,
            difficulty: progress.question_id?.difficulty,
            solved_at: progress.solved_at
          });
        }
      }
      
      // Add to recent activity (last 10)
      if (stats.recent_activity.length < 10) {
        stats.recent_activity.push({
          platform: progress.platform,
          title: progress.question_id?.title,
          difficulty: progress.question_id?.difficulty,
          solved_at: progress.solved_at
        });
      }
    });
    
    res.json({
      student: {
        id: req.student._id,
        name: req.student.name,
        enrollment_id: req.student.enrollment_id,
        leetcode_username: req.student.leetcode_username,
        gfg_username: req.student.gfg_username
      },
      stats
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get student's solved questions with pagination
router.get('/solved-questions', authenticateToken, async (req, res) => {
  try {
    const studentId = req.student._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const platform = req.query.platform; // 'LeetCode' or 'GeeksforGeeks'
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { student_id: studentId, status: 'Solved' };
    if (platform) {
      query.platform = platform;
    }
    
    // Get solved questions with pagination
    const solvedQuestions = await StudentProgress.find(query)
      .populate('question_id')
      .sort({ solved_at: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalCount = await StudentProgress.countDocuments(query);
    
    res.json({
      questions: solvedQuestions.map(progress => ({
        id: progress.question_id?._id,
        title: progress.question_id?.title,
        difficulty: progress.question_id?.difficulty,
        platform: progress.platform,
        solved_at: progress.solved_at,
        programming_language: progress.programming_language,
        question_url: progress.question_id?.question_url
      })),
      pagination: {
        current_page: page,
        total_pages: Math.ceil(totalCount / limit),
        total_count: totalCount,
        per_page: limit
      }
    });
    
  } catch (error) {
    console.error('Error fetching solved questions:', error);
    res.status(500).json({ error: 'Failed to fetch solved questions' });
  }
});

module.exports = router;
