<script setup lang="ts">
import { ref } from 'vue'

const apiStatus = ref<'idle' | 'ok' | 'fail'>('idle')
const checking = ref(false)

async function checkApi() {
  checking.value = true
  apiStatus.value = 'idle'
  try {
    const res = await fetch('http://localhost:3000/api/health')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    apiStatus.value = 'ok'
  } catch {
    apiStatus.value = 'fail'
  } finally {
    checking.value = false
  }
}
</script>

<template>
  <header class="hero">
    <h1 class="title">🤖 RoboSim</h1>
    <p class="subtitle">محیط شبیه‌سازی مسابقات ربات‌های برنامه‌نویسی‌شونده</p>
  </header>

  <section class="status">
    <button class="btn" :disabled="checking" @click="checkApi">
      {{ checking ? 'در حال بررسی…' : 'بررسی اتصال به سرور' }}
    </button>
    <p v-if="apiStatus === 'ok'" class="ok">✅ سرور آنلاین است</p>
    <p v-else-if="apiStatus === 'fail'" class="fail">
      ❌ سرور در دسترس نیست — آیا backend روی پورت ۳۰۰۰ اجرا شده؟
    </p>
  </section>
</template>

<style scoped>
.hero {
  margin-bottom: 2rem;
}

.title {
  font-size: 3rem;
  margin: 0;
}

.subtitle {
  color: #888;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border: 1px solid #42b883;
  background: transparent;
  color: #42b883;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover:not(:disabled) {
  background: #42b883;
  color: #fff;
}

.btn:disabled {
  opacity: 0.5;
  cursor: progress;
}

.ok {
  color: #42b883;
  margin-top: 1rem;
}

.fail {
  color: #e8554e;
  margin-top: 1rem;
}
</style>
