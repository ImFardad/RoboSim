<template>
  <header class="dashboard-nav">
    <div class="nav-brand">
      <!-- Hamburger Menu Button -->
      <button 
        @click="$emit('toggle-sidebar')" 
        class="sidebar-toggle-btn" 
        aria-label="Toggle sidebar menu"
        type="button"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" y1="12" x2="20" y2="12"></line>
          <line x1="4" y1="6" x2="20" y2="6"></line>
          <line x1="4" y1="18" x2="20" y2="18"></line>
        </svg>
      </button>

      <!-- Brand Title -->
      <span class="brand-brand">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
          <rect x="9" y="9" width="6" height="6"></rect>
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"></path>
        </svg>
        <span class="brand-gradient-text">{{ GLOSSARY.appName }} Cockpit</span>
      </span>

      <!-- Responsive Page Title Separator & Text -->
      <template v-if="activePageTitle">
        <span class="page-title-separator">/</span>
        <span class="header-page-title">{{ activePageTitle }}</span>
      </template>
    </div>

    <!-- Profile Dropdown -->
    <div class="nav-user" v-if="user">
      <div class="profile-dropdown-wrapper">
        <button 
          @click="toggleProfilePanel" 
          :class="['profile-avatar-trigger', { active: isProfilePanelOpen }]"
          aria-label="Toggle profile menu"
          type="button"
        >
          <img 
            :src="`/avatars/robot_${user.avatarId || 1}.png`" 
            class="profile-avatar-img" 
            alt="User Avatar"
          />
        </button>

        <Transition name="dropdown">
          <div class="profile-dropdown" v-if="isProfilePanelOpen">
            <div class="profile-dropdown-header">
              <div class="dropdown-avatar-display">
                <img :src="`/avatars/robot_${user.avatarId || 1}.png`" alt="Profile avatar" />
              </div>
              <div class="profile-dropdown-username">{{ user.username }}</div>
              <div class="profile-dropdown-email">{{ user.email }}</div>
            </div>

            <div class="profile-details" style="margin-bottom: 20px;">
              <ProfileRow :label="GLOSSARY.profileJoinedLabel" :value="formatDate(user.createdAt)" />
            </div>

            <div class="avatar-selector-title">Select Avatar (Origami Robots):</div>
            <div class="avatar-grid">
              <button
                v-for="id in 10"
                :key="id"
                :class="['avatar-option-btn', { selected: user.avatarId === id }]"
                @click="updateAvatar(id)"
                type="button"
                :title="`Select Robot Avatar ${id}`"
              >
                <img :src="`/avatars/robot_${id}.png`" :alt="`Avatar ${id}`" />
              </button>
            </div>

            <button @click="handleLogout" class="dropdown-logout-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"></path>
              </svg>
              <span>{{ GLOSSARY.logoutBtn }}</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../utils/auth';
import { GLOSSARY } from '../glossary';
import ProfileRow from './ProfileRow.vue';

defineProps<{
  activePageTitle?: string;
}>();

defineEmits<{
  (e: 'toggle-sidebar'): void;
}>();

const router = useRouter();
const { user, logout, changeAvatar } = useAuth();
const isProfilePanelOpen = ref(false);

function toggleProfilePanel() {
  isProfilePanelOpen.value = !isProfilePanelOpen.value;
}

async function updateAvatar(id: number) {
  if (!user.value || user.value.avatarId === id) return;
  await changeAvatar(id);
}

function handleLogout() {
  logout();
  router.push('/login');
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
</script>

<style scoped>
/* Navigation bar layout */
.dashboard-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 40px;
  background: rgba(11, 15, 25, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-glow);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.nav-brand {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.5px;
}

.brand-brand {
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-gradient-text {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-title-separator {
  color: var(--text-muted);
  font-family: monospace;
  font-size: 1.2rem;
  user-select: none;
}

.header-page-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Sidebar Toggle button */
.sidebar-toggle-btn {
  background: transparent;
  border: none;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--border-radius-sm);
  transition: var(--transition-fast);
}

.sidebar-toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--primary-color);
}

/* User Badge & Avatar Trigger */
.nav-user {
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-avatar-trigger {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid var(--border-glow);
  cursor: pointer;
  overflow: hidden;
  transition: var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-color);
  padding: 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.profile-avatar-trigger:hover,
.profile-avatar-trigger.active {
  border-color: var(--border-focus);
  box-shadow: 0 0 15px var(--primary-glow);
  transform: scale(1.05);
}

.profile-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-dropdown-wrapper {
  position: relative;
}

.profile-dropdown {
  position: absolute;
  top: 55px;
  right: 0;
  width: 320px;
  background: rgba(10, 14, 23, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-glow);
  border-radius: var(--border-radius-md);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
  padding: 24px;
  z-index: 200;
  animation: dropdownEntrance 0.2s ease-out;
}

.profile-dropdown-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.dropdown-avatar-display {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: 2px solid var(--primary-color);
  overflow: hidden;
  margin-bottom: 8px;
  box-shadow: 0 0 15px var(--primary-glow);
}

.dropdown-avatar-display img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-dropdown-username {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.profile-dropdown-email {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.avatar-selector-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 10px;
  text-align: left;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.avatar-option-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.05);
  transition: var(--transition-fast);
}

.avatar-option-btn:hover {
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.avatar-option-btn.selected {
  border-color: var(--border-focus);
  box-shadow: 0 0 10px var(--primary-glow);
}

.avatar-option-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dropdown-logout-btn {
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid var(--error-color);
  color: var(--error-color);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-family: var(--font-family);
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: var(--transition-fast);
}

.dropdown-logout-btn:hover {
  background: var(--error-color);
  color: #ffffff;
  box-shadow: 0 0 15px var(--error-glow);
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

@keyframes dropdownEntrance {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .dashboard-nav {
    padding: 16px 20px;
  }
  .page-title-separator,
  .header-page-title {
    display: none;
  }
}
</style>
