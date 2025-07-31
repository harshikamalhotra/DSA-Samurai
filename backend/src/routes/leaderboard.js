const express = require('express');
const authenticateToken = require('../middleware/auth');
const Student = require('../models/mongo/Student');
const StudentProgress = require('../models/mongo/StudentProgress');
const router = express.Router();

// Get leaderboard with student rankings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const sortBy = req.query.sortBy || 'total_solved'; // total_solved, leetcode_solved, gfg_solved, streak_count
    const limit = parseInt(req.query.limit) || 50; // Default to top 50 students
    
    // Get all students
    const students = await Student.find({}).select('name enrollment_id email leetcode_id gfg_id streak_count last_active');
    
    // Calculate stats for each student
    const leaderboardData = await Promise.all(
      students.map(async (student) => {
        // Get student's progress stats
        const totalProgress = await StudentProgress.countDocuments({ student_id: student._id, status: 'Solved' });
        const leetcodeProgress = await StudentProgress.countDocuments({ 
          student_id: student._id, 
          platform: 'LeetCode', 
          status: 'Solved' 
        });
        const gfgProgress = await StudentProgress.countDocuments({ 
          student_id: student._id, 
          platform: 'GeeksforGeeks', 
          status: 'Solved' 
        });

        return {
          id: student._id,
          name: student.name,
          enrollment_id: student.enrollment_id,
          email: student.email,
          leetcode_id: student.leetcode_id,
          gfg_id: student.gfg_id,
          total_solved: totalProgress,
          leetcode_solved: leetcodeProgress,
          gfg_solved: gfgProgress,
          streak_count: student.streak_count || 0,
          last_active: student.last_active
        };
      })
    );

    // Sort the leaderboard based on the specified criteria
    let sortedLeaderboard;
    switch (sortBy) {
      case 'leetcode_solved':
        sortedLeaderboard = leaderboardData.sort((a, b) => b.leetcode_solved - a.leetcode_solved);
        break;
      case 'gfg_solved':
        sortedLeaderboard = leaderboardData.sort((a, b) => b.gfg_solved - a.gfg_solved);
        break;
      case 'streak_count':
        sortedLeaderboard = leaderboardData.sort((a, b) => b.streak_count - a.streak_count);
        break;
      case 'name':
        sortedLeaderboard = leaderboardData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // total_solved
        sortedLeaderboard = leaderboardData.sort((a, b) => b.total_solved - a.total_solved);
    }

    // Limit the results
    const limitedLeaderboard = sortedLeaderboard.slice(0, limit);

    // Add rank to each student
    const rankedLeaderboard = limitedLeaderboard.map((student, index) => ({
      ...student,
      rank: index + 1
    }));

    res.json({
      leaderboard: rankedLeaderboard,
      total_students: students.length,
      sort_by: sortBy,
      limit: limit
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get detailed leaderboard with difficulty breakdown
router.get('/detailed', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    // Get all students
    const students = await Student.find({}).select('name enrollment_id email leetcode_id gfg_id streak_count last_active');
    
    // Calculate detailed stats for each student
    const detailedLeaderboard = await Promise.all(
      students.map(async (student) => {
        // Get all progress records for this student
        const allProgress = await StudentProgress.find({ student_id: student._id, status: 'Solved' })
          .populate('question_id');

        // Calculate platform-wise stats
        const leetcodeStats = {
          total: 0,
          easy: 0,
          medium: 0,
          hard: 0
        };
        
        const gfgStats = {
          total: 0,
          basic: 0,
          easy: 0,
          medium: 0,
          hard: 0
        };

        allProgress.forEach(progress => {
          const difficulty = progress.question_id?.difficulty?.toLowerCase() || 'unknown';
          
          if (progress.platform === 'LeetCode') {
            leetcodeStats.total++;
            if (difficulty === 'easy') leetcodeStats.easy++;
            else if (difficulty === 'medium') leetcodeStats.medium++;
            else if (difficulty === 'hard') leetcodeStats.hard++;
          } else if (progress.platform === 'GeeksforGeeks') {
            gfgStats.total++;
            if (difficulty === 'basic') gfgStats.basic++;
            else if (difficulty === 'easy') gfgStats.easy++;
            else if (difficulty === 'medium') gfgStats.medium++;
            else if (difficulty === 'hard') gfgStats.hard++;
          }
        });

        return {
          id: student._id,
          name: student.name,
          enrollment_id: student.enrollment_id,
          email: student.email,
          leetcode_id: student.leetcode_id,
          gfg_id: student.gfg_id,
          total_solved: allProgress.length,
          leetcode_stats: leetcodeStats,
          gfg_stats: gfgStats,
          streak_count: student.streak_count || 0,
          last_active: student.last_active
        };
      })
    );

    // Sort by total solved problems
    const sortedLeaderboard = detailedLeaderboard.sort((a, b) => b.total_solved - a.total_solved);
    
    // Limit and rank
    const limitedLeaderboard = sortedLeaderboard.slice(0, limit);
    const rankedLeaderboard = limitedLeaderboard.map((student, index) => ({
      ...student,
      rank: index + 1
    }));

    res.json({
      leaderboard: rankedLeaderboard,
      total_students: students.length,
      limit: limit
    });

  } catch (error) {
    console.error('Error fetching detailed leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch detailed leaderboard' });
  }
});

