import { Router, Response } from 'express';
import { Robot } from '../models/Robot.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/robot
// Retrieves the logged-in commander's robot configuration.
// If none exists, creates a default one.
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    let robot = await Robot.findOne({ where: { userId: user.id } });

    if (!robot) {
      robot = await Robot.create({
        userId: user.id,
        bodyLevel: 1,
        batteryLevel: 1,
        brainLevel: 1,
        engineLevel: 1,
        steeringLevel: 1,
      });
    }

    res.status(200).json({ robot });
  } catch (error) {
    console.error('Error fetching robot configuration:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// PUT /api/robot
// Updates the logged-in commander's robot configuration.
router.put('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const { bodyLevel, batteryLevel, brainLevel, engineLevel, steeringLevel } = req.body;

    // Validate request inputs
    const validateRange = (val: any, min: number, max: number, name: string): string | null => {
      if (val === undefined || val === null) {
        return `${name} level is required.`;
      }
      const num = Number(val);
      if (!Number.isInteger(num) || num < min || num > max) {
        return `${name} level must be an integer between ${min} and ${max}.`;
      }
      return null;
    };

    const errs = [
      validateRange(bodyLevel, 1, 5, 'Body'),
      validateRange(batteryLevel, 1, 5, 'Battery'),
      validateRange(brainLevel, 1, 4, 'Brain'),
      validateRange(engineLevel, 1, 5, 'Engine'),
      validateRange(steeringLevel, 1, 3, 'Steering'),
    ].filter((e) => e !== null) as string[];

    if (errs.length > 0) {
      res.status(400).json({ error: errs.join(' ') });
      return;
    }

    let robot = await Robot.findOne({ where: { userId: user.id } });

    if (!robot) {
      robot = await Robot.create({
        userId: user.id,
        bodyLevel: Number(bodyLevel),
        batteryLevel: Number(batteryLevel),
        brainLevel: Number(brainLevel),
        engineLevel: Number(engineLevel),
        steeringLevel: Number(steeringLevel),
      });
    } else {
      robot.bodyLevel = Number(bodyLevel);
      robot.batteryLevel = Number(batteryLevel);
      robot.brainLevel = Number(brainLevel);
      robot.engineLevel = Number(engineLevel);
      robot.steeringLevel = Number(steeringLevel);
      await robot.save();
    }

    res.status(200).json({
      message: 'Robot configuration updated successfully.',
      robot,
    });
  } catch (error: any) {
    console.error('Error updating robot configuration:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ error: error.errors[0]?.message || 'Validation error.' });
      return;
    }
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

export default router;
