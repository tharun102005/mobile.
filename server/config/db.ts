import mongoose from 'mongoose';

export async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/omnisense_pwa';
  
  try {
    // Set connection timeout to 3 seconds for fast fallback if local MongoDB is inactive
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('MongoDB connected successfully to:', mongoURI);
    return true;
  } catch (err) {
    console.warn('MongoDB connection unavailable. Operating in high-performance In-Memory Fallback Mode.');
    return false;
  }
}
