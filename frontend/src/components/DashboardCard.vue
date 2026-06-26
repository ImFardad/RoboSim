<template>
  <section class="grid-card">
    <h3>
      <span class="card-icon-wrapper" v-if="$slots.icon">
        <slot name="icon" />
      </span>
      <span>{{ title }}</span>
    </h3>
    <p>{{ desc }}</p>
    <button @click="$emit('action')" class="card-action">
      {{ actionText }}
    </button>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  desc: string;
  actionText: string;
}

defineProps<Props>();

defineEmits<{
  (e: 'action'): void;
}>();
</script>

<style scoped>
.card-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  margin-right: 8px;
}

.grid-card {
  background: var(--surface-card);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--border-glow);
  border-radius: var(--border-radius-md);
  padding: 30px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: var(--transition-smooth);
  display: flex;
  flex-direction: column;
}

.grid-card:hover {
  transform: translateY(-5px);
  border-color: var(--border-focus);
  box-shadow: 0 12px 30px rgba(79, 70, 229, 0.15);
}

.grid-card h3 {
  margin-top: 0;
  font-size: 1.3rem;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.grid-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  flex: 1;
  margin-bottom: 24px;
}

.card-action {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-glow);
  color: var(--text-primary);
  padding: 10px 20px;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-family: var(--font-family);
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  transition: var(--transition-fast);
}

.card-action:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  box-shadow: 0 0 15px var(--primary-glow);
}
</style>
