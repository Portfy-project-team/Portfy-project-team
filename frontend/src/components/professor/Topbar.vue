<template>
  <header class="topbar">
    <div class="topbar-left">
      <h1 class="topbar-title">{{ title }}</h1>
    </div>
    <div class="topbar-right">

      <!-- Search -->
      <div class="search-wrapper" ref="searchWrapper">
        <div class="search-box" :class="{ focused: isFocused }">
          <Search size="16" color="#aaa" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un étudiant..."
            @focus="isFocused = true"
            @input="onInput"
            @keydown.escape="closeSearchDropdown"
          />
          <div v-if="searchQuery" class="clear-btn" @click="clearSearch">
            <X size="14" />
          </div>
        </div>

        <!-- Search Dropdown -->
        <div v-if="showSearchDropdown" class="search-dropdown">
          <div v-if="searchLoading" class="dropdown-loading">
            <div class="spinner"></div>
            <span>Recherche en cours...</span>
          </div>
          <template v-else-if="searchResults.length > 0">
            <div class="dropdown-header">{{ searchResults.length }} résultat{{ searchResults.length > 1 ? 's' : '' }}</div>
            <div v-for="r in searchResults" :key="r.id" class="dropdown-item" @click="selectResult(r)">
              <div class="result-avatar" :style="{ background: r.color }">{{ r.initials }}</div>
              <div class="result-info">
                <span class="result-name">{{ r.studentName }}</span>
                <span class="result-meta">{{ r.school }}{{ r.filiere ? ' · ' + r.filiere : '' }}</span>
              </div>
              <div class="result-tags">
                <span v-for="tag in r.tags.slice(0, 2)" :key="tag" class="result-tag">{{ tag }}</span>
              </div>
            </div>
          </template>
          <div v-else class="dropdown-empty">
            <span>Aucun résultat pour "{{ searchQuery }}"</span>
          </div>
        </div>
      </div>

      <!-- Notif Bell -->
      <div class="notif-wrapper" ref="notifWrapper">
        <button class="notif-btn" @click="toggleNotifDropdown">
          <Bell size="20" />
          <span v-if="unreadCount > 0" class="notif-badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
        </button>

        <!-- Notif Dropdown -->
        <div v-if="showNotifDropdown" class="notif-dropdown">
          <div class="notif-dropdown-header">
            <span>Notifications</span>
            <button v-if="unreadCount > 0" class="mark-all-btn" @click="handleMarkAllRead">
              Tout marquer lu
            </button>
          </div>

          <div v-if="notifLoading" class="dropdown-loading">
            <div class="spinner"></div>
            <span>Chargement...</span>
          </div>

          <template v-else-if="notifications.length > 0">
            <div
              v-for="n in notifications"
              :key="n.id"
              class="notif-item"
              :class="{ unread: !n.read }"
              @click="handleMarkOneRead(n)"
            >
              <div class="notif-icon" :class="n.type">
                <MessageCircle v-if="n.type === 'comment'" size="14" />
                <Eye v-else-if="n.type === 'view'" size="14" />
                <Folder v-else-if="n.type === 'portfolio'" size="14" />
                <BellRing v-else size="14" />
              </div>
              <div class="notif-body">
                <p class="notif-text">{{ n.text }}</p>
                <span class="notif-time">{{ n.time }}</span>
              </div>
              <div v-if="!n.read" class="notif-dot-unread"></div>
              <button class="notif-delete" @click.stop="handleDelete(n.id)" title="Supprimer">
                <X size="12" />
              </button>
            </div>
          </template>

          <div v-else class="dropdown-empty">
            <span>Aucune notification</span>
          </div>
        </div>
      </div>

      <!-- Avatar -->
      <!-- Avatar -->
<div class="topbar-avatar" v-if="auth.user?.avatarUrl">
  <img :src="auth.user.avatarUrl" alt="avatar" class="avatar-img" />
</div>
<div class="topbar-avatar" v-else>{{ auth.initials }}</div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Bell, X, MessageCircle, Eye, Folder, BellRing } from 'lucide-vue-next'
import { useAuthStore } from '@/store/authStore.js'
import { api } from '@/store/authStore.js'
import { searchService } from '../../services/professor/search.service.js'

