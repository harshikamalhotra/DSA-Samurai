const axios = require('axios');
const Student = require('../models/mongo/Student');
const Question = require('../models/mongo/Question');
const StudentProgress = require('../models/mongo/StudentProgress');

const LEETCODE_API_URL = 'https://alfa-leetcode-api.onrender.com';

async function syncLeetCode(student) {
  if (!student.leetcode_id) {
    console.log(`Skipping LeetCode sync for ${student.name} - no LeetCode ID.`);
    return;
  }

  try {
    const response = await axios.get(`${LEETCODE_API_URL}/${student.leetcode_id}/acSubmission?limit=50`);
    const submissions = response.data.submission;

    if (!submissions || submissions.length === 0) {
      console.log(`No LeetCode submissions found for ${student.name}.`);
      return;
    }

    for (const submission of submissions) {
      const { title, titleSlug, timestamp, lang } = submission;

      // Find or create the question in our database
      let question = await Question.findOne({ platform: 'LeetCode', title_slug: titleSlug });
      if (!question) {
        // Create new question if it doesn't exist
        question = new Question({
          title,
          title_slug: titleSlug,
          difficulty: 'Medium', // Default difficulty, can be updated later
          platform: 'LeetCode',
          question_url: `https://leetcode.com/problems/${titleSlug}`
        });
        await question.save();
        console.log(`New LeetCode question saved: ${title}`);
      }

      // Check if progress for this question already exists
      const existingProgress = await StudentProgress.findOne({
        student_id: student._id,
        question_id: question._id
      });

      if (!existingProgress) {
        const newProgress = new StudentProgress({
          student_id: student._id,
          question_id: question._id,
          status: 'Solved',
          solved_at: new Date(parseInt(timestamp, 10) * 1000),
          platform: 'LeetCode',
          programming_language: lang
        });
        await newProgress.save();
        console.log(`New LeetCode progress recorded for ${student.name} - solved "${title}"`);
      } else if (existingProgress.status !== 'Solved') {
        existingProgress.status = 'Solved';
        existingProgress.solved_at = new Date(parseInt(timestamp, 10) * 1000);
        existingProgress.programming_language = lang;
        await existingProgress.save();
        console.log(`Updated LeetCode progress for ${student.name} - solved "${title}"`);
      }
    }

  } catch (error) {
    console.error(`Error syncing LeetCode for ${student.name}:`, error.message);
  }
}

async function syncGeeksForGeeks(student) {
  if (!student.gfg_id) {
    console.log(`Skipping GeeksForGeeks sync for ${student.name} - no GFG ID.`);
    return;
  }

  try {
    const response = await axios.get(`https://geeks-for-geeks-api.vercel.app/${student.gfg_id}`);
    const solvedStats = response.data.solvedStats;

    if (!solvedStats || !solvedStats.basic || solvedStats.basic.count === 0) {
      console.log(`No new GFG submissions found for ${student.name}.`);
      return;
    }

    for (const question of solvedStats.basic.questions) {
      const { question: title, questionUrl: titleSlug } = question;

      let dbQuestion = await Question.findOne({ platform: 'GeeksforGeeks', title_slug: titleSlug });
      if (!dbQuestion) {
        dbQuestion = new Question({
          title,
          title_slug: titleSlug,
          difficulty: 'Basic',
          platform: 'GeeksforGeeks',
          question_url: titleSlug
        });
        await dbQuestion.save();
        console.log(`New GFG question saved: ${title}`);
      }

      const progress = await StudentProgress.findOne({ student_id: student._id, question_id: dbQuestion._id });
      if (!progress) {
        const newProgress = new StudentProgress({
          student_id: student._id,
          question_id: dbQuestion._id,
          status: 'Solved',
          platform: 'GeeksforGeeks',
          solved_at: new Date()
        });
        await newProgress.save();
        console.log(`New GFG progress recorded for ${student.name} - solved "${title}"`);
      }
    }
  } catch (error) {
    console.error(`Error syncing GeeksForGeeks for ${student.name}:`, error.message);
  }
}


async function syncStudentById(studentId) {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new Error('Student not found');
  }

  console.log(`Starting sync for student: ${student.name}`);

  await syncLeetCode(student);
  await syncGeeksForGeeks(student);

  console.log(`Sync finished for student: ${student.name}`);
  return { message: 'Sync completed successfully' };
}

module.exports = {
  syncStudentById,
};
