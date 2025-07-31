const express = require('express');
const authenticateToken = require('../middleware/auth');
const Question = require('../models/mongo/Question');
const StudentProgress = require('../models/mongo/StudentProgress');
const router = express.Router();

// Get all questions with filtering and pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      difficulty,
      platform,
      status, // solved, unsolved, all
      search,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const studentId = req.student._id;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query for questions
    let questionQuery = {};
    
    if (difficulty && difficulty !== 'all') {
      questionQuery.difficulty = difficulty;
    }
    
    if (platform && platform !== 'all') {
      questionQuery.platform = platform;
    }
    
    if (search && search.trim()) {
      questionQuery.title = { $regex: search.trim(), $options: 'i' };
    }

    // Get questions
    let questions = await Question.find(questionQuery)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get student's progress for these questions
    const questionIds = questions.map(q => q._id);
    const studentProgress = await StudentProgress.find({
      student_id: studentId,
      question_id: { $in: questionIds }
    });

    // Create a map of question progress
    const progressMap = {};
    studentProgress.forEach(progress => {
      progressMap[progress.question_id.toString()] = progress;
    });

    // Add progress status to questions
    questions = questions.map(question => ({
      ...question,
      status: progressMap[question._id.toString()]?.status || 'Not Attempted',
      solved_at: progressMap[question._id.toString()]?.solved_at || null,
      submission_count: progressMap[question._id.toString()]?.submission_count || 0
    }));

    // Filter by status if requested
    if (status && status !== 'all') {
      if (status === 'solved') {
        questions = questions.filter(q => q.status === 'Solved');
      } else if (status === 'unsolved') {
        questions = questions.filter(q => q.status !== 'Solved');
      }
    }

    // Get total count for pagination
    const totalQuestions = await Question.countDocuments(questionQuery);
    
    // If we filtered by status, we need to adjust the count
    let filteredCount = totalQuestions;
    if (status === 'solved') {
      filteredCount = await StudentProgress.countDocuments({
        student_id: studentId,
        status: 'Solved'
      });
    } else if (status === 'unsolved') {
      const solvedCount = await StudentProgress.countDocuments({
        student_id: studentId,
        status: 'Solved'
      });
      filteredCount = totalQuestions - solvedCount;
    }

    res.json({
      questions,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total_questions: filteredCount,
        total_pages: Math.ceil(filteredCount / parseInt(limit))
      },
      stats: {
        total_questions: totalQuestions,
        solved_count: studentProgress.filter(p => p.status === 'Solved').length,
        attempted_count: studentProgress.length
      }
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get question statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const studentId = req.student._id;

    // Get overall stats
    const [
      totalQuestions,
      studentProgress,
      platformStats,
      difficultyStats
    ] = await Promise.all([
      Question.countDocuments(),
      StudentProgress.find({ student_id: studentId }),
      Question.aggregate([
        { $group: { _id: '$platform', count: { $sum: 1 } } }
      ]),
      Question.aggregate([
        { $group: { _id: '$difficulty', count: { $sum: 1 } } }
      ])
    ]);

    const solvedQuestions = studentProgress.filter(p => p.status === 'Solved');
    const attemptedQuestions = studentProgress.length;

    res.json({
      total_questions: totalQuestions,
      solved_count: solvedQuestions.length,
      attempted_count: attemptedQuestions,
      not_attempted_count: totalQuestions - attemptedQuestions,
      platform_breakdown: platformStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      difficulty_breakdown: difficultyStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      solved_by_platform: await getSolvedByPlatform(studentId),
      solved_by_difficulty: await getSolvedByDifficulty(studentId)
    });

  } catch (error) {
    console.error('Error fetching question stats:', error);
    res.status(500).json({ error: 'Failed to fetch question statistics' });
  }
});

// Helper function to get solved questions by platform
async function getSolvedByPlatform(studentId) {
  const result = await StudentProgress.aggregate([
    { $match: { student_id: studentId, status: 'Solved' } },
    { $lookup: { from: 'questions', localField: 'question_id', foreignField: '_id', as: 'question' } },
    { $unwind: '$question' },
    { $group: { _id: '$question.platform', count: { $sum: 1 } } }
  ]);
  
  return result.reduce((acc, stat) => {
    acc[stat._id] = stat.count;
    return acc;
  }, {});
}

// Helper function to get solved questions by difficulty
async function getSolvedByDifficulty(studentId) {
  const result = await StudentProgress.aggregate([
    { $match: { student_id: studentId, status: 'Solved' } },
    { $lookup: { from: 'questions', localField: 'question_id', foreignField: '_id', as: 'question' } },
    { $unwind: '$question' },
    { $group: { _id: '$question.difficulty', count: { $sum: 1 } } }
  ]);
  
  return result.reduce((acc, stat) => {
    acc[stat._id] = stat.count;
    return acc;
  }, {});
}

// Update question status for the current user
router.put('/:questionId/status', authenticateToken, async (req, res) => {
  try {
    const { questionId } = req.params;
    const { status } = req.body;
    const studentId = req.student._id;

    // Validate status
    if (!['solved', 'not_solved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "solved" or "not_solved"' });
    }

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Map frontend status to database status
    const dbStatus = status === 'solved' ? 'Solved' : 'Not Attempted';

    // Update or create student progress for this question
    let studentProgress = await StudentProgress.findOne({ 
      student_id: studentId, 
      question_id: questionId 
    });

    if (studentProgress) {
      studentProgress.status = dbStatus;
      studentProgress.solved_at = dbStatus === 'Solved' ? new Date() : null;
      studentProgress.updated_at = new Date();
      await studentProgress.save();
    } else {
      studentProgress = new StudentProgress({
        student_id: studentId,
        question_id: questionId,
        status: dbStatus,
        platform: question.platform,
        solved_at: dbStatus === 'Solved' ? new Date() : null
      });
      await studentProgress.save();
    }

    res.json({ 
      message: 'Question status updated successfully', 
      status: status // Return the frontend format
    });
  } catch (error) {
    console.error('Error updating question status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
