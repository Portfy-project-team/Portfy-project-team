import './styles/auth.css'
import './styles/student.css'
import './styles/theme.css'       // ✅ variables CSS dark/light
import './styles/pages-dark.css'  // ✅ patch dark mode toutes les pages
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import { createPinia } from 'pinia'
import i18n from './i18n/index.ts'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')