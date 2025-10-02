const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MONGODB_ATLAS_URL을 우선적으로 사용하고, 없으면 로컬 MongoDB 사용
    const mongoURI = process.env.MONGODB_ATLAS_URL || 'mongodb://localhost:27017/shopping-mall';
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB 연결됨: ${conn.connection.host}`);
    console.log(`연결 타입: ${process.env.MONGODB_ATLAS_URL ? 'Atlas (클라우드)' : 'Local'}`);
  } catch (error) {
    console.error('MongoDB 연결 실패:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
