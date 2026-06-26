import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, sequelize } from './db.js';
import { User } from './models/User.js';
import { Robot } from './models/Robot.js';
import authRouter from './routes/auth.js';
import robotRouter from './routes/robot.js';

// Setup associations
User.hasOne(Robot, { foreignKey: 'userId', as: 'robot' });
Robot.belongsTo(User, { foreignKey: 'userId', as: 'user' });

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// ---------- Middleware ----------
app.use(cors()); // اجازه‌ی درخواست از فرانت‌اند
app.use(express.json());

// ---------- Routes ----------
app.use('/api/auth', authRouter);
app.use('/api/robot', robotRouter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'robosim-backend',
    time: new Date().toISOString(),
  });
});

// ریشه‌ی API — فهرست مسیرهای موجود
app.get('/api', (_req, res) => {
  res.json({
    name: 'RoboSim API',
    version: '0.0.0',
    endpoints: [
      '/api/health',
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/me',
      '/api/robot'
    ],
  });
});

// ---------- Start Server & Database ----------
async function startServer() {
  // Connect to DB
  await connectDB();
  
  // Sync DB Models
  try {
    await sequelize.sync();
    console.log('✅ Database models synchronized successfully.');
  } catch (err) {
    console.error('❌ Error synchronizing database models:', err);
  }

  app.listen(PORT, () => {
    console.log(`🤖 RoboSim backend running at http://localhost:${PORT}`);
  });
}

startServer();

