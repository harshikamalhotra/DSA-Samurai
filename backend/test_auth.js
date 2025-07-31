const connectDB = require('./src/config/mongodb');
const Student = require('./src/models/mongo/Student');

async function testAuthentication() {
  try {
    await connectDB();
    console.log('✅ Database connected successfully!');
    
    // Get the first student to test authentication
    const student = await Student.findOne();
    
    if (!student) {
      console.log('❌ No students found in database');
      process.exit(1);
    }
    
    console.log(`🔍 Testing authentication for: ${student.name} (${student.email})`);
    console.log(`📧 Email: ${student.email}`);
    console.log(`🆔 Enrollment ID: ${student.enrollment_id}`);
    
    // Check if password exists
    if (student.password) {
      console.log('✅ Password is set for this student');
      
      // Try to test the expected password format
      const expectedPassword = student.enrollment_id + student.name.toLowerCase().substring(0, 3);
      console.log(`🔑 Expected password format: ${expectedPassword}`);
      
      const isValidPassword = await student.comparePassword(expectedPassword);
      console.log(`🔓 Password validation result: ${isValidPassword ? 'SUCCESS' : 'FAILED'}`);
      
    } else {
      console.log('❌ No password set for this student');
      console.log('💡 You may need to run the password setup script');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Authentication test failed:', error);
    process.exit(1);
  }
}

testAuthentication();
