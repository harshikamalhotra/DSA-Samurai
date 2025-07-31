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

    // If no students exist, create a test student
    if (students.length === 0) {
      console.log('No students found. Creating test student...');
      
      const testStudent = new Student({
        name: 'Test Student',
        enrollment_id: '2401010999',
        email: 'test@example.com',
        leetcode_id: 'Cpj9QpiECB', // Using the example from the API test
        gfg_id: 'snuhikhv3', // Using the example from the API test
        phone: '+1234567890',
        password: '2401010999tes' // enrollment_id + first 3 letters of name
      });

      await testStudent.save();
      console.log('Test student created with ID:', testStudent._id);
      return testStudent._id;
    }

    return students[0]._id; // Return first student ID for testing

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
