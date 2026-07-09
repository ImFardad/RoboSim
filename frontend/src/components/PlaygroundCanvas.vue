<template>
  <div class="playground-canvas-container">
    <canvas ref="canvasRef" width="600" height="600" class="playground-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { SimState, RobotLevels, SensorData } from '../utils/simCore';

interface Props {
  state: SimState;
  levels: RobotLevels;
  sensors: SensorData;
}

const props = defineProps<Props>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;
let tireScrollOffset = 0;

// Draw loop
function draw(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);

  // Scale virtual coordinates (1000x1000) to actual canvas (600x600)
  const scale = w / 1000;
  ctx.save();
  ctx.scale(scale, scale);

  // 1. Draw Grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.lineWidth = 1.5;
  const gridSpacing = 100;
  for (let x = 0; x <= 1000; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1000);
    ctx.stroke();
  }
  for (let y = 0; y <= 1000; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1000, y);
    ctx.stroke();
  }

  // 2. Draw Arena Boundaries
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)'; // Red boundary glow
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, 1000, 1000);

  // 3. Draw Faint, Dashed Sensor Beams
  // Front: heading
  // Back: heading + 180
  // Left: heading - 90
  // Right: heading + 90
  const drawSensorBeam = (angleDeg: number, distance: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const startX = props.state.x;
    const startY = props.state.y;
    const endX = startX + distance * Math.cos(angleRad);
    const endY = startY + distance * Math.sin(angleRad);

    ctx.save();
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.09)'; // Very, very faint cyan
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 8]); // Dashed line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Small dot at intersection
    ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.beginPath();
    ctx.arc(endX, endY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const currentHeading = props.state.heading;
  const wDist = props.sensors.wallDistance;

  // Only draw sensors if the robot is alive
  if (props.state.hp > 0) {
    drawSensorBeam(currentHeading, wDist.front);
    drawSensorBeam(currentHeading + 180, wDist.back);
    drawSensorBeam(currentHeading - 90, wDist.left);
    drawSensorBeam(currentHeading + 90, wDist.right);
  }

  // 4. Draw the Robot translated and rotated
  ctx.save();
  ctx.translate(props.state.x, props.state.y);
  ctx.rotate(((props.state.heading - 270) * Math.PI) / 180);

  // Scale the 400px centered robot drawing to fit a ~75px footprint (scale of ~0.45)
  const robotDrawScale = 0.45;
  ctx.scale(robotDrawScale, robotDrawScale);

  drawRobotGraphic(ctx);
  ctx.restore();

  ctx.restore(); // Restore virtual scaling
}

