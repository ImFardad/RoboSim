import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User } from '../models/User.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me_in_production';

// Helper to generate JWT
const generateToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// POST /api/auth/register
router.post('/register', async (req, res): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Simple manual validations
    if (!username || !email || !password) {
      res.status(400).json({ error: 'All fields (username, email, password) are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    // Check if user already exists (by email or username)
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: normalizedEmail },
          { username: normalizedUsername }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === normalizedUsername) {
        res.status(400).json({ error: 'Username is already taken.' });
        return;
      }
      if (existingUser.email === normalizedEmail) {
        res.status(400).json({ error: 'Email is already registered.' });
        return;
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User
    const newUser = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash
    });

    // Generate Token
    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });
  } catch (error: any) {
    console.error('Error during registration:', error);
    // Return specific validation error message if Sequelize validation fails
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ error: error.errors[0]?.message || 'Validation error.' });
      return;
    }
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res): Promise<void> => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      res.status(400).json({ error: 'Email/Username and password are required.' });
      return;
    }

    const searchKey = emailOrUsername.trim().toLowerCase();

    // Find user by either email or username
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: searchKey },
          { username: searchKey }
        ]
      }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid username/email or password.' });
      return;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid username/email or password.' });
      return;
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  res.status(200).json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    }
  });
});

export default router;