// Get student's rank and position
router.get('/my-rank', authenticateToken, async (req, res) => {
  try {
    const currentStudentId = req.student._id;
    
    // Get all students with their stats
    const students = await Student.find({});
    
    const studentStats = await Promise.all(
      students.map(async (student) => {
        const totalSolved = await StudentProgress.countDocuments({ 
          student_id: student._id, 
          status: 'Solved' 
        });
        
        return {
          id: student._id,
          name: student.name,
          total_solved: totalSolved
        };
      })
    );

    // Sort by total solved
    const sortedStats = studentStats.sort((a, b) => b.total_solved - a.total_solved);
    
    // Find current student's rank
    const currentStudentRank = sortedStats.findIndex(student => 
      student.id.toString() === currentStudentId.toString()
    ) + 1;

    const currentStudentStats = sortedStats.find(student => 
      student.id.toString() === currentStudentId.toString()
    );

    res.json({
      rank: currentStudentRank,
      total_students: students.length,
      problems_solved: currentStudentStats?.total_solved || 0,
      percentile: Math.round(((students.length - currentStudentRank + 1) / students.length) * 100)
    });

  } catch (error) {
    console.error('Error fetching student rank:', error);
    res.status(500).json({ error: 'Failed to fetch student rank' });
  }
});

// Get top performers (top 3)
router.get('/top-performers', authenticateToken, async (req, res) => {
  try {
    // Get all students
    const students = await Student.find({}).select('name enrollment_id leetcode_id gfg_id');
    
    const topPerformers = await Promise.all(
      students.map(async (student) => {
        const totalSolved = await StudentProgress.countDocuments({ 
          student_id: student._id, 
          status: 'Solved' 
        });
        
        return {
          id: student._id,
          name: student.name,
          enrollment_id: student.enrollment_id,
          leetcode_id: student.leetcode_id,
          gfg_id: student.gfg_id,
          total_solved: totalSolved
        };
      })
    );

    // Sort and get top 3
    const sortedPerformers = topPerformers.sort((a, b) => b.total_solved - a.total_solved);
    const top3 = sortedPerformers.slice(0, 3).map((student, index) => ({
      ...student,
      rank: index + 1
    }));

    res.json({
      top_performers: top3
    });

  } catch (error) {
    console.error('Error fetching top performers:', error);
    res.status(500).json({ error: 'Failed to fetch top performers' });
  }
});

module.exports = router;
