import { Router, Response } from 'express';
import { Script } from '../models/Script.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

const DEFAULT_CODE = `// RoboSim Default Bot Controller
// This function runs on every simulation tick.
// Input: 'sensors' object containing robot coordinates, speed, and wall scanners.
// Output: An object with 'throttle' (-1.0 to 1.0) and 'targetSteering' (steering angle in degrees).

function think(sensors) {
  // If the wall in front is closer than 120 pixels, reverse and steer away
  if (sensors.wallDistance.front < 120) {
    return {
      throttle: -0.5,
      targetSteering: -35
    };
  }
  
  // Otherwise, move forward at cruising speed
  return {
    throttle: 0.8,
    targetSteering: 0
  };
}`;

// GET /api/scripts
// List all scripts for the logged-in commander.
// If none exist, auto-seed a default.ts script.
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    let scripts = await Script.findAll({ 
      where: { userId: user.id },
      order: [['createdAt', 'ASC']]
    });

    if (scripts.length === 0) {
      const defaultScript = await Script.create({
        userId: user.id,
        name: 'default.ts',
        code: DEFAULT_CODE
      });
      scripts = [defaultScript];
    }

    res.status(200).json({ scripts });
  } catch (error) {
    console.error('Error fetching user scripts:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// POST /api/scripts
// Create a new script file.
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const { name, code } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ error: 'Script name is required.' });
      return;
    }

    const trimmedName = name.trim();
    if (!trimmedName.endsWith('.ts') && !trimmedName.endsWith('.js')) {
      res.status(400).json({ error: 'Script file must end with .ts or .js extension.' });
      return;
    }

    // Check for duplicates for this user
    const existing = await Script.findOne({
      where: {
        userId: user.id,
        name: trimmedName
      }
    });

    if (existing) {
      res.status(400).json({ error: `A script named "${trimmedName}" already exists.` });
      return;
    }

    const script = await Script.create({
      userId: user.id,
      name: trimmedName,
      code: typeof code === 'string' ? code : DEFAULT_CODE
    });

    res.status(201).json({ message: 'Script created successfully.', script });
  } catch (error) {
    console.error('Error creating script:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// PUT /api/scripts/:id
// Update a script file (modify name and/or code contents).
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const { id } = req.params;
    const { name, code } = req.body;

    const script = await Script.findOne({
      where: { id, userId: user.id }
    });

    if (!script) {
      res.status(404).json({ error: 'Script file not found.' });
      return;
    }

    if (name !== undefined) {
      const trimmedName = name.trim();
      if (trimmedName === '') {
        res.status(400).json({ error: 'Script name cannot be empty.' });
        return;
      }
      if (!trimmedName.endsWith('.ts') && !trimmedName.endsWith('.js')) {
        res.status(400).json({ error: 'Script file must end with .ts or .js extension.' });
        return;
      }

      // Check if name is being changed and duplicates exist
      if (trimmedName !== script.name) {
        const existing = await Script.findOne({
          where: {
            userId: user.id,
            name: trimmedName
          }
        });
        if (existing) {
          res.status(400).json({ error: `A script named "${trimmedName}" already exists.` });
          return;
        }
        script.name = trimmedName;
      }
    }

    if (code !== undefined) {
      script.code = code;
    }

    await script.save();
    res.status(200).json({ message: 'Script updated successfully.', script });
  } catch (error) {
    console.error('Error updating script:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// DELETE /api/scripts/:id
// Delete a script file.
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const { id } = req.params;
    const script = await Script.findOne({
      where: { id, userId: user.id }
    });

    if (!script) {
      res.status(404).json({ error: 'Script file not found.' });
      return;
    }

    await script.destroy();
    res.status(200).json({ message: 'Script deleted successfully.' });
  } catch (error) {
    console.error('Error deleting script:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

export default router;
