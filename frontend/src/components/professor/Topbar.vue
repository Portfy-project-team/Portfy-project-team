<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Search, Bell, Check, X, MessageCircle, Eye, Folder, BellRing } from 'lucide-vue-next'

const props = defineProps({
  title: { type: String, default: 'Dashboard' },
  userInitials: { type: String, default: 'AA' }
})

const notifOpen = ref(false)
const notifRef = ref(null)

const notifications = ref([
  { id: 1, text: 'Sara Benali a posté un nouveau commentaire.', time: 'Il y a 5 min', read: false, type: 'comment' },
  { id: 2, text: 'Youssef Khalil a consulté votre recommandation.', time: 'Il y a 1h', read: false, type: 'view' },
  { id: 3, text: 'Nouveau portfolio disponible : Ahmed Alami.', time: 'Il y a 2h', read: true, type: 'portfolio' },
  { id: 4, text: 'Rappel : 3 commentaires en attente de réponse.', time: 'Hier', read: true, type: 'reminder' },
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

function toggleNotif() {
  notifOpen.value = !notifOpen.value
}

function markAsRead(id) {
  const n = notifications.value.find(n => n.id === id)
  if (n) n.read = true
}

function markAllRead() {
  notifications.value.forEach(n => n.read = true)
}

function dismiss(id) {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

function handleOutsideClick(e) {
  if (notifRef.value && !notifRef.value.contains(e.target)) {
    notifOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => document.removeEventListener('mousedown', handleOutsideClick))

const typeIcon = { comment: MessageCircle, view: Eye, portfolio: Folder, reminder: BellRing }
const typeColor = { comment: '#4f46e5', view: '#0891b2', portfolio: '#059669', reminder: '#f5a623' }
</script>

<template>
  <header class="topbar">
    <h1 class="topbar-title">{{ title }}</h1>
    <div class="topbar-actions">
      <div class="search-box">
        <Search size="18" />
        <input type="text" placeholder="Rechercher" />
      </div>

      <!-- Notification Bell -->
      <div class="notif-wrapper" ref="notifRef">
        <button class="notif-btn" :class="{ active: notifOpen }" @click="toggleNotif" title="Notifications">
          <Bell size="18" />
          <span v-if="unreadCount > 0" class="notif-badge">{{ unreadCount }}</span>
        </button>

        <!-- Dropdown -->
        <transition name="dropdown">
          <div v-if="notifOpen" class="notif-dropdown">
            <div class="notif-header">
              <span class="notif-title">Notifications</span>
              <button v-if="unreadCount > 0" class="mark-all-btn" @click="markAllRead">
                <Check size="13" /> Tout marquer lu
              </button>
            </div>

            <div class="notif-list">
              <div
                v-for="notif in notifications"
                :key="notif.id"
                class="notif-item"
                :class="{ unread: !notif.read }"
                @click="markAsRead(notif.id)"
              >
                <div class="notif-type-icon" :style="{ background: typeColor[notif.type] + '18', color: typeColor[notif.type] }">
                  <component :is="typeIcon[notif.type]" size="15" />
                </div>
                <div class="notif-body">
                  <p class="notif-text">{{ notif.text }}</p>
                  <p class="notif-time">{{ notif.time }}</p>
                </div>
                <button class="dismiss-btn" @click.stop="dismiss(notif.id)" title="Supprimer">
                  <X size="13" />
                </button>
              </div>

              <div v-if="notifications.length === 0" class="notif-empty">
                <Bell size="28" />
                <p>Aucune notification</p>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div class="profile-btn">{{ userInitials }}</div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  width: 100%;
  font-family: 'Inter', sans-serif;
  position: relative;
  z-index: 100;
}
.topbar-title { font-size: 1.3rem; font-weight: 700; color: #0f172a; margin: 0; }
.topbar-actions { display: flex; align-items: center; gap: 16px; }

.search-box { display: flex; align-items: center; background: #f8f9fb; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; gap: 8px; }
.search-box input { border: none; background: transparent; outline: none; font-size: 0.875rem; width: 180px; color: #0f172a; }
.search-box input::placeholder { color: #94a3b8; }
.search-box :deep(svg) { flex-shrink: 0; stroke-width: 2; color: #64748b; }

/* Notification Bell */
.notif-wrapper { position: relative; }

.notif-btn {
  width: 36px; height: 36px;
  border: none; background: none;
  color: #64748b; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
  padding: 0; border-radius: 8px;
  position: relative;
}
.notif-btn:hover, .notif-btn.active { background: #f1f5f9; color: #0f172a; }
.notif-btn :deep(svg) { flex-shrink: 0; stroke-width: 2; color: currentColor; }

.notif-badge {
  position: absolute;
  top: 4px; right: 4px;
  min-width: 16px; height: 16px;
  background: #ef4444;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  padding: 0 3px;
  border: 2px solid #fff;
}

/* Dropdown */
.notif-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 360px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,.12);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  z-index: 9999;
}

.notif-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 16px 12px;
  border-bottom: 1px solid #f1f5f9;
}
.notif-title { font-size: 0.95rem; font-weight: 700; color: #0f172a; }
.mark-all-btn {
  display: flex; align-items: center; gap: 4px;
  background: none; border: none; color: #f5a623;
  font-size: 0.75rem; font-weight: 600; cursor: pointer;
  padding: 4px 8px; border-radius: 6px;
}
.mark-all-btn:hover { background: #fff7ed; }
.mark-all-btn :deep(svg) { flex-shrink: 0; stroke-width: 2.5; color: currentColor; }

.notif-list { max-height: 320px; overflow-y: auto; }

.notif-item {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background .15s;
  border-bottom: 1px solid #f8f9fb;
}
.notif-item:hover { background: #f8f9fb; }
.notif-item.unread { background: #fffbf0; }
.notif-item.unread:hover { background: #fef3c7; }

.notif-type-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}
.notif-body { flex: 1; min-width: 0; }
.notif-text { font-size: 0.85rem; color: #0f172a; margin: 0 0 3px; line-height: 1.4; }
.notif-item.unread .notif-text { font-weight: 600; }
.notif-time { font-size: 0.75rem; color: #94a3b8; margin: 0; }

.dismiss-btn {
  background: none; border: none; color: #94a3b8;
  cursor: pointer; padding: 2px; border-radius: 4px;
  display: flex; align-items: center; flex-shrink: 0;
  opacity: 0; transition: opacity .2s;
}
.notif-item:hover .dismiss-btn { opacity: 1; }
.dismiss-btn:hover { color: #ef4444; }
.dismiss-btn :deep(svg) { flex-shrink: 0; stroke-width: 2.5; color: currentColor; }

.notif-empty { text-align: center; padding: 32px 16px; color: #94a3b8; }
.notif-empty :deep(svg) { margin-bottom: 8px; opacity: 0.4; stroke-width: 2; }
.notif-empty p { margin: 0; font-size: 0.875rem; }

/* Dropdown animation */
.dropdown-enter-active, .dropdown-leave-active { transition: all .2s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px) scale(0.97); }

.profile-btn {
  width: 36px; height: 36px;
  border-radius: 50%; background: #6e98e4;
  color: #fff; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; cursor: pointer; transition: background 0.2s;
}
.profile-btn:hover { background: #5347e1; }
</style>