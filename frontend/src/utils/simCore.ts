// RoboSim Physics & Simulation Engine (sim-core)
// Key features: Decoupled, deterministic tick loop, kinematic calculations, raycast distance sensors.

export interface RobotLevels {
  bodyLevel: number;
  batteryLevel: number;
  brainLevel: number;
  engineLevel: number;
  steeringLevel: number;
}

export interface SimState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  heading: number; // degrees, 0-360
  steeringAngle: number; // degrees
  hp: number;
  battery: number;
  // Inputs
  throttle: number;
  targetSteering: number;
}

export interface SensorData {
  x: number;
  y: number;
  speed: number;
  heading: number;
  steeringAngle: number;
  hp: number;
  battery: number;
  maxBattery: number;
  wallDistance: {
    front: number;
    back: number;
    left: number;
    right: number;
  };
}

export interface CollisionEvent {
  impactSpeed: number;
  acceleration: number;
  damage: number;
  wall: string;
}

export class RobotSimulation {
  // Dimensions of the large virtual arena
  public readonly arenaWidth = 1000;
  public readonly arenaHeight = 1000;
  public readonly halfSize = 35; // Robot bounding box half size
  public readonly wheelbase = 60; // Distance between front and rear axle

  // Physics constants
  private readonly friction = 1.2; // Linear damping speed friction

  // Robot spec parameters derived from levels
  public readonly maxHP: number;
  public readonly maxBattery: number;
  public readonly enginePower: number;
  public readonly steeringRange: number;
  public readonly steeringSpeed: number;
  public readonly totalWeight: number;

  // Current simulation state
  public state: SimState;

  // Collisions log for event emitting
  public onCollision?: (event: CollisionEvent) => void;

  constructor(levels: RobotLevels) {
    // 1. Calculate Body Specs
    this.maxHP = 100 * (1 + (levels.bodyLevel - 1) * 0.20);
    const bodyWeight = 50 * Math.pow(1.10, levels.bodyLevel - 1);

    // 2. Calculate Battery Specs
    this.maxBattery = 60000 * (1 + (levels.batteryLevel - 1) * 0.25);
    const batteryWeight = 10 * Math.pow(1.15, levels.batteryLevel - 1);

    // 3. Calculate Engine & Steering Specs
    this.enginePower = 100 * (1 + (levels.engineLevel - 1) * 0.05);
    
    if (levels.steeringLevel === 3) {
      this.steeringRange = 80;
      this.steeringSpeed = 90;
    } else if (levels.steeringLevel === 2) {
      this.steeringRange = 70;
      this.steeringSpeed = 65;
    } else {
      this.steeringRange = 60;
      this.steeringSpeed = 45;
    }

    // Fixed parts weight (Engine: 5kg, Steering: 5kg, Brain: 2kg, Sensors: 3kg = 15kg total)
    this.totalWeight = bodyWeight + batteryWeight + 15;

    // Initialize State (Spawn robot at the center facing upwards)
    this.state = {
      x: 500,
      y: 500,
      vx: 0,
      vy: 0,
      speed: 0,
      heading: 270, // Facing North
      steeringAngle: 0,
      hp: this.maxHP,
      battery: this.maxBattery,
      throttle: 0,
      targetSteering: 0
    };
  }

  // Reset simulation state
  public reset() {
    this.state = {
      x: 500,
      y: 500,
      vx: 0,
      vy: 0,
      speed: 0,
      heading: 270,
      steeringAngle: 0,
      hp: this.maxHP,
      battery: this.maxBattery,
      throttle: 0,
      targetSteering: 0
    };
  }

  // Advances simulation by dt seconds
  public step(dt: number, throttle: number, targetSteering: number) {
    if (this.state.hp <= 0) {
      this.state.speed = 0;
      this.state.vx = 0;
      this.state.vy = 0;
      return;
    }

    // 1. Clamp Inputs
    const clampedThrottle = Math.max(-1.0, Math.min(1.0, throttle));
    const clampedTargetSteering = Math.max(-this.steeringRange, Math.min(this.steeringRange, targetSteering));

    this.state.throttle = clampedThrottle;
    this.state.targetSteering = clampedTargetSteering;

    // If battery is dead, no engine power (throttle is forced to 0)
    const activeThrottle = this.state.battery > 0 ? clampedThrottle : 0;

    // 2. Update Steering Angle towards Target Steering Angle at Steering Speed
    const diff = clampedTargetSteering - this.state.steeringAngle;
    if (Math.abs(diff) > 0.01) {
      const step = Math.sign(diff) * this.steeringSpeed * dt;
      if (Math.abs(step) >= Math.abs(diff)) {
        this.state.steeringAngle = clampedTargetSteering;
      } else {
        this.state.steeringAngle += step;
      }
    }

    // 3. Acceleration & Speed physics (using mass and engine output force)
    // Scale force multiplier to translate standard N forces into nice pixel speeds
    const forceMultiplier = 160; 
    const engineForce = activeThrottle * this.enginePower * forceMultiplier;
    
    // a = F/m - friction * speed
    const accel = (engineForce / this.totalWeight) - (this.friction * this.state.speed);
    
    // Update speed
    const prevSpeed = this.state.speed;
    this.state.speed += accel * dt;

    // 4. Update heading rotation using bicycle kinematic equations
    // dHeading/dt = speed * sin(steer) / wheelbase
    const steerRad = (this.state.steeringAngle * Math.PI) / 180;
    const rotationRate = (this.state.speed * Math.sin(steerRad)) / this.wheelbase; // radians/sec
    this.state.heading += rotationRate * dt * (180 / Math.PI); // Convert to degrees
    
    // Normalize heading to [0, 360)
    this.state.heading = (this.state.heading % 360 + 360) % 360;

    // 5. Update Position coordinates
    const headingRad = (this.state.heading * Math.PI) / 180;
    this.state.vx = this.state.speed * Math.cos(headingRad);
    this.state.vy = this.state.speed * Math.sin(headingRad);

    this.state.x += this.state.vx * dt;
    this.state.y += this.state.vy * dt;

    // 6. Energy Consumption (Idle + Engine + Steering servo transient)
    const idlePower = 20; // 20 EU/s
    const enginePower = 280 * (1 + (activeThrottle !== 0 ? 0.05 : 0)) * Math.abs(activeThrottle);
    const steeringPower = Math.abs(diff) > 0.5 ? 30 : 0;
    const totalPower = idlePower + enginePower + steeringPower;

    this.state.battery = Math.max(0, this.state.battery - totalPower * dt);

    // 7. Wall Collision checks
    this.checkWallCollisions(prevSpeed, accel);
  }

