import { Sequelize } from 'sequelize';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DB_STORAGE || path.join(process.cwd(), 'database.sqlite');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
  define: {
    timestamps: true, // Automatically add createdAt and updatedAt
  },
});

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite Database connected successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the SQLite database:', error);
    process.exit(1);
  }
}
