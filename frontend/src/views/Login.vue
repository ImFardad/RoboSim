<template>
  <div class="auth-wrapper">
    <GlassCard>
      <h2 class="auth-title">ورود به RoboSim</h2>
      <p class="auth-subtitle">برای کنترل ربات خود و ورود به میدان نبرد وارد شوید</p>

      <BaseAlert type="danger" :message="authError" />

      <form @submit.prevent="handleLogin">
        <BaseInput
          id="usernameOrEmail"
          v-model="emailOrUsername"
          label="ایمیل یا نام کاربری"
          placeholder="مثال: user@example.com یا fardad"
          required
          :disabled="isLoading"
        />

        <BaseInput
          id="password"
          v-model="password"
          type="password"
          label="رمز عبور"
          placeholder="••••••••"
          required
          :disabled="isLoading"
        />

        <BaseButton
          text="ورود به سیستم"
          loadingText="در حال ورود..."
          :isLoading="isLoading"
          :disabled="!isValid"
        />
      </form>

      <div class="auth-footer">
        <span>هنوز ثبت‌نام نکرده‌اید؟</span>
        <router-link to="/register" class="auth-link">ایجاد حساب کاربری</router-link>
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

const emailOrUsername = ref('');
const password = ref('');

const router = useRouter();
const { login, isLoading, authError } = useAuth();

const isValid = computed(() => {
  return emailOrUsername.value.trim().length > 0 && password.value.length >= 6;
});

async function handleLogin() {
  if (!isValid.value) return;

  const success = await login(emailOrUsername.value.trim(), password.value);
  if (success) {
    router.push('/dashboard');
  }
}
</script>
