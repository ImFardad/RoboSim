import { createApp } from 'vue'

// فونت وزیرمتن — به‌صورت کاملاً لوکال (بدون CDN یا API)
import '@fontsource/vazirmatn/400.css'
import '@fontsource/vazirmatn/500.css'
import '@fontsource/vazirmatn/700.css'

import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
