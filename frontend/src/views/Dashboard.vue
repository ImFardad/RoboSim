<template>
  <div class="dashboard-container">
    <!-- Navbar -->
    <header class="dashboard-nav">
      <div class="nav-brand">
        🤖 <span>{{ GLOSSARY.appName }} Cockpit</span>
      </div>
      <div class="nav-user" v-if="user">
        <span class="user-badge">{{ GLOSSARY.welcomeCommander }}{{ user.username }}</span>
        <button @click="handleLogout" class="logout-btn">{{ GLOSSARY.logoutBtn }}</button>
      </div>
    </header>

    <!-- Main Dashboard Area -->
    <main class="dashboard-content" v-if="user">
      <div class="dashboard-header">
        <h1>{{ GLOSSARY.dashboardTitle }}</h1>
        <p>{{ GLOSSARY.dashboardSubtitle }}</p>
      </div>

      <div class="dashboard-grid">
        <!-- Profile details -->
        <section class="grid-card">
          <h3>{{ GLOSSARY.profileCardTitle }}</h3>
          <p>{{ GLOSSARY.profileCardDesc }}</p>
          <div class="profile-details">
            <ProfileRow :label="GLOSSARY.profileUsernameLabel" :value="user.username || ''" />
            <ProfileRow :label="GLOSSARY.profileEmailLabel" :value="user.email || ''" />
            <ProfileRow :label="GLOSSARY.profileJoinedLabel" :value="formatDate(user.createdAt)" />
            <ProfileRow 
              :label="GLOSSARY.profileIdLabel" 
              :value="user.id || ''" 
              :valueStyle="{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '150px'
              }" 
            />
          </div>
        </section>

        <!-- Arena card -->
        <DashboardCard
          :title="GLOSSARY.arenaCardTitle"
          :desc="GLOSSARY.arenaCardDesc"
          :actionText="GLOSSARY.arenaCardBtn"
          @action="showFeatureAlert(GLOSSARY.arenaFeatureAlert)"
        />

        <!-- Robots management card -->
        <DashboardCard
          :title="GLOSSARY.robotsCardTitle"
          :desc="GLOSSARY.robotsCardDesc"
          :actionText="GLOSSARY.robotsCardBtn"
          @action="showFeatureAlert(GLOSSARY.robotsFeatureAlert)"
        />

        <!-- History card -->
        <DashboardCard
          :title="GLOSSARY.historyCardTitle"
          :desc="GLOSSARY.historyCardDesc"
          :actionText="GLOSSARY.historyCardBtn"
          @action="showFeatureAlert(GLOSSARY.historyFeatureAlert)"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '../utils/auth';
import { GLOSSARY } from '../glossary';
import ProfileRow from '../components/ProfileRow.vue';
import DashboardCard from '../components/DashboardCard.vue';

const router = useRouter();
const { user, logout } = useAuth();

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
