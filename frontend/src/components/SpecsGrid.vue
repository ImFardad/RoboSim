<template>
  <div class="glass-card specs-card">
    <h2 class="section-title">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" y1="21" x2="4" y2="14"></line>
        <line x1="4" y1="10" x2="4" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12" y2="3"></line>
        <line x1="20" y1="21" x2="20" y2="16"></line>
        <line x1="20" y1="12" x2="20" y2="3"></line>
        <line x1="1" y1="14" x2="7" y2="14"></line>
        <line x1="9" y1="8" x2="15" y2="8"></line>
        <line x1="17" y1="16" x2="23" y2="16"></line>
      </svg>
      <span>{{ GLOSSARY.specsHeader }}</span>
    </h2>

    <div class="specs-grid">
      <SpecTile :label="GLOSSARY.hpStat" :value="`${hp.toFixed(2)} HP`" accent="green" />
      <SpecTile :label="GLOSSARY.weightStat" :value="`${totalWeight.toFixed(2)} kg`" />
      <SpecTile :label="GLOSSARY.enginePowerStat" :value="`${enginePower.toFixed(2)} N`" />
      <SpecTile :label="GLOSSARY.accelStat" :value="`${acceleration.toFixed(2)} m/s²`" />
      <SpecTile :label="GLOSSARY.speedStat" :value="`${topSpeed.toFixed(2)} m/s`" />
      <SpecTile :label="GLOSSARY.tasksStat" :value="`${maxTasks} Threads`" accent="cyan" />
      <SpecTile :label="GLOSSARY.steerRangeStat" :value="`±${steeringRange}°`" />
      <SpecTile :label="GLOSSARY.steerSpeedStat" :value="`${steeringSpeed}°/s`" />
      <SpecTile :label="GLOSSARY.batteryCapStat" :value="`${batteryCapacity.toLocaleString()} EU`" />
      <SpecTile :label="GLOSSARY.idleTimeStat" :value="`${idleTime.toFixed(1)} Min`" accent="cyan" />
      <SpecTile :label="GLOSSARY.moveTimeStat" :value="formattedMoveTime" span2 accent="orange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { GLOSSARY } from '../glossary';
import SpecTile from './SpecTile.vue';

defineProps<{
  hp: number;
  totalWeight: number;
  enginePower: number;
  acceleration: number;
  topSpeed: number;
  maxTasks: number;
  steeringRange: number;
  steeringSpeed: number;
  batteryCapacity: number;
  idleTime: number;
  formattedMoveTime: string;
}>();
</script>

<style scoped>
.specs-card {
  padding: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 6px;
}

.section-title svg {
  color: var(--primary-color);
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 16px;
}

@media (max-width: 480px) {
  .specs-grid {
    grid-template-columns: 1fr;
  }
  .specs-grid :deep(.span-2) {
    grid-column: span 1 !important;
  }
}
</style>
