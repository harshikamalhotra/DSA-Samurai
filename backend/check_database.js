require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./src/models/mongo/Student');

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check existing students
    const students = await Student.find({});
    console.log(`Found ${students.length} students in database:`);
    
    students.forEach((student, index) => {
      console.log(`${index + 1}. ID: ${student._id}`);
      console.log(`   Name: ${student.name}`);
      console.log(`   Email: ${student.email}`);
      console.log(`   Enrollment ID: ${student.enrollment_id}`);
      console.log(`   LeetCode ID: ${student.leetcode_id}`);
      console.log(`   GFG ID: ${student.gfg_id}`);
      console.log('   ---');
    });

    // Show existing students
    if (students.length === 0) {
      console.log('No students found in dsa_sammurai_db database.');
      console.log('Please check if you have students in your database or if the connection string is correct.');
    } else {
      console.log(`Found ${students.length} students in your dsa_sammurai_db database.`);
    }

    return students.length > 0 ? students[0]._id : null;

  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkDatabase().then((studentId) => {
  if (studentId) {
    console.log('\nYou can now test sync with student ID:', studentId);
  }
});
