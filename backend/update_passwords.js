const mongoose = require('mongoose');
const Student = require('./src/models/mongo/Student');
const connectDB = require('./src/config/mongodb');

async function updateStudentPasswords() {
  try {
    await connectDB();
    console.log('Connected to MongoDB Atlas');

    // Get all students
    const students = await Student.find({});
    console.log(`Found ${students.length} students to update`);

    for (const student of students) {
      // Get first 3 letters of name (lowercase)
      const namePrefix = student.name.split(' ')[0].substring(0, 3).toLowerCase();
      
      // Generate new password: enrollment_id + first 3 letters of name
      const newPassword = student.enrollment_id + namePrefix;

      // Update student password
      student.password = newPassword; // Will be hashed by the pre-save hook
      await student.save();
      
      console.log(`✅ Updated password for ${student.name}:`);
      console.log(`   Email: ${student.email}`);
      console.log(`   New Password: ${newPassword}`);
      console.log(`   Enrollment ID: ${student.enrollment_id}`);
      console.log('---');
    }

    console.log('\n🎉 All student passwords updated!');
    console.log('\n📋 Login Instructions for Students:');
    console.log('- Email: Use your student email address');  
    console.log('- Password: Your enrollment ID + first 3 letters of your first name');
    console.log('- Example: Harshika with enrollment 2401010035 → password: 2401010035har');
    console.log('- Students can change their password after first login');

    process.exit(0);
  } catch (error) {
    console.error('Error updating passwords:', error);
    process.exit(1);
  }
}

updateStudentPasswords();
