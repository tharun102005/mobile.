import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Admin REST API backend server listening at http://localhost:${PORT}`);
  });
}

startServer();