const props = defineProps({ title: String })
const router = useRouter()
const auth = useAuthStore()

// ── Auth ────────────────────────────────────────────────────────
const initials = ref(auth.initials || 'MG')

// ── Search ──────────────────────────────────────────────────────
const searchQuery = ref('')
const searchResults = ref([])
const searchLoading = ref(false)
const isFocused = ref(false)
const showSearchDropdown = ref(false)
const searchWrapper = ref(null)
let debounceTimer = null

function onInput() {
  clearTimeout(debounceTimer)
  if (searchQuery.value.trim().length < 2) {
    searchResults.value = []
    showSearchDropdown.value = false
    return
  }
  searchLoading.value = true
  showSearchDropdown.value = true
  debounceTimer = setTimeout(async () => {
    try {
      const res = await searchService.search(searchQuery.value.trim())
      searchResults.value = res.data.data
    } catch (err) {
      console.error('Erreur recherche:', err)
      searchResults.value = []
    } finally {
      searchLoading.value = false
    }
  }, 350)
}

function selectResult(r) {
  closeSearchDropdown()
  router.push('/professor/portfolios-consultes')
}

function clearSearch() {
  searchQuery.value = ''
  searchResults.value = []
  showSearchDropdown.value = false
}

function closeSearchDropdown() {
  showSearchDropdown.value = false
  isFocused.value = false
}

// ── Notifications ───────────────────────────────────────────────
const notifications = ref([])
const unreadCount = ref(0)
const notifLoading = ref(false)
const showNotifDropdown = ref(false)
const notifWrapper = ref(null)

async function fetchNotifications() {
  notifLoading.value = true
  try {
    const res = await api.get('/notifications')
    notifications.value = res.data.data.notifications
    unreadCount.value = res.data.data.unreadCount
  } catch (err) {
    console.error('Erreur notifications:', err)
  } finally {
    notifLoading.value = false
  }
}

function toggleNotifDropdown() {
  showNotifDropdown.value = !showNotifDropdown.value
  if (showNotifDropdown.value) fetchNotifications()
}

async function handleMarkOneRead(n) {
  if (n.read) return
  try {
    await api.patch(`/notifications/${n.id}/read`)
    n.read = true
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  } catch (err) {
    console.error('Erreur mark read:', err)
  }
}

async function handleMarkAllRead() {
  try {
    await api.patch('/notifications/read-all')
    notifications.value.forEach(n => n.read = true)
    unreadCount.value = 0
  } catch (err) {
    console.error('Erreur mark all read:', err)
  }
}

async function handleDelete(id) {
  try {
    await api.delete(`/notifications/${id}`)
    const n = notifications.value.find(n => n.id === id)
    if (n && !n.read) unreadCount.value = Math.max(0, unreadCount.value - 1)
    notifications.value = notifications.value.filter(n => n.id !== id)
  } catch (err) {
    console.error('Erreur delete notif:', err)
  }
}

// ── Click outside ───────────────────────────────────────────────
function handleClickOutside(e) {
  if (searchWrapper.value && !searchWrapper.value.contains(e.target)) {
    closeSearchDropdown()
  }
  if (notifWrapper.value && !notifWrapper.value.contains(e.target)) {
    showNotifDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  fetchNotifications() // charger le count au montage
})
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

