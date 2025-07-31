const connectDB = require('./src/config/mongodb');

async function testConnection() {
  try {
    await connectDB();
    console.log('✅ MongoDB Atlas connection successful!');
    console.log('Your database is ready to use.');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:');
    console.error(error.message);
    console.log('\n📝 Please check:');
    console.log('1. Your MONGODB_URI in .env file');
    console.log('2. MongoDB Atlas cluster is running');
    console.log('3. IP address is whitelisted in Atlas');
    console.log('4. Username and password are correct');
    process.exit(1);
  }
}

testConnection();
