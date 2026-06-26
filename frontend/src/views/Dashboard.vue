<template>
  <div class="dashboard-container">
    <!-- Navbar -->
    <AppHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

    <!-- Sidebar Left Drawer -->
    <AppSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" activeMenu="dashboard" />

    <!-- Main Dashboard Area -->
    <main class="dashboard-content" v-if="user">
      <div class="dashboard-header">
        <h1>{{ GLOSSARY.dashboardTitle }}</h1>
        <p>{{ GLOSSARY.dashboardSubtitle }}</p>
      </div>

      <!-- Actions Grid Layout -->
      <div class="dashboard-grid">
        <!-- Arena card -->
        <DashboardCard
          :title="GLOSSARY.arenaCardTitle"
          :desc="GLOSSARY.arenaCardDesc"
          :actionText="GLOSSARY.arenaCardBtn"
          @action="showFeatureAlert(GLOSSARY.arenaFeatureAlert)"
        >
          <template #icon>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          @action="goToLab"
        >
          <template #icon>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
import DashboardCard from '../components/DashboardCard.vue';
import AppHeader from '../components/AppHeader.vue';
import AppSidebar from '../components/AppSidebar.vue';

const router = useRouter();
const { user } = useAuth();
const isSidebarOpen = ref(false);

function goToLab() {
  isSidebarOpen.value = false;
  router.push('/lab');
}

function showFeatureAlert(message: string) {
  alert(message);
}
</script>

<style scoped>
.dashboard-content {
  flex: 1;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.dashboard-header {
  margin-bottom: 40px;
  animation: cardEntrance 0.5s ease-out;
}

.dashboard-header h1 {
  font-size: 2.2rem;
  margin: 0 0 8px 0;
}

.dashboard-header p {
  color: var(--text-secondary);
  margin: 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

@keyframes cardEntrance {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 24px 16px;
  }
  .dashboard-header h1 {
    font-size: 1.8rem;
  }
}
</style>
