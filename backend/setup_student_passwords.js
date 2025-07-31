require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Student = require('./src/models/mongo/Student');

async function setupPasswords() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all students
    const students = await Student.find({});
    console.log(`Found ${students.length} students. Setting up passwords...`);

    let updatedCount = 0;

    for (const student of students) {
      // Generate password: enrollment_id + first 3 letters of name (lowercase)
      const firstName = student.name.split(' ')[0].toLowerCase();
      const password = student.enrollment_id + firstName.substring(0, 3);
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update the student with hashed password
      await Student.findByIdAndUpdate(student._id, {
        password: hashedPassword,
        updated_at: new Date()
      });

      updatedCount++;
      console.log(`${updatedCount}. ${student.name} (${student.enrollment_id}) - Password: ${password}`);
    }

    console.log(`\n✅ Successfully set up passwords for ${updatedCount} students!`);
    console.log('\nPassword format: enrollment_id + first_3_letters_of_name');
    console.log('Examples:');
    console.log('- Harshika Malhotra (2401010035) → Password: 2401010035har');
    console.log('- Aarushi (2401010001) → Password: 2401010001aar');

  } catch (error) {
    console.error('Error setting up passwords:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

setupPasswords();
