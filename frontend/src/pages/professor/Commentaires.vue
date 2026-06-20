<template>
  <div class="professor-layout">
    <Sidebar :user="user" :comment-count="unreadCount" />
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
            <div class="stat-icon blue"><MessageCircle :size="20" /></div>
            <div>
              <p class="stat-label">Total</p>
              <p class="stat-value">{{ comments.length }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green"><CheckCircle :size="20" /></div>
            <div>
              <p class="stat-label">Lus</p>
              <p class="stat-value">{{ readCount }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon orange"><AlertCircle :size="20" /></div>
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
            <Search :size="18" />
            <input v-model="search" type="text" placeholder="Rechercher..." />
          </div>
        </div>

        <!-- Comments List -->
        <div class="comments-list">
          <div v-if="loading" class="empty-state">
            <p>Chargement...</p>
          </div>
          <template v-else>
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
                  <Circle :size="16" />
                </button>
              </div>
              <div class="comment-content">
                <p>{{ comment.text }}</p>
              </div>
              <div class="comment-footer">
                <span class="comment-type">{{ comment.type }}</span>
                <div class="comment-actions">
                  <button class="action-btn reply-btn" title="Répondre" @click="replyToComment(comment)">
                    <Reply :size="14" />
                  </button>
                  <button class="action-btn delete-btn" title="Supprimer" @click="confirmDelete(comment)">
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>
            </div>

            <div v-if="filteredComments.length === 0" class="empty-state">
              <MessageCircle :size="48" />
              <p>Aucun commentaire trouvé.</p>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="commentToDelete" class="modal-overlay" @click.self="commentToDelete = null">
      <div class="modal">
        <div class="modal-icon danger"><Trash2 :size="24" /></div>
        <h3>Supprimer ce commentaire ?</h3>
        <p>Le commentaire de <strong>{{ commentToDelete.student }}</strong> sera définitivement supprimé.</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="commentToDelete = null">Annuler</button>
          <button class="btn-confirm-delete" @click="deleteComment">Supprimer</button>
        </div>
      </div>
    </div>

    <!-- Reply Modal -->
    <div v-if="replyTarget" class="modal-overlay" @click.self="replyTarget = null">
      <div class="modal">
        <h3>Répondre à {{ replyTarget.student }}</h3>
        <div class="reply-original"><p>{{ replyTarget.text }}</p></div>
        <textarea v-model="replyText" rows="4" placeholder="Votre réponse..." class="reply-textarea"></textarea>
        <div class="modal-actions">
          <button class="btn-cancel" @click="replyTarget = null">Annuler</button>
          <button class="btn-save" @click="sendReply">Envoyer</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        <CheckCircle v-if="toast.type === 'success'" :size="16" />
        <Trash2 v-else :size="16" />
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '../../components/professor/Sidebar.vue'
import Topbar  from '../../components/professor/Topbar.vue'
import { MessageCircle, CheckCircle, AlertCircle, Search, Circle, Reply, Trash2 } from 'lucide-vue-next'
import { fetchComments, markAsReadApi, deleteCommentApi, replyToCommentApi }
  from '@/services/professor/commentsApi.js'

const user = { name: 'M. Ghailani', role: 'Professeur · ENSAT', verified: true }

const comments        = ref([])
const loading         = ref(false)
const activeFilter    = ref('all')
const search          = ref('')
const commentToDelete = ref(null)
const replyTarget     = ref(null)
const replyText       = ref('')
const toast           = ref({ show: false, message: '', type: 'success' })

const filters = [
  { label: 'Tous',    value: 'all'    },
  { label: 'Non lus', value: 'unread' },
  { label: 'Lus',     value: 'read'   },
]

// ── Chargement initial ────────────────────────────────────
onMounted(async () => {
  loading.value = true
  try {
    const data = await fetchComments()
    comments.value = data.comments.map(c => ({
      id:       c.id,
      student:  c.studentName,
      initials: c.initials,
      color:    c.color,
      text:     c.text,
      type:     c.subject,
      date:     c.date,
      read:     c.is_read,
    }))
  } catch (e) {
    showToast('Erreur lors du chargement des commentaires.', 'delete')
  } finally {
    loading.value = false
  }
})

// ── Computed ──────────────────────────────────────────────
const readCount   = computed(() => comments.value.filter(c =>  c.read).length)
const unreadCount = computed(() => comments.value.filter(c => !c.read).length)

const filteredComments = computed(() => {
  return comments.value.filter(c => {
    const matchFilter =
      activeFilter.value === 'all' ||
      (activeFilter.value === 'read'   &&  c.read) ||
      (activeFilter.value === 'unread' && !c.read)
    const matchSearch = c.student.toLowerCase().includes(search.value.toLowerCase())
    return matchFilter && matchSearch
  })
})

// ── Actions ───────────────────────────────────────────────
async function markAsRead(id) {
  try {
    await markAsReadApi(id)
    const comment = comments.value.find(c => c.id === id)
    if (comment) comment.read = true
  } catch {
    showToast('Erreur lors de la mise à jour.', 'delete')
  }
}

function confirmDelete(comment) {
  commentToDelete.value = comment
}

async function deleteComment() {
  try {
    await deleteCommentApi(commentToDelete.value.id)
    comments.value = comments.value.filter(c => c.id !== commentToDelete.value.id)
    commentToDelete.value = null
    showToast('Commentaire supprimé avec succès.', 'delete')
  } catch {
    showToast('Erreur lors de la suppression.', 'delete')
  }
}

function replyToComment(comment) {
  replyTarget.value = comment
  replyText.value   = ''
}

async function sendReply() {
  try {
    await replyToCommentApi(replyTarget.value.id, replyText.value)
    replyTarget.value = null
    replyText.value   = ''
    showToast('Réponse envoyée avec succès.', 'success')
  } catch {
    showToast("Erreur lors de l'envoi.", 'delete')
  }
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}
</script>

<style scoped>
/* ─── Layout ──────────────────────────────────────────── */
.professor-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fb;
  font-family: 'Inter', sans-serif;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.page-content { padding: 24px 32px; }

/* ─── Page Header ─────────────────────────────────────── */
.page-header   { margin-bottom: 24px; }
.page-title    { font-size: 1.4rem; font-weight: 700; color: #0f172a; margin: 0; }
.page-subtitle { color: #64748b; font-size: 0.875rem; margin: 4px 0 0; }

/* ─── Stats Row ───────────────────────────────────────── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}
.stat-icon {
  width: 44px; height: 44px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.stat-icon.blue   { background: #dbeafe; color: #0284c7; }
.stat-icon.green  { background: #dcfce7; color: #16a34a; }
.stat-icon.orange { background: #ffedd5; color: #ea580c; }
.stat-label { color: #64748b; font-size: 0.8rem; margin: 0; }
.stat-value { font-size: 1.6rem; font-weight: 700; color: #0f172a; margin: 0; }

/* ─── Filters Bar ─────────────────────────────────────── */
.filters-bar {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 20px; flex-wrap: wrap;
}
.filter-btn {
  padding: 7px 16px; border-radius: 20px;
  border: 1px solid #e2e8f0; background: #fff;
  color: #475569; font-size: 0.875rem; cursor: pointer; transition: all .2s;
}
.filter-btn.active { background: #1e293b; color: #fff; border-color: #1e293b; }
.search-box {
  margin-left: auto; display: flex; align-items: center;
  background: #fff; border: 1px solid #e2e8f0;
  border-radius: 8px; padding: 8px 12px; gap: 8px;
}
.search-box input { border: none; outline: none; font-size: 0.875rem; width: 200px; color: #0f172a; }

/* ─── Comments List ───────────────────────────────────── */
.comments-list { display: flex; flex-direction: column; gap: 12px; }
.comment-card {
  background: #fff; border-radius: 12px; padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
  transition: box-shadow .2s; border-left: 4px solid transparent;
}
.comment-card.unread { border-left-color: #f5a623; background: #fffbf0; }
.comment-card:hover  { box-shadow: 0 4px 12px rgba(0,0,0,.08); }

.comment-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.student-avatar {
  width: 40px; height: 40px; border-radius: 50%; color: #fff;
  font-weight: 700; font-size: 0.85rem;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.comment-meta  { flex: 1; min-width: 0; }
.student-name  { font-weight: 600; color: #0f172a; margin: 0; font-size: 0.95rem; }
.comment-date  { color: #64748b; font-size: 0.75rem; margin: 2px 0 0; }

.mark-read-btn {
  background: none; border: none; color: #f5a623; cursor: pointer;
  padding: 4px; border-radius: 4px; display: flex; align-items: center; transition: color .2s;
}
.mark-read-btn:hover { color: #e09610; }

.comment-content     { margin-bottom: 12px; }
.comment-content p   { color: #475569; line-height: 1.6; margin: 0; font-size: 0.9rem; }

.comment-footer { display: flex; align-items: center; justify-content: space-between; }
.comment-type {
  font-size: 0.75rem; color: #94a3b8;
  background: #f1f5f9; padding: 2px 8px; border-radius: 4px;
}
.comment-actions { display: flex; gap: 8px; }
.action-btn {
  border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px;
  cursor: pointer; transition: all .2s;
  display: flex; align-items: center; justify-content: center;
}
.reply-btn        { background: #f8fafc; color: #64748b; }
.reply-btn:hover  { background: #e0f2fe; color: #0284c7; border-color: #bae6fd; }
.delete-btn       { background: #fff5f5; color: #ef4444; border-color: #fecaca; }
.delete-btn:hover { background: #fee2e2; }

.empty-state { text-align: center; padding: 48px; color: #94a3b8; }

/* ─── Modal ───────────────────────────────────────────── */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.4);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.modal {
  background: #fff; border-radius: 16px; padding: 32px;
  width: 440px; max-width: 90vw; text-align: center;
}
.modal-icon {
  width: 56px; height: 56px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
}
.modal-icon.danger { background: #fee2e2; color: #ef4444; }
.modal h3 { font-size: 1.2rem; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
.modal p  { color: #64748b; font-size: 0.9rem; margin: 0 0 24px; }

.modal-actions { display: flex; gap: 12px; justify-content: center; }
.btn-cancel {
  flex: 1; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px;
  background: #fff; color: #475569; font-weight: 600; cursor: pointer;
}
.btn-cancel:hover { background: #f8fafc; }
.btn-confirm-delete {
  flex: 1; padding: 10px; border: none; border-radius: 8px;
  background: #ef4444; color: #fff; font-weight: 600; cursor: pointer; transition: background .2s;
}
.btn-confirm-delete:hover { background: #dc2626; }
.btn-save {
  flex: 1; padding: 10px; border: none; border-radius: 8px;
  background: #f5a623; color: #fff; font-weight: 600; cursor: pointer; transition: background .2s;
}
.btn-save:hover { background: #e09610; }

.reply-original {
  background: #f8f9fb; border-left: 3px solid #f5a623;
  padding: 10px 14px; border-radius: 4px; text-align: left;
  margin-bottom: 16px; font-size: 0.875rem; color: #64748b;
}
.reply-textarea {
  width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0;
  border-radius: 8px; font-size: 0.875rem; font-family: inherit;
  outline: none; resize: vertical; margin-bottom: 20px; box-sizing: border-box;
}
.reply-textarea:focus { border-color: #f5a623; }

/* ─── Toast ───────────────────────────────────────────── */
.toast {
  position: fixed; bottom: 32px; right: 32px; color: #fff;
  padding: 12px 20px; border-radius: 10px; font-size: 0.875rem; font-weight: 500;
  display: flex; align-items: center; gap: 10px; z-index: 2000;
  box-shadow: 0 4px 16px rgba(0,0,0,.15); background: #1e293b;
}
.toast.delete  { background: #dc2626; }
.toast.success { background: #059669; }
.toast-enter-active, .toast-leave-active { transition: all .3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }

:deep(svg) { flex-shrink: 0; stroke-width: 2; color: currentColor; }
</style>