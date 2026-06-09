<template>
  <div class="professor-layout">
    <Sidebar :user="user" :comment-count="3" />
    <div class="main-content">
      <Topbar title="Commentaires" />

      <div class="page-content">
        <div class="page-header">
          <div>
            <h2 class="page-title">Commentaires des étudiants</h2>
            <p class="page-subtitle">Gérez les commentaires et retours de vos étudiants</p>
          </div>
        </div>

        <!-- Stats -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-icon blue"><MessageCircle size="20" /></div>
            <div>
              <p class="stat-label">Total</p>
              <p class="stat-value">{{ comments.length }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green"><CheckCircle size="20" /></div>
            <div>
              <p class="stat-label">Lus</p>
              <p class="stat-value">{{ readCount }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon orange"><AlertCircle size="20" /></div>
            <div>
              <p class="stat-label">Non lus</p>
              <p class="stat-value">{{ unreadCount }}</p>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="filters-bar">
          <button
            v-for="f in filters"
            :key="f.value"
            class="filter-btn"
            :class="{ active: activeFilter === f.value }"
            @click="activeFilter = f.value"
          >
            {{ f.label }}
          </button>
          <div class="search-box">
            <Search size="18" />
            <input v-model="search" type="text" placeholder="Rechercher..." />
          </div>
        </div>

        <!-- Comments List -->
        <div class="comments-list">
          <div
            v-for="comment in filteredComments"
            :key="comment.id"
            class="comment-card"
            :class="{ unread: !comment.read }"
          >
            <div class="comment-header">
              <div class="student-avatar" :style="{ background: comment.color }">
                {{ comment.initials }}
              </div>
              <div class="comment-meta">
                <p class="student-name">{{ comment.student }}</p>
                <p class="comment-date">{{ comment.date }}</p>
              </div>
              <button
                v-if="!comment.read"
                class="mark-read-btn"
                @click="markAsRead(comment.id)"
                title="Marquer comme lu"
              >
                <Circle size="16" />
              </button>
            </div>
            <div class="comment-content">
              <p>{{ comment.text }}</p>
            </div>
            <div class="comment-footer">
              <span class="comment-type">{{ comment.type }}</span>
              <div class="comment-actions">
                <button class="action-btn" title="Répondre">
                  <Reply size="14" />
                </button>
                <button class="action-btn" title="Supprimer">
                  <Trash2 size="14" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="filteredComments.length === 0" class="empty-state">
            <MessageCircle size="48" />
            <p>Aucun commentaire trouvé.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from '../../components/professor/Sidebar.vue'
import Topbar from '../../components/professor/Topbar.vue'
import { MessageCircle, CheckCircle, AlertCircle, Search, Circle, Reply, Trash2 } from 'lucide-vue-next'

const user = { name: 'M. Ghailani', role: 'Professeur · ENSAT', verified: true }

const comments = ref([
  { id: 1, student: 'Ahmed Alami', initials: 'AA', color: '#4f46e5', text: 'Merci beaucoup pour vos commentaires constructifs sur mon portfolio.', type: 'Portfolio', date: '12 mars 2026', read: true },
  { id: 2, student: 'Sara Benali', initials: 'SB', color: '#7c3aed', text: 'Pourriez-vous me conseiller sur ma thématique de projet ?', type: 'Projet', date: '10 mars 2026', read: false },
  { id: 3, student: 'Leila Moussaoui', initials: 'LM', color: '#059669', text: 'Excellent retour. Je vais implémenter vos suggestions.', type: 'Stage', date: '8 mars 2026', read: true },
  { id: 4, student: 'Youssef Khalil', initials: 'YK', color: '#d97706', text: 'J\'ai une question concernant l\'évaluation des compétences.', type: 'Général', date: '5 mars 2026', read: false },
  { id: 5, student: 'Omar Mellouki', initials: 'OM', color: '#0891b2', text: 'Merci pour votre disponibilité et vos explications détaillées.', type: 'Portfolio', date: '3 mars 2026', read: true },
])

const activeFilter = ref('all')
const search = ref('')

const filters = [
  { label: 'Tous', value: 'all' },
  { label: 'Non lus', value: 'unread' },
  { label: 'Lus', value: 'read' },
]

const readCount = computed(() => comments.value.filter(c => c.read).length)
const unreadCount = computed(() => comments.value.filter(c => !c.read).length)

const filteredComments = computed(() => {
  return comments.value.filter(c => {
    const matchFilter =
      activeFilter.value === 'all' ||
      (activeFilter.value === 'read' && c.read) ||
      (activeFilter.value === 'unread' && !c.read)
    const matchSearch = c.student.toLowerCase().includes(search.value.toLowerCase())
    return matchFilter && matchSearch
  })
})

function markAsRead(id) {
  const comment = comments.value.find(c => c.id === id)
  if (comment) comment.read = true
}
</script>

<style scoped>
.professor-layout { display: flex; min-height: 100vh; background: #f8f9fb; font-family: 'Inter', sans-serif; }
.main-content { flex: 1; display: flex; flex-direction: column; }
.page-content { padding: 24px 32px; }

.page-header { margin-bottom: 24px; }
.page-title { font-size: 1.4rem; font-weight: 700; color: #0f172a; margin: 0; }
.page-subtitle { color: #64748b; font-size: 0.875rem; margin: 4px 0 0; }

.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
.stat-card { background: #fff; border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; }
.stat-icon.blue { background: #dbeafe; color: #0284c7; }
.stat-icon.green { background: #dcfce7; color: #16a34a; }
.stat-icon.orange { background: #ffedd5; color: #ea580c; }
.stat-label { color: #64748b; font-size: 0.8rem; margin: 0; }
.stat-value { font-size: 1.6rem; font-weight: 700; color: #0f172a; margin: 0; }

.filters-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.filter-btn { padding: 7px 16px; border-radius: 20px; border: 1px solid #e2e8f0; background: #fff; color: #475569; font-size: 0.875rem; cursor: pointer; transition: all .2s; }
.filter-btn.active { background: #1e293b; color: #fff; border-color: #1e293b; }
.search-box { margin-left: auto; display: flex; align-items: center; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; gap: 8px; }
.search-box input { border: none; outline: none; font-size: 0.875rem; width: 200px; color: #0f172a; }

.comments-list { display: flex; flex-direction: column; gap: 12px; }
.comment-card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.06); transition: box-shadow .2s; border-left: 4px solid transparent; }
.comment-card.unread { border-left-color: #f5a623; background: #fffbf0; }
.comment-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,.08); }

.comment-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.student-avatar { width: 40px; height: 40px; border-radius: 50%; color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.comment-meta { flex: 1; min-width: 0; }
.student-name { font-weight: 600; color: #0f172a; margin: 0; font-size: 0.95rem; }
.comment-date { color: #64748b; font-size: 0.75rem; margin: 2px 0 0; }

.mark-read-btn { background: none; border: none; color: #f5a623; cursor: pointer; padding: 4px; transition: color .2s; }
.mark-read-btn:hover { color: #e09610; }

.comment-content { margin-bottom: 12px; }
.comment-content p { color: #475569; line-height: 1.6; margin: 0; font-size: 0.9rem; }

.comment-footer { display: flex; align-items: center; justify-content: space-between; }
.comment-type { font-size: 0.75rem; color: #94a3b8; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; }
.comment-actions { display: flex; gap: 8px; }
.action-btn { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px; cursor: pointer; transition: background .2s; color: #64748b; }
.action-btn:hover { background: #f1f5f9; }

.empty-state { text-align: center; padding: 48px; color: #94a3b8; }
.empty-state :deep(svg) { margin-bottom: 12px; opacity: 0.5; }

:deep(svg) {
  flex-shrink: 0;
  stroke-width: 2;
  color: currentColor;
}
</style>