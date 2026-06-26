import { createApp } from 'vue';

// فونت وزیرمتن — به‌صورت کاملاً لوکال (بدون CDN یا API)
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/700.css';

import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');
