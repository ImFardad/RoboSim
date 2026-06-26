<template>
  <canvas ref="canvasRef" :width="width" :height="height" class="robot-graphic-canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  bodyLevel: number;
  brainLevel: number;
  engineLevel: number;
  steeringLevel: number;
  steeringAngle?: number; // actual front wheel steering angle in degrees
  wheelOffset?: number; // rolling tire tread pixel offset
  width?: number;
  height?: number;
  showGrid?: boolean;
  showHUD?: boolean;
  showLabels?: boolean;
  computedBatteryCapacity?: number;
  computedMaxTasks?: number;
}

const props = withDefaults(defineProps<Props>(), {
  steeringAngle: 0,
  wheelOffset: 0,
  width: 400,
  height: 400,
  showGrid: true,
  showHUD: true,
  showLabels: true,
  computedBatteryCapacity: 60000,
  computedMaxTasks: 2,
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;

function drawRobot(ctx: CanvasRenderingContext2D) {
  const w = props.width;
  const h = props.height;

  // Clear Canvas
  ctx.clearRect(0, 0, w, h);

  // 1. Draw Blueprint Tech Grid
  if (props.showGrid) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSpacing = 20;
    for (let x = 0; x < w; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw grid crosshairs in center
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    // Faint blueprint circles
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 120, 0, Math.PI * 2);
    ctx.arc(w / 2, h / 2, 175, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Draw arrow indicating front
  if (props.showLabels) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('▲ FRONT DIRECTION', w / 2, 25);
  }

  const cx = w / 2;
  const cy = h / 2;

  // Wheel Dimensions
  const wheelW = 22;
  const wheelH = 46;
  const rearY = cy + 32;
  const frontY = cy - 32;
  const rWheelsX = [cx - 90, cx + 90];
  const fWheelsX = [cx - 90, cx + 90];

  // 2. Draw Rear Wheels (Engine Power)
  rWheelsX.forEach((wheelCx) => {
    ctx.save();
    ctx.translate(wheelCx, rearY);

    // Tyre base rect
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(-wheelW / 2, -wheelH / 2, wheelW, wheelH);
    ctx.fill();
    ctx.stroke();

    // Clip elements inside tyre boundary
    ctx.clip();

    // Tread lines based on Engine Level
    if (props.engineLevel >= 3) {
      // Level 5 engine has neon-cyan treads, Levels 3-4 have grey treads
      ctx.strokeStyle = props.engineLevel === 5 ? '#06b6d4' : 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      const spacing = 12;
      const offsetStart = -wheelH / 2 - spacing;
      const offsetEnd = wheelH / 2 + spacing;
      const currentScroll = ((props.wheelOffset) % spacing + spacing) % spacing;

      for (let y = offsetStart + currentScroll; y <= offsetEnd; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(-wheelW / 2, y);
        ctx.lineTo(wheelW / 2, y);
        ctx.stroke();
      }
    }

    ctx.restore();
  });

  // 3. Draw Chassis (Body) rounded card with clipping
  const bodySize = 150;
  const radius = 16;
  ctx.save();
  ctx.translate(cx, cy);

  // Gradient based on level
  const bodyGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, bodySize / 2);
  if (props.bodyLevel <= 2) {
    bodyGrad.addColorStop(0, '#1e293b');
    bodyGrad.addColorStop(1, '#0f172a');
  } else {
    bodyGrad.addColorStop(0, '#0f172a');
    bodyGrad.addColorStop(1, '#020617');
  }

  // Draw rounded base
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = props.bodyLevel === 5 ? '#06b6d4' : 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = props.bodyLevel >= 4 ? 3 : 2;

  ctx.beginPath();
  ctx.roundRect(-bodySize / 2, -bodySize / 2, bodySize, bodySize, radius);
  ctx.fill();
  ctx.stroke();

  // Save for clipped inner rendering
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(-bodySize / 2, -bodySize / 2, bodySize, bodySize, radius);
  ctx.clip(); // Restrict drawings to rounded chassis interior

  if (props.bodyLevel >= 2) {
    // Inner frame detail
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-bodySize / 2 + 10, -bodySize / 2 + 10, bodySize - 20, bodySize - 20, radius - 4);
    ctx.stroke();
  }

  if (props.bodyLevel >= 4) {
    // Carbon fiber armor texture stripes (perfectly rounded because of clip)
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
    ctx.lineWidth = 4;
    for (let offset = -1.5 * bodySize; offset < bodySize; offset += 16) {
      ctx.beginPath();
      ctx.moveTo(offset, -bodySize / 2);
      ctx.lineTo(offset + bodySize, bodySize / 2);
      ctx.stroke();
    }
  }

  if (props.bodyLevel === 5) {
    // Neon glow line inside
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 8;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-bodySize / 2 + 6, -bodySize / 2 + 6, bodySize - 12, bodySize - 12, radius - 2);
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow
  }

  ctx.restore(); // Restore clipped space
  ctx.restore(); // Restore translation

  // 4. Draw Front Wheels (Steering) - Rotated by steeringAngle with clipping
  fWheelsX.forEach((wheelCx) => {
    ctx.save();
    ctx.translate(wheelCx, frontY);
    ctx.rotate((props.steeringAngle * Math.PI) / 180);

    // Tyre base rect
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(-wheelW / 2, -wheelH / 2, wheelW, wheelH);
    ctx.fill();
    ctx.stroke();

    // Clip to tyre bounds
    ctx.clip();

    // Tread lines based on Steering Level
    if (props.steeringLevel >= 2) {
      // Level 3 steering has neon treads, Level 2 has grey treads, Level 1 has none
      ctx.strokeStyle = props.steeringLevel === 3 ? '#06b6d4' : 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      const spacing = 12;
      const offsetStart = -wheelH / 2 - spacing;
      const offsetEnd = wheelH / 2 + spacing;
      const currentScroll = ((props.wheelOffset) % spacing + spacing) % spacing;

      for (let y = offsetStart + currentScroll; y <= offsetEnd; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(-wheelW / 2, y);
        ctx.lineTo(wheelW / 2, y);
        ctx.stroke();
      }
    }

    ctx.restore();
  });

  // 5. Draw Brain Processor (Centered, pulsing core)
  const brainRadius = 22;
  ctx.save();
  ctx.translate(cx, cy);

  // Circuit connections
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  const pulseIntensity = 0.4 + 0.4 * Math.sin(performance.now() / 200);

  // Connection line drawing function with fade-in / fade-out traveling dots
  const drawTrack = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Glowing dot traveling on line
    const t = (performance.now() % 1500) / 1500;
    const px = x1 + (x2 - x1) * t;
    const py = y1 + (y2 - y1) * t;

    // Smooth fade-in at the start (t < 0.2) and fade-out at the end (t > 0.8)
    let opacity = 1;
    if (t < 0.2) {
      opacity = t / 0.2;
    } else if (t > 0.8) {
      opacity = (1 - t) / 0.2;
    }

    ctx.fillStyle = `rgba(6, 182, 212, ${opacity * pulseIntensity})`;
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fill();
  };

  // Level 1: 2 paths (Up and Down)
  if (props.brainLevel >= 1) {
    drawTrack(0, -brainRadius, 0, -bodySize / 2 + 10);
    drawTrack(0, brainRadius, 0, bodySize / 2 - 10);
  }
  // Level 2: +1 path (3 total)
  if (props.brainLevel >= 2) {
    drawTrack(brainRadius * 0.8, -brainRadius * 0.6, bodySize / 2 - 10, -bodySize / 2 + 10);
  }
  // Level 3: +1 path (4 total)
  if (props.brainLevel >= 3) {
    drawTrack(-brainRadius, 0, -bodySize / 2 + 10, 0);
  }
  // Level 4: +1 path (5 total) + circular neon bus tracks
  if (props.brainLevel >= 4) {
    drawTrack(brainRadius, 0, bodySize / 2 - 10, 0);
    
    // Outer processor bus ring
    ctx.strokeStyle = `rgba(6, 182, 212, ${pulseIntensity * 0.3})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, brainRadius + 12, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Microprocessor Square Chip body
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-20, -20, 40, 40, 4);
  ctx.fill();
  ctx.stroke();

  // Central glowing core
  ctx.fillStyle = `rgba(6, 182, 212, ${0.4 + pulseIntensity * 0.4})`;
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0; // reset shadow

  ctx.restore();

  // 6. Draw HUD overlays
  if (props.showHUD) {
    ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SYS_STEER: ${Math.round(props.steeringAngle)} DEG`, 15, h - 25);
    ctx.fillText(`SYS_BODY_LVL: ${props.bodyLevel}`, 15, h - 12);
    ctx.textAlign = 'right';
    ctx.fillText(`BAT_CAP: ${props.computedBatteryCapacity} EU`, w - 15, h - 25);
    ctx.fillText(`THR_MAX: ${props.computedMaxTasks} LNK`, w - 15, h - 12);
  }
}

function renderLoop() {
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d');
    if (ctx) {
      drawRobot(ctx);
    }
  }
  animationFrameId = requestAnimationFrame(renderLoop);
}

// ---------------- Lifecycle Hooks ----------------

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
.robot-graphic-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
