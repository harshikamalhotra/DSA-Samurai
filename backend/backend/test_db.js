const connectDB = require('./src/config/mongodb');
const Student = require('./src/models/mongo/Student');

async function testDatabase() {
  try {
    await connectDB();
    console.log('✅ Database connected successfully!');
    
    // Check if we have any students
    const studentCount = await Student.countDocuments();
    console.log(`📊 Total students in database: ${studentCount}`);
    
    if (studentCount > 0) {
      // Get a sample student (without password)
      const sampleStudent = await Student.findOne().select('-password');
      console.log('📋 Sample student data:');
      console.log(JSON.stringify(sampleStudent, null, 2));
    } else {
      console.log('ℹ️  No students found in database. You may need to populate student data.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testDatabase();
