<template>
  <div class="dashboard-container">
    <!-- Navbar -->
    <header class="dashboard-nav">
      <div class="nav-brand">
        🤖 <span>RoboSim Cockpit</span>
      </div>
      <div class="nav-user" v-if="user">
        <span class="user-badge">سلام، {{ user.username }}</span>
        <button @click="handleLogout" class="logout-btn">خروج از حساب</button>
      </div>
    </header>

    <!-- Main Dashboard Area -->
    <main class="dashboard-content" v-if="user">
      <div class="dashboard-header">
        <h1>داشبورد فرماندهی ربات‌ها</h1>
        <p>به RoboSim خوش آمدید. کدهای خود را بارگذاری کنید و ربات‌ها را به میدان نبرد بفرستید.</p>
      </div>

      <div class="dashboard-grid">
        <!-- Profile details -->
        <section class="grid-card">
          <h3>👤 مشخصات فرمانده</h3>
          <p>اطلاعات کاربری شما در سیستم شبیه‌سازی RoboSim.</p>
          <div class="profile-details">
            <ProfileRow label="نام کاربری" :value="user.username" />
            <ProfileRow label="آدرس ایمیل" :value="user.email" />
            <ProfileRow label="تاریخ عضویت" :value="formatDate(user.createdAt)" />
            <ProfileRow 
              label="شناسه کاربر" 
              :value="user.id" 
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
          title="⚔️ ورود به میدان نبرد (Arena)"
          desc="ربات‌های خود را در مبارزات تیک‌محور دو‌بعدی در مقابل بقیه برنامه‌نویسان به چالش بکشید."
          actionText="ورود به بخش مسابقات"
          @action="showFeatureAlert('میدان نبرد در فازهای بعدی راه‌اندازی خواهد شد.')"
        />

        <!-- Robots management card -->
        <DashboardCard
          title="🤖 مدیریت ربات‌ها"
          desc="مغز (کد TypeScript) ربات‌های خود را بنویسید، آپلود کنید و برای نبردها آماده‌سازی کنید."
          actionText="مدیریت کدهای ربات‌ها"
          @action="showFeatureAlert('ادیتور کد و مدیریت ربات‌ها در حال توسعه است.')"
        />

        <!-- History card -->
        <DashboardCard
          title="🎥 تاریخچه نبردها و Replays"
          desc="بازپخش تمام مسابقات قطعی گذشته را تماشا کنید، مشکلات ربات خود را دیباگ و اصلاح کنید."
          actionText="مشاهده آرشیو مسابقات"
          @action="showFeatureAlert('سیستم ثبت بازپخش مسابقات در فازهای بعدی فعال می‌شود.')"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '../utils/auth';
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
  return date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function showFeatureAlert(message: string) {
  alert(message);
}
</script>