// Centered drawing logic adapted from RobotGraphic.vue
function drawRobotGraphic(ctx: CanvasRenderingContext2D) {
  const cx = 0;
  const cy = 0;

  // Dimensions matching RobotGraphic specs
  const wheelW = 22;
  const wheelH = 46;
  const rearY = cy + 32;
  const frontY = cy - 32;
  const rWheelsX = [cx - 90, cx + 90];
  const fWheelsX = [cx - 90, cx + 90];

  // 1. Draw Rear Wheels (Engine Power)
  rWheelsX.forEach((wheelCx) => {
    ctx.save();
    ctx.translate(wheelCx, rearY);

    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(-wheelW / 2, -wheelH / 2, wheelW, wheelH);
    ctx.fill();
    ctx.stroke();

    ctx.clip();

    // Tread lines
    if (props.levels.engineLevel >= 3) {
      ctx.strokeStyle = props.levels.engineLevel === 5 ? '#06b6d4' : 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      const spacing = 12;
      const currentScroll = (tireScrollOffset % spacing + spacing) % spacing;

      for (let y = -wheelH / 2 - spacing + currentScroll; y <= wheelH / 2 + spacing; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(-wheelW / 2, y);
        ctx.lineTo(wheelW / 2, y);
        ctx.stroke();
      }
    }
    ctx.restore();
  });

  // 2. Draw Chassis (Body)
  const bodySize = 150;
  const radius = 16;
  ctx.save();
  ctx.translate(cx, cy);

  const bodyGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, bodySize / 2);
  if (props.levels.bodyLevel <= 2) {
    bodyGrad.addColorStop(0, '#1e293b');
    bodyGrad.addColorStop(1, '#0f172a');
  } else {
    bodyGrad.addColorStop(0, '#0f172a');
    bodyGrad.addColorStop(1, '#020617');
  }

  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = props.levels.bodyLevel === 5 ? '#06b6d4' : 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = props.levels.bodyLevel >= 4 ? 3 : 2;

  ctx.beginPath();
  ctx.roundRect(-bodySize / 2, -bodySize / 2, bodySize, bodySize, radius);
  ctx.fill();
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(-bodySize / 2, -bodySize / 2, bodySize, bodySize, radius);
  ctx.clip();

  if (props.levels.bodyLevel >= 2) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-bodySize / 2 + 10, -bodySize / 2 + 10, bodySize - 20, bodySize - 20, radius - 4);
    ctx.stroke();
  }

  if (props.levels.bodyLevel >= 4) {
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
    ctx.lineWidth = 4;
    for (let offset = -1.5 * bodySize; offset < bodySize; offset += 16) {
      ctx.beginPath();
      ctx.moveTo(offset, -bodySize / 2);
      ctx.lineTo(offset + bodySize, bodySize / 2);
      ctx.stroke();
    }
  }

  if (props.levels.bodyLevel === 5) {
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 8;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-bodySize / 2 + 6, -bodySize / 2 + 6, bodySize - 12, bodySize - 12, radius - 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  ctx.restore();
  ctx.restore();

  // 3. Draw Front Wheels (Steering rotated)
  fWheelsX.forEach((wheelCx) => {
    ctx.save();
    ctx.translate(wheelCx, frontY);
    ctx.rotate((props.state.steeringAngle * Math.PI) / 180);

    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(-wheelW / 2, -wheelH / 2, wheelW, wheelH);
    ctx.fill();
    ctx.stroke();

    ctx.clip();

    if (props.levels.steeringLevel >= 2) {
      ctx.strokeStyle = props.levels.steeringLevel === 3 ? '#06b6d4' : 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      const spacing = 12;
      const currentScroll = (tireScrollOffset % spacing + spacing) % spacing;

      for (let y = -wheelH / 2 - spacing + currentScroll; y <= wheelH / 2 + spacing; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(-wheelW / 2, y);
        ctx.lineTo(wheelW / 2, y);
        ctx.stroke();
      }
    }
    ctx.restore();
  });

  // 4. Draw Brain Core (Pulsing central chip)
  const brainRadius = 22;
  ctx.save();
  ctx.translate(cx, cy);

  const pulseIntensity = 0.4 + 0.4 * Math.sin(performance.now() / 200);

  const drawTrackLine = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Traveling dot
    const t = (performance.now() % 1500) / 1500;
    const px = x1 + (x2 - x1) * t;
    const py = y1 + (y2 - y1) * t;
    const opacity = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;

    ctx.fillStyle = `rgba(6, 182, 212, ${opacity * pulseIntensity})`;
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fill();
  };

  if (props.levels.brainLevel >= 1) {
    drawTrackLine(0, -brainRadius, 0, -bodySize / 2 + 10);
    drawTrackLine(0, brainRadius, 0, bodySize / 2 - 10);
  }
  if (props.levels.brainLevel >= 2) {
    drawTrackLine(brainRadius * 0.8, -brainRadius * 0.6, bodySize / 2 - 10, -bodySize / 2 + 10);
  }
  if (props.levels.brainLevel >= 3) {
    drawTrackLine(-brainRadius, 0, -bodySize / 2 + 10, 0);
  }
  if (props.levels.brainLevel >= 4) {
    drawTrackLine(brainRadius, 0, bodySize / 2 - 10, 0);
    
    ctx.strokeStyle = `rgba(6, 182, 212, ${pulseIntensity * 0.3})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, brainRadius + 12, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-20, -20, 40, 40, 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = `rgba(6, 182, 212, ${0.4 + pulseIntensity * 0.4})`;
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

function renderLoop() {
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d');
    if (ctx) {
      // Accumulate wheel offset when moving
      if (props.state.speed !== 0) {
        tireScrollOffset -= props.state.speed * 0.05;
      }
      draw(ctx, canvasRef.value.width, canvasRef.value.height);
    }
  }
  animationFrameId = requestAnimationFrame(renderLoop);
}

onMounted(() => {
  renderLoop();
});

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
.playground-canvas-container {
  background: radial-gradient(circle at center, rgba(16, 24, 48, 0.7) 0%, rgba(5, 8, 16, 0.95) 100%);
  border: 1px solid var(--border-glow);
  border-radius: var(--border-radius-md);
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(6, 182, 212, 0.03);
  position: relative;
  overflow: hidden;
}

.playground-canvas {
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1 / 1;
  display: block;
  border-radius: var(--border-radius-sm);
  background: transparent;
}
</style>
