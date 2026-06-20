import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { api } from '../authStore.js'

export const useAdminSettingsStore = defineStore('adminSettings', () => {
  const settings = reactive({
    general: {
      platformName: 'Portfy',
      supportEmail: 'support@portfy.ma',
      defaultLanguage: 'Francais'
    },
    badges: [],
    scoreItems: [],
    notifications: []
  })

  const loading = ref(false)

  const fetchSettings = async () => {
    loading.value = true
    try {
      // In a real app, you'd have a specific table for this. 
      // For now, we fetch defaults and allow persistence if the table exists.
      const res = await api.get('/settings') // Reusing general settings endpoint for common data
      const data = res.data.data
      
      if (data) {
        settings.general.platformName = data.platformName || 'Portfy'
        settings.general.supportEmail = data.supportEmail || 'support@portfy.ma'
      }

      // Mocking some parts if DB table is missing, but allowing API override
      settings.scoreItems = [
        { key: 'projects', label: 'Projets valides', value: 20 },
        { key: 'stages', label: 'Stages valides', value: 20 },
        { key: 'recommendations', label: 'Recommandations', value: 15 },
        { key: 'git', label: 'Contributions Git', value: 15 },
        { key: 'profile', label: 'Completude profil', value: 15 },
        { key: 'formations', label: 'Formations', value: 15 }
      ]
    } catch (err) {
      console.error("Failed to fetch settings:", err)
    } finally {
      loading.value = false
    }
  }

  const saveSettings = async (payload) => {
    try {
      await api.patch('/settings/profile', payload) // Generic update
      return true
    } catch (err) {
      console.error("Failed to save settings:", err)
      return false
    }
  }

  return { settings, loading, fetchSettings, saveSettings }
})