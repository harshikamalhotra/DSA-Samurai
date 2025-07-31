require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./src/models/mongo/Student');

// Student username mapping - UPDATE THIS WITH ACTUAL USERNAMES
const studentUsernames = {
  // Format: "enrollment_id": { leetcode_id: "username", gfg_id: "username" }
  
  // Example entries - replace with actual usernames
  "2401010001": { leetcode_id: "aarushi01", gfg_id: "aarushi_gfg" },
  "2401010004": { leetcode_id: "alok_kumar", gfg_id: "alok_gfg" },
  "2401010005": { leetcode_id: "amaan_q", gfg_id: "amaan_gfg" },
  "2401010007": { leetcode_id: "aman_sharma", gfg_id: "aman_gfg" },
  "2401010008": { leetcode_id: "ambika_m", gfg_id: "ambika_gfg" },
  "2401010011": { leetcode_id: "ankan_k", gfg_id: "ankan_gfg" },
  "2401010018": { leetcode_id: "ashish_jha", gfg_id: "ashish_gfg" },
  "2401010020": { leetcode_id: "ashutosh_rai", gfg_id: "ashutosh_gfg" },
  "2401010021": { leetcode_id: "atul_kumar", gfg_id: "atul_gfg" },
  "2401010022": { leetcode_id: "avinash_k", gfg_id: "avinash_gfg" },
  "2401010023": { leetcode_id: "avirath_pawar", gfg_id: "avirath_gfg" },
  "2401010024": { leetcode_id: "ayush_c", gfg_id: "ayush_gfg" },
  "2401010026": { leetcode_id: "ayushi_c", gfg_id: "ayushi_gfg" },
  "2401010027": { leetcode_id: "badri_gupta", gfg_id: "badri_gfg" },
  "2401010029": { leetcode_id: "chirag29", gfg_id: "chirag_gfg" },
  "2401010030": { leetcode_id: "devansh_g", gfg_id: "devansh_gfg" },
  "2401010031": { leetcode_id: "dhruv31", gfg_id: "dhruv_gfg" },
  "2401010032": { leetcode_id: "esha_bajaj", gfg_id: "esha_gfg" },
  "2401010033": { leetcode_id: "ganesh_a", gfg_id: "ganesh_gfg" },
  "2401010035": { leetcode_id: "malhotraharshika", gfg_id: "harshika_gfg" }, // Already has LeetCode ID
  "2401010037": { leetcode_id: "hitesh_r", gfg_id: "hitesh_gfg" },
  "2401010038": { leetcode_id: "janvi38", gfg_id: "janvi_gfg" },
  "2401010039": { leetcode_id: "kamlesh_y", gfg_id: "kamlesh_gfg" },
  "2401010042": { leetcode_id: "uday_reddy", gfg_id: "uday_gfg" },
  "2401010043": { leetcode_id: "khushi_y", gfg_id: "khushi_gfg" },
  "2401010044": { leetcode_id: "krish_gupta", gfg_id: "krish_gfg" },
  "2401010048": { leetcode_id: "manu_kumar", gfg_id: "manu_gfg" },
  "2401010049": { leetcode_id: "masum_aktar", gfg_id: "masum_gfg" },
  "2401010050": { leetcode_id: "mayank_w", gfg_id: "mayank_gfg" },
  "2401010055": { leetcode_id: "naina_dugar", gfg_id: "naina_gfg" },
  "2401010056": { leetcode_id: "karthik_n", gfg_id: "karthik_gfg" },
  "2401010060": { leetcode_id: "niraj_roy", gfg_id: "niraj_gfg" },
  "2401010061": { leetcode_id: "nirmal_g", gfg_id: "nirmal_gfg" },
  "2401010065": { leetcode_id: "pawan_kumar", gfg_id: "pawan_gfg" },
  "2401010066": { leetcode_id: "prakhar_c", gfg_id: "prakhar_gfg" },
  "2401010068": { leetcode_id: "pratik_w", gfg_id: "pratik_gfg" },
  "2401010070": { leetcode_id: "rahul_swain", gfg_id: "rahul_gfg" },
  "2401010071": { leetcode_id: "raushan_jha", gfg_id: "raushan_gfg" },
  "2401010074": { leetcode_id: "riyanshi_t", gfg_id: "riyanshi_gfg" },
  "2401010076": { leetcode_id: "ronak_jain", gfg_id: "ronak_gfg" },
  "2401010078": { leetcode_id: "roshan_m", gfg_id: "roshan_gfg" },
  "2401010079": { leetcode_id: "roushan_g", gfg_id: "roushan_gfg" },
  "2401010081": { leetcode_id: "rupika_g", gfg_id: "rupika_gfg" },
  "2401010084": { leetcode_id: "sacchidanand_p", gfg_id: "sacchidanand_gfg" },
  "2401010086": { leetcode_id: "saiyam_kumar", gfg_id: "saiyam_gfg" },
  "2401010087": { leetcode_id: "samaksh_u", gfg_id: "samaksh_gfg" },
  "2401010088": { leetcode_id: "samruddhi_g", gfg_id: "samruddhi_gfg" },
  "2401010091": { leetcode_id: "sharad_singh", gfg_id: "sharad_gfg" }
};

async function populateUsernames() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all students
    const students = await Student.find({});
    console.log(`Found ${students.length} students. Updating usernames...`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const student of students) {
      const enrollmentId = student.enrollment_id;
      const usernames = studentUsernames[enrollmentId];

      if (usernames) {
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
      } else {
        skippedCount++;
        console.log(`⏭️  Skipped ${student.name} (${enrollmentId}) - No usernames provided`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Updated: ${updatedCount} students`);
    console.log(`⏭️  Skipped: ${skippedCount} students`);
    console.log(`\n🎉 Username population completed!`);

  } catch (error) {
    console.error('❌ Error populating usernames:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
console.log('🚀 Starting username population...');
console.log('⚠️  IMPORTANT: Make sure to update the studentUsernames object with real usernames!');
console.log('');

populateUsernames();
