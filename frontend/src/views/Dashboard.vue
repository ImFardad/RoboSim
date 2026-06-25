<template>
  <div class="dashboard-container">
    <!-- Navbar -->
    <header class="dashboard-nav">
      <div class="nav-brand">
        <!-- SVG Processor/Robot Logo -->
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
          <rect x="9" y="9" width="6" height="6"></rect>
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"></path>
        </svg>
        <span>{{ GLOSSARY.appName }} Cockpit</span>
      </div>

      <!-- Clean Header Right: Profile Avatar Button with Dropdown -->
      <div class="nav-user" v-if="user">
        <div class="profile-dropdown-wrapper">
          <button 
            @click="toggleProfilePanel" 
            :class="['profile-avatar-trigger', { active: isProfilePanelOpen }]"
            aria-label="Toggle profile menu"
          >
            <img 
              :src="`/avatars/robot_${user.avatarId || 1}.png`" 
              class="profile-avatar-img" 
              alt="User Avatar"
            />
          </button>

          <!-- Glassmorphic Profile Panel Dropdown -->
          <div class="profile-dropdown" v-if="isProfilePanelOpen">
            <div class="profile-dropdown-header">
              <div class="dropdown-avatar-display">
                <img :src="`/avatars/robot_${user.avatarId || 1}.png`" alt="Profile avatar" />
              </div>
              <div class="profile-dropdown-username">{{ user.username }}</div>
              <div class="profile-dropdown-email">{{ user.email }}</div>
            </div>

            <!-- Profile Info rows -->
            <div class="profile-details" style="margin-bottom: 20px;">
              <ProfileRow :label="GLOSSARY.profileJoinedLabel" :value="formatDate(user.createdAt)" />
              <ProfileRow 
                :label="GLOSSARY.profileIdLabel" 
                :value="user.id" 
                :valueStyle="{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '180px'
                }" 
              />
            </div>

            <!-- Avatar selection grid -->
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

            <!-- Logout Button with Exit SVG -->
            <button @click="handleLogout" class="dropdown-logout-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"></path>
              </svg>
              <span>{{ GLOSSARY.logoutBtn }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Dashboard Area -->
    <main class="dashboard-content" v-if="user">
      <div class="dashboard-header">
        <h1>{{ GLOSSARY.dashboardTitle }}</h1>
        <p>{{ GLOSSARY.dashboardSubtitle }}</p>
      </div>

      <!-- Actions Grid Layout (Cleaned up from profile card) -->
      <div class="dashboard-grid">
        <!-- Arena card -->
        <DashboardCard
          :title="GLOSSARY.arenaCardTitle"
          :desc="GLOSSARY.arenaCardDesc"
          :actionText="GLOSSARY.arenaCardBtn"
          @action="showFeatureAlert(GLOSSARY.arenaFeatureAlert)"
        >
          <template #icon>
            <!-- Crossed Target Swords SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m16.2 7.8-8.4 8.4M12 2v2M12 20v2M20 12h-2M4 12H2"></path>
            </svg>
          </template>
        </DashboardCard>

        <!-- Robots management card -->
        <DashboardCard
          :title="GLOSSARY.robotsCardTitle"
          :desc="GLOSSARY.robotsCardDesc"
          :actionText="GLOSSARY.robotsCardBtn"
          @action="showFeatureAlert(GLOSSARY.robotsFeatureAlert)"
        >
          <template #icon>
            <!-- CPU Microchip SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
              <rect x="9" y="9" width="6" height="6"></rect>
              <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"></path>
            </svg>
          </template>
        </DashboardCard>

        <!-- History card -->
        <DashboardCard
          :title="GLOSSARY.historyCardTitle"
          :desc="GLOSSARY.historyCardDesc"
          :actionText="GLOSSARY.historyCardBtn"
          @action="showFeatureAlert(GLOSSARY.historyFeatureAlert)"
        >
          <template #icon>
            <!-- Replay Film Roll SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"></path>
            </svg>
          </template>
        </DashboardCard>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../utils/auth';
import { GLOSSARY } from '../glossary';
import ProfileRow from '../components/ProfileRow.vue';
import DashboardCard from '../components/DashboardCard.vue';

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

function showFeatureAlert(message: string) {
  alert(message);
}
</script>
