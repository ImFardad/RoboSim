<template>
  <div class="auth-wrapper">
    <GlassCard>
      <h2 class="auth-title">{{ GLOSSARY.loginTitle }}</h2>
      <p class="auth-subtitle">{{ GLOSSARY.loginSubtitle }}</p>

      <form @submit.prevent="handleLogin">
        <BaseInput
          id="usernameOrEmail"
          v-model="emailOrUsername"
          :label="GLOSSARY.usernameOrEmailLabel"
          :placeholder="GLOSSARY.usernameOrEmailPlaceholder"
          required
          :disabled="isLoading"
        />

        <BaseInput
          id="password"
          v-model="password"
          type="password"
          :label="GLOSSARY.passwordLabel"
          :placeholder="GLOSSARY.passwordPlaceholder"
          required
          :disabled="isLoading"
        />

        <BaseButton
          :text="GLOSSARY.loginButtonText"
          :loadingText="GLOSSARY.loginButtonLoadingText"
          :isLoading="isLoading"
          :disabled="!isValid"
        />
      </form>

      <div class="auth-footer">
        <span>{{ GLOSSARY.noAccountText }}</span>
        <router-link to="/register" class="auth-link">{{ GLOSSARY.registerLinkText }}</router-link>
      </div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../utils/auth';
import { GLOSSARY } from '../glossary';
import GlassCard from '../components/GlassCard.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';

const emailOrUsername = ref('');
const password = ref('');

const router = useRouter();
const { login, isLoading } = useAuth();

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