<style scoped>
.topbar {
  height: 60px; background: #fff; display: flex; align-items: center;
  justify-content: space-between; padding: 0 24px;
  border-bottom: 1px solid #f0f0f0; position: sticky; top: 0; z-index: 50;
}
.topbar-title { font-size: 1rem; font-weight: 600; color: #0f172a; margin: 0; }
.topbar-right { display: flex; align-items: center; gap: 14px; position: relative; }

/* Search */
.search-wrapper { position: relative; }
.search-box {
  display: flex; align-items: center; gap: 8px;
  background: #f4f6fa; border: 1.5px solid transparent;
  border-radius: 10px; padding: 7px 12px; width: 240px; transition: all 0.2s;
}
.search-box.focused { background: #fff; border-color: #e5b230; box-shadow: 0 0 0 3px rgba(229,178,48,0.1); }
.search-box input { border: none; background: none; outline: none; font-size: 0.875rem; color: #0f172a; flex: 1; }
.search-box input::placeholder { color: #aaa; }
.clear-btn { cursor: pointer; color: #94a3b8; display: flex; align-items: center; transition: color 0.2s; }
.clear-btn:hover { color: #475569; }

.search-dropdown {
  position: absolute; top: calc(100% + 8px); left: 0; width: 360px;
  background: #fff; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  border: 1px solid #e2e8f0; overflow: hidden; z-index: 100;
}
.dropdown-header { padding: 8px 14px; font-size: 0.75rem; color: #94a3b8; border-bottom: 1px solid #f1f5f9; }
.dropdown-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; transition: background 0.15s; }
.dropdown-item:hover { background: #f8fafc; }
.result-avatar { width: 36px; height: 36px; border-radius: 50%; color: #fff; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.result-info { flex: 1; min-width: 0; }
.result-name { display: block; font-weight: 600; font-size: 0.875rem; color: #0f172a; }
.result-meta { font-size: 0.75rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.result-tags { display: flex; gap: 4px; flex-shrink: 0; }
.result-tag { font-size: 0.65rem; padding: 2px 6px; background: #f1f5f9; color: #475569; border-radius: 4px; }

/* Notif */
.notif-wrapper { position: relative; }
.notif-btn {
  position: relative; background: none; border: none; cursor: pointer;
  padding: 6px; color: #475569; display: flex; align-items: center;
  border-radius: 8px; transition: background 0.2s;
}
.notif-btn:hover { background: #f1f5f9; }
.notif-badge {
  position: absolute; top: 0; right: 0;
  min-width: 16px; height: 16px; padding: 0 4px;
  background: #e05260; color: #fff;
  font-size: 0.6rem; font-weight: 700;
  border-radius: 10px; border: 2px solid #fff;
  display: flex; align-items: center; justify-content: center;
}

.notif-dropdown {
  position: absolute; top: calc(100% + 8px); right: 0; width: 340px;
  background: #fff; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  border: 1px solid #e2e8f0; overflow: hidden; z-index: 100;
}
.notif-dropdown-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 14px; border-bottom: 1px solid #f1f5f9;
  font-size: 0.875rem; font-weight: 600; color: #0f172a;
}
.mark-all-btn { font-size: 0.75rem; color: #e5b230; background: none; border: none; cursor: pointer; font-weight: 500; }
.mark-all-btn:hover { text-decoration: underline; }

.notif-item {
  display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px;
  cursor: pointer; transition: background 0.15s; position: relative;
}
.notif-item:hover { background: #f8fafc; }
.notif-item.unread { background: #fffbeb; }

.notif-icon {
  width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.notif-icon.comment { background: #ede9fe; color: #7c3aed; }
.notif-icon.view { background: #dbeafe; color: #0891b2; }
.notif-icon.portfolio { background: #dcfce7; color: #059669; }
.notif-icon.reminder { background: #ffedd5; color: #ea580c; }

.notif-body { flex: 1; min-width: 0; }
.notif-text { font-size: 0.8rem; color: #0f172a; margin: 0 0 2px; line-height: 1.4; }
.notif-time { font-size: 0.7rem; color: #94a3b8; }
.notif-dot-unread { width: 8px; height: 8px; border-radius: 50%; background: #e5b230; flex-shrink: 0; margin-top: 4px; }

.notif-delete {
  background: none; border: none; cursor: pointer; color: #cbd5e1;
  padding: 2px; display: flex; align-items: center; opacity: 0; transition: opacity 0.2s;
}
.notif-item:hover .notif-delete { opacity: 1; }
.notif-delete:hover { color: #e05260; }

/* Common */
.dropdown-loading { display: flex; align-items: center; gap: 10px; padding: 16px 14px; color: #94a3b8; font-size: 0.875rem; }
.spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #e2e8f0; border-top-color: #e5b230; animation: spin 0.7s linear infinite; flex-shrink: 0; }
@keyframes spin { to { transform: rotate(360deg); } }
.dropdown-empty { padding: 24px 14px; text-align: center; color: #94a3b8; font-size: 0.875rem; }

.topbar-avatar {
  width: 34px; height: 34px; border-radius: 50%; background: #6c63ff;
  color: #fff; font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
</style>