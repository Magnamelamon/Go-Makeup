import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AdminUser } from '../backend/models/AdminUser.js';

dotenv.config();

const testDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/go_makeup_db');
    
    const admin = await AdminUser.findOne({ email: 'admin@gomakeup.com' });
    console.log('Admin found in DB:', admin ? 'Yes' : 'No');
    if (admin) {
      console.log('Admin password hash:', admin.password);
      
      const isMatch = await admin.matchPassword('adminpassword');
      console.log('Password match:', isMatch ? 'Yes' : 'No');
    }
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

testDB();
