const mongoose = require('mongoose');
const Student = require('./src/models/mongo/Student');
const connectDB = require('./src/config/mongodb');

async function addCredentialsToStudents() {
  try {
    await connectDB();
    console.log('Connected to MongoDB Atlas');

    // Get all students who don't have username/password
    const studentsWithoutCredentials = await Student.find({
      $or: [
        { username: { $exists: false } },
        { password: { $exists: false } }
      ]
    });

    console.log(`Found ${studentsWithoutCredentials.length} students without credentials`);

    for (const student of studentsWithoutCredentials) {
      // Generate username from enrollment_id (e.g., 2401010001 -> student001)
      const username = `student${student.enrollment_id.slice(-3)}`;
      
      // Generate default password (enrollment_id + "123")
      const defaultPassword = student.enrollment_id + '123';

      // Update student with new fields
      student.username = username;
      student.password = defaultPassword; // Will be hashed by the pre-save hook
      
      await student.save();
      
      console.log(`✅ Added credentials for ${student.name}:`);
      console.log(`   Username: ${username}`);
      console.log(`   Password: ${defaultPassword}`);
      console.log(`   Enrollment ID: ${student.enrollment_id}`);
      console.log('---');
    }

    console.log('🎉 All students now have login credentials!');
    console.log('\n📋 Login Instructions for Students:');
    console.log('- Username: Use either your assigned username (studentXXX) OR your enrollment ID');
    console.log('- Password: Your enrollment ID + "123" (e.g., 2401010001123)');
    console.log('- Students can change their password after first login');

    process.exit(0);
  } catch (error) {
    console.error('Error adding credentials:', error);
    process.exit(1);
  }
}

addCredentialsToStudents();
