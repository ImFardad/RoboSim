<template>
  <div class="auth-wrapper">
    <GlassCard>
      <h2 class="auth-title">عضویت در RoboSim</h2>
      <p class="auth-subtitle">حساب کاربری خود را بسازید و نبرد ربات‌ها را شروع کنید</p>

      <BaseAlert type="danger" :message="authError" />

      <form @submit.prevent="handleRegister">
        <BaseInput
          id="username"
          v-model="username"
          label="نام کاربری"
          placeholder="مثال: fardad (فقط حروف و اعداد)"
          required
          :disabled="isLoading"
          :errorMsg="username && !isUsernameValid ? 'نام کاربری باید فقط شامل حروف و اعداد انگلیسی باشد (بین ۳ تا ۳۰ کاراکتر).' : ''"
        />

        <BaseInput
          id="email"
          v-model="email"
          type="email"
          label="ایمیل"
          placeholder="fardad@example.com"
          required
          :disabled="isLoading"
          :errorMsg="email && !isEmailValid ? 'لطفاً یک ایمیل معتبر وارد کنید.' : ''"
        />

        <BaseInput
          id="password"
          v-model="password"
          type="password"
          label="رمز عبور"
          placeholder="•••••••• (حداقل ۶ کاراکتر)"
          required
          :disabled="isLoading"
        />
        
        <!-- Password strength indicators -->
        <div v-if="password" style="margin-top: -10px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
          <div style="flex: 1; height: 4px; border-radius: 2px; background-color: rgba(255,255,255,0.1); overflow: hidden;">
            <div :style="{ width: strengthPercent + '%', backgroundColor: strengthColor }" style="height: 100%; transition: width 0.3s ease;"></div>
          </div>
          <span :style="{ color: strengthColor }" style="font-size: 0.8rem; font-weight: 600;">
            {{ strengthText }}
          </span>
        </div>

        <BaseInput
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          label="تکرار رمز عبور"
          placeholder="••••••••"
          required
          :disabled="isLoading"
          :errorMsg="confirmPassword && !isPasswordMatch ? 'تکرار رمز عبور مطابقت ندارد.' : ''"
        />

        <BaseButton
          text="ایجاد حساب کاربری"
          loadingText="در حال ثبت‌نام..."
          :isLoading="isLoading"
          :disabled="!isFormValid"
        />
      </form>

      <div class="auth-footer">
        <span>قبلاً ثبت‌نام کرده‌اید؟</span>
        <router-link to="/login" class="auth-link">ورود به حساب</router-link>
      </div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../utils/auth';
import GlassCard from '../components/GlassCard.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import BaseAlert from '../components/BaseAlert.vue';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const router = useRouter();
const { register, isLoading, authError } = useAuth();

// Input Validations
const isUsernameValid = computed(() => {
  const reg = /^[a-zA-Z0-9]{3,30}$/;
  return reg.test(username.value);
});

const isEmailValid = computed(() => {
  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return reg.test(email.value);
});

const isPasswordMatch = computed(() => {
  return password.value === confirmPassword.value;
});

// Password strength calculation
const strengthPercent = computed(() => {
  let score = 0;
  if (!password.value) return 0;
  if (password.value.length >= 6) score += 30;
  if (password.value.length >= 10) score += 20;
  if (/[A-Z]/.test(password.value)) score += 25;
  if (/[0-9]/.test(password.value)) score += 15;
  if (/[^A-Za-z0-9]/.test(password.value)) score += 10;
  return score;
});

const strengthColor = computed(() => {
  const pct = strengthPercent.value;
  if (pct < 30) return 'var(--error-color)';
  if (pct < 60) return '#eab308'; // Yellow
  if (pct < 85) return '#3b82f6'; // Blue
  return 'var(--success-color)';
});

const strengthText = computed(() => {
  const pct = strengthPercent.value;
  if (pct === 0) return '';
  if (pct < 30) return 'ضعیف';
  if (pct < 60) return 'متوسط';
  if (pct < 85) return 'خوب';
  return 'بسیار قوی';
});

const isFormValid = computed(() => {
  return (
    isUsernameValid.value &&
    isEmailValid.value &&
    password.value.length >= 6 &&
    isPasswordMatch.value
  );
});

async function handleRegister() {
  if (!isFormValid.value) return;

  const success = await register(
    username.value.trim(),
    email.value.trim(),
    password.value
  );
  if (success) {
    router.push('/dashboard');
  }
}
</script>