  // Calculate distance to wall along a ray at a specific angle
  private castRay(angleDegrees: number): number {
    const angleRad = (angleDegrees * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);

    let minDist = Infinity;

    // Left wall: x + d * cos = 0 -> d = -x / cos
    if (Math.abs(cos) > 0.0001) {
      const dLeft = -this.state.x / cos;
      if (dLeft >= 0) {
        const yHit = this.state.y + dLeft * sin;
        if (yHit >= 0 && yHit <= this.arenaHeight) {
          minDist = Math.min(minDist, dLeft);
        }
      }

      // Right wall: x + d * cos = Width -> d = (Width - x) / cos
      const dRight = (this.arenaWidth - this.state.x) / cos;
      if (dRight >= 0) {
        const yHit = this.state.y + dRight * sin;
        if (yHit >= 0 && yHit <= this.arenaHeight) {
          minDist = Math.min(minDist, dRight);
        }
      }
    }

    // Top wall: y + d * sin = 0 -> d = -y / sin
    if (Math.abs(sin) > 0.0001) {
      const dTop = -this.state.y / sin;
      if (dTop >= 0) {
        const xHit = this.state.x + dTop * cos;
        if (xHit >= 0 && xHit <= this.arenaWidth) {
          minDist = Math.min(minDist, dTop);
        }
      }

      // Bottom wall: y + d * sin = Height -> d = (Height - y) / sin
      const dBottom = (this.arenaHeight - this.state.y) / sin;
      if (dBottom >= 0) {
        const xHit = this.state.x + dBottom * cos;
        if (xHit >= 0 && xHit <= this.arenaWidth) {
          minDist = Math.min(minDist, dBottom);
        }
      }
    }

    return minDist;
  }

  // Computes the sensor state passed to the user controller code
  public getSensors(): SensorData {
    return {
      x: this.state.x,
      y: this.state.y,
      speed: this.state.speed,
      heading: this.state.heading,
      steeringAngle: this.state.steeringAngle,
      hp: this.state.hp,
      battery: this.state.battery,
      maxBattery: this.maxBattery,
      wallDistance: {
        front: this.castRay(this.state.heading),
        back: this.castRay(this.state.heading + 180),
        left: this.castRay(this.state.heading - 90),
        right: this.castRay(this.state.heading + 90)
      }
    };
  }

  // Detect and resolve wall hits
  private checkWallCollisions(prevSpeed: number, accel: number) {
    let hitWall = '';
    
    // Bounds check
    if (this.state.x - this.halfSize < 0) {
      this.state.x = this.halfSize;
      hitWall = 'Left';
    } else if (this.state.x + this.halfSize > this.arenaWidth) {
      this.state.x = this.arenaWidth - this.halfSize;
      hitWall = 'Right';
    }

    if (this.state.y - this.halfSize < 0) {
      this.state.y = this.halfSize;
      hitWall = 'Top';
    } else if (this.state.y + this.halfSize > this.arenaHeight) {
      this.state.y = this.arenaHeight - this.halfSize;
      hitWall = 'Bottom';
    }

    // If we hit a wall, apply damage dependent on impact speed and acceleration, then stop
    if (hitWall) {
      const impactSpeed = Math.abs(prevSpeed);
      if (impactSpeed > 5) {
        // Damage formula dependent on velocity (impactSpeed) and acceleration (accel) at collision
        // and scaled by mass ratio of the robot
        const baseDamage = (impactSpeed * 0.15) + (Math.abs(accel) * 0.08);
        const massFactor = this.totalWeight / 75.0; // 75kg is Level 1 robot weight
        const damage = parseFloat((baseDamage * massFactor).toFixed(1));

        this.state.hp = Math.max(0, parseFloat((this.state.hp - damage).toFixed(1)));
        
        if (this.onCollision) {
          this.onCollision({
            impactSpeed,
            acceleration: accel,
            damage,
            wall: hitWall
          });
        }
      }

      this.state.speed = 0;
      this.state.vx = 0;
      this.state.vy = 0;
    }
  }
}
