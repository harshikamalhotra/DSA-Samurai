const axios = require('axios');
const { Student, Question, StudentProgress } = require('../models');

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
      console.log(`No new LeetCode submissions found for ${student.name}.`);
      return;
    }

    for (const submission of submissions) {
      const { title, titleSlug, timestamp } = submission;

      // Find or create the question in our database
      let question = await Question.findOne({ where: { title_slug: titleSlug } });
      if (!question) {
        // If the question doesn't exist, we can't get difficulty, so we skip
        // A better approach would be to fetch problem details if it doesn't exist
        console.log(`Question "${title}" not found in database. Skipping.`);
        continue;
      }

      // Check if progress for this question already exists
      const [progress, created] = await StudentProgress.findOrCreate({
        where: {
          student_id: student.id,
          question_id: question.id,
        },
        defaults: {
          status: 'Solved',
          solved_at: new Date(parseInt(timestamp, 10) * 1000),
          platform: 'LeetCode'
        }
      });

      if (created) {
        console.log(`New LeetCode progress recorded for ${student.name} - solved "${title}"`);
      } else {
        // If progress already exists, we can update it if needed (e.g., update timestamp)
        if (progress.status !== 'Solved') {
          progress.status = 'Solved';
          progress.solved_at = new Date(parseInt(timestamp, 10) * 1000);
          await progress.save();
          console.log(`Updated LeetCode progress for ${student.name} - solved "${title}"`);
        }
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
  // GFG sync logic will go here in the future
  console.log(`GeeksForGeeks sync not yet implemented for ${student.name}.`);
}


async function syncStudentById(studentId) {
  const student = await Student.findByPk(studentId);
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
