import './styles/variables.css'
import './styles/main.css'
import './styles/components.css'
import './styles/student.css'
import './styles/auth.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import { createPinia } from 'pinia'  

const app = createApp(App)

app.use(createPinia())   
app.use(router)
app.mount('#app')