require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./src/models/mongo/Student');

// Test with a few students first - you can add more later
const testUsernames = {
  // Use known working API usernames for testing
  "2401010035": { leetcode_id: "malhotraharshika", gfg_id: "snuhikhv3" }, // Harshika - using working GFG username from our tests
  "2401010001": { leetcode_id: "aarushi01", gfg_id: "aarushi_gfg" }, // Aarushi - test usernames
  "2401010004": { leetcode_id: "alok_kumar", gfg_id: "alok_gfg" }, // Alok - test usernames
};

async function testPopulateUsernames() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('🧪 TEST MODE: Updating usernames for 3 students...\n');

    let updatedCount = 0;

    for (const [enrollmentId, usernames] of Object.entries(testUsernames)) {
      // Find student by enrollment ID
      const student = await Student.findOne({ enrollment_id: enrollmentId });
      
      if (student) {
        // Update the student with LeetCode and GFG usernames
        await Student.findByIdAndUpdate(student._id, {
          leetcode_id: usernames.leetcode_id,
          gfg_id: usernames.gfg_id,
          updated_at: new Date()
        });

        updatedCount++;
        console.log(`✅ Updated ${student.name} (${enrollmentId}):`);
        console.log(`   LeetCode: ${usernames.leetcode_id}`);
        console.log(`   GFG: ${usernames.gfg_id}`);
        console.log('');
      } else {
        console.log(`❌ Student not found: ${enrollmentId}`);
      }
    }

    console.log(`📊 Summary: Updated ${updatedCount} students`);
    console.log(`🎉 Test username population completed!`);

  } catch (error) {
    console.error('❌ Error populating usernames:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testPopulateUsernames();
