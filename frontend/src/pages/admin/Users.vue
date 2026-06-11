<template>
  <div class="admin-users-page">
    <AdminSidebar />

    <div class="admin-main">
      <AdminTopbar title="Gestion des utilisateurs" />

      <main class="admin-content">
        <section class="page-header">
          <div>
            <h1>Tous les utilisateurs</h1>
            <p>{{ totalDisplayed }} utilisateurs au total</p>
          </div>

          <button class="add-btn" type="button" @click="openAddModal">
            + Ajouter utilisateur
          </button>
        </section>

        <section class="filters-card">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher par email, role ou statut..."
          />

          <select v-model="selectedRole">
            <option value="">Tous roles</option>
            <option value="STUDENT">Etudiant</option>
            <option value="PROF">Professeur</option>
            <option value="PRO">Professionnel</option>
            <option value="ADMIN">Administrateur</option>
          </select>

          <select v-model="selectedStatus">
            <option value="">Tous statuts</option>
            <option value="ACTIVE">Actif</option>
            <option value="PENDING">En attente</option>
            <option value="BLOCKED">Suspendu</option>
            <option value="REJECTED">Refuse</option>
          </select>
        </section>

        <p v-if="adminStore.error" class="empty">
          {{ adminStore.error }}
        </p>

        <section class="table-card">
          <table>
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Role</th>
                <th>Statut</th>
                <th>Cree le</th>
                <th class="actions-head">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="adminStore.loading">
                <td colspan="5" class="empty">Chargement...</td>
              </tr>

              <template v-else>
                <tr v-for="user in paginatedUsers" :key="user.id">
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar" :class="avatarClass(user.role)">
                        {{ getInitials(user.email) }}
                      </div>

                      <div>
                        <h3>{{ getDisplayName(user.email) }}</h3>
                        <p>{{ user.email }}</p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span class="badge" :class="roleClass(user.role)">
                      {{ formatRole(user.role) }}
                    </span>
                  </td>

                  <td>
                    <span class="status" :class="statusClass(user.status)">
                      {{ formatStatus(user.status) }}
                    </span>
                  </td>

                  <td>{{ formatDate(user.createdAt) }}</td>

                  <td>
                    <div class="actions">
                      <button class="view" type="button" @click="viewUser(user.id)">
                        Voir
                      </button>

                      <button
                        v-if="user.status === 'ACTIVE'"
                        class="danger"
                        type="button"
                        @click="suspendUser(user.id)"
                      >
                        Suspendre
                      </button>

                      <button
                        v-else-if="user.status === 'BLOCKED' || user.status === 'REJECTED'"
                        class="success"
                        type="button"
                        @click="reactivateUser(user.id)"
                      >
                        Reactiver
                      </button>

                      <template v-else>
                        <button
                          class="success"
                          type="button"
                          @click="validateUser(user.id)"
                        >
                          Valider
                        </button>

                        <button
                          class="danger"
                          type="button"
                          @click="refuseUser(user.id)"
                        >
                          Refuser
                        </button>
                      </template>
                    </div>
                  </td>
                </tr>
              </template>

              <tr v-if="!adminStore.loading && paginatedUsers.length === 0">
                <td colspan="5" class="empty">
                  Aucun utilisateur trouve.
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="pagination-row">
          <p>
            Affichage {{ startItem }}-{{ endItem }} sur {{ filteredUsers.length }}
          </p>

          <div class="pagination">
            <button type="button" :disabled="currentPage === 1" @click="previousPage">
              Precedent
            </button>

            <button
              v-for="page in totalPages"
              :key="page"
              type="button"
              :class="{ active: page === currentPage }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>

            <button
              type="button"
              :disabled="currentPage === totalPages"
              @click="nextPage"
            >
              Suivant
            </button>
          </div>
        </section>
      </main>
    </div>

    <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Ajouter utilisateur</h2>
          <button type="button" @click="closeAddModal">×</button>
        </div>

        <form class="modal-form" @submit.prevent="addUser">
          <label>
            Email
            <input v-model="newUser.email" type="email" required />
          </label>

          <label>
            Mot de passe
            <input
              v-model="newUser.password"
              type="password"
              minlength="8"
              required
            />
          </label>

          <label>
            Role
            <select v-model="newUser.role" required>
              <option value="STUDENT">Etudiant</option>
              <option value="PROF">Professeur</option>
              <option value="PRO">Professionnel</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </label>

          <div class="modal-actions">
            <button class="cancel-btn" type="button" @click="closeAddModal">
              Annuler
            </button>

            <button class="save-btn" type="submit" :disabled="adminStore.loading">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminTopbar from '@/components/admin/AdminTopbar.vue'
import { useAdminStore } from '@/store/admin/adminStore'

const router = useRouter()
const adminStore = useAdminStore()

const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const perPage = 4
const showAddModal = ref(false)

const newUser = reactive({
  email: '',
  password: '',
  role: 'STUDENT'
})

onMounted(() => {
  adminStore.fetchUsers()
})

const totalDisplayed = computed(() => {
  return adminStore.users.length.toLocaleString('fr-FR')
})

const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  return adminStore.users.filter((user) => {
    const email = user.email || ''
    const role = user.role || ''
    const status = user.status || ''

    const matchSearch =
      email.toLowerCase().includes(query) ||
      role.toLowerCase().includes(query) ||
      status.toLowerCase().includes(query) ||
      formatRole(role).toLowerCase().includes(query) ||
      formatStatus(status).toLowerCase().includes(query)

    const matchRole = selectedRole.value ? role === selectedRole.value : true
    const matchStatus = selectedStatus.value ? status === selectedStatus.value : true

    return matchSearch && matchRole && matchStatus
  })
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredUsers.value.length / perPage))
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredUsers.value.slice(start, start + perPage)
})

const startItem = computed(() => {
  if (filteredUsers.value.length === 0) return 0
  return (currentPage.value - 1) * perPage + 1
})

const endItem = computed(() => {
  return Math.min(currentPage.value * perPage, filteredUsers.value.length)
})

watch([searchQuery, selectedRole, selectedStatus], () => {
  currentPage.value = 1
})

const formatRole = (role) => {
  return {
    STUDENT: 'Etudiant',
    PROF: 'Professeur',
    PRO: 'Professionnel',
    ADMIN: 'Administrateur'
  }[role] || role
}

const formatStatus = (status) => {
  return {
    ACTIVE: 'Actif',
    PENDING: 'En attente',
    BLOCKED: 'Suspendu',
    REJECTED: 'Refuse'
  }[status] || status
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR')
}

const getDisplayName = (email) => {
  if (!email) return 'Utilisateur'
  return email.split('@')[0]
}

const getInitials = (email) => {
  return getDisplayName(email)
    .split(/[._-]/)
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const avatarClass = (role) => {
  return {
    STUDENT: 'student-avatar',
    PROF: 'professor-avatar',
    PRO: 'pro-avatar',
    ADMIN: 'admin-avatar'
  }[role]
}

const roleClass = (role) => {
  return {
    STUDENT: 'role-student',
    PROF: 'role-professor',
    PRO: 'role-pro',
    ADMIN: 'role-admin'
  }[role]
}

const statusClass = (status) => {
  return {
    ACTIVE: 'status-active',
    BLOCKED: 'status-suspended',
    PENDING: 'status-pending',
    REJECTED: 'status-rejected'
  }[status]
}

const viewUser = (id) => {
  router.push(`/admin/users/${id}`)
}

const suspendUser = async (id) => {
  await adminStore.updateUserStatus(id, 'BLOCKED')
}

const reactivateUser = async (id) => {
  await adminStore.updateUserStatus(id, 'ACTIVE')
}

const validateUser = async (id) => {
  await adminStore.approveUser(id)
}

const refuseUser = async (id) => {
  await adminStore.rejectUser(id, 'Refuse par administrateur')
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const openAddModal = () => {
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
  newUser.email = ''
  newUser.password = ''
  newUser.role = 'STUDENT'
}

const addUser = async () => {
  await adminStore.addUser({
    email: newUser.email,
    password: newUser.password,
    role: newUser.role
  })

  closeAddModal()
}
</script>

<style scoped>
.admin-users-page {
  min-height: 100vh;
  display: flex;
  background: #f4f1ed;
  color: #062f4f;
}

.admin-main {
  flex: 1;
  min-width: 0;
}

.admin-content {
  padding: 20px 22px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.page-header h1 {
  margin: 0;
  color: #000;
  font-size: 22px;
  font-weight: 900;
}

.page-header p {
  margin: 4px 0 0;
  color: #4f6780;
  font-size: 13px;
}

.add-btn {
  border: none;
  background: #062f4f;
  color: #fff;
  border-radius: 7px;
  padding: 10px 18px;
  font-weight: 800;
  cursor: pointer;
}

.add-btn:hover {
  background: #041f34;
}

.filters-card {
  background: #fff;
  border: 1px solid #dce4ea;
  border-radius: 9px;
  padding: 13px;
  display: grid;
  grid-template-columns: 1fr 170px 170px;
  gap: 10px;
  margin-bottom: 15px;
}

.filters-card input,
.filters-card select {
  height: 38px;
  border: 1px solid #d9e1e8;
  border-radius: 6px;
  padding: 0 13px;
  background: #fff;
  color: #162f44;
  outline: none;
}

.filters-card input:focus,
.filters-card select:focus {
  border-color: #062f4f;
}

.table-card {
  background: #fff;
  border: 1px solid #dce4ea;
  border-radius: 9px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f6f8fa;
}

th {
  text-align: left;
  padding: 14px 18px;
  color: #52677d;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 900;
}

.actions-head {
  text-align: right;
}

td {
  padding: 12px 18px;
  border-top: 1px solid #e1e7ec;
  font-size: 13px;
  color: #062f4f;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #062f4f;
  font-size: 12px;
  font-weight: 900;
}

.student-avatar {
  background: #fff0cd;
}

.professor-avatar {
  background: #eee8ff;
  color: #6647d9;
}

.pro-avatar {
  background: #cef7df;
  color: #098a51;
}

.admin-avatar {
  background: #d9efff;
}

.user-cell h3 {
  margin: 0;
  color: #000;
  font-size: 14px;
  font-weight: 900;
}

.user-cell p {
  margin: 2px 0 0;
  color: #4f6780;
  font-size: 11px;
}

.badge,
.status {
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 800;
}

.role-student {
  background: #d9efff;
  color: #0070c9;
}

.role-professor {
  background: #fff0cd;
  color: #c27b00;
}

.role-pro {
  background: #cef7df;
  color: #00834b;
}

.role-admin {
  background: #e9e9e9;
  color: #333;
}

.status-active {
  background: #cef7df;
  color: #00834b;
}

.status-suspended {
  background: #ffd9d9;
  color: #d71919;
}

.status-pending {
  background: #fff0cd;
  color: #c27b00;
}

.status-rejected {
  background: #ececec;
  color: #4f4f4f;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 26px;
}

.actions button {
  border: none;
  background: transparent;
  font-weight: 800;
  cursor: pointer;
}

.actions .view {
  color: #f5a400;
}

.actions .danger {
  color: #e52525;
}

.actions .success {
  color: #00834b;
}

.empty {
  text-align: center;
  color: #6b7d8d;
  padding: 30px;
}

.pagination-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}

.pagination-row p {
  color: #52677d;
  font-size: 12px;
}

.pagination {
  display: flex;
  gap: 7px;
}

.pagination button {
  border: 1px solid #dce4ea;
  background: #fff;
  border-radius: 6px;
  padding: 6px 11px;
  cursor: pointer;
}

.pagination button.active {
  background: #062f4f;
  color: #fff;
  border-color: #062f4f;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  width: 440px;
  background: #fff;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.modal-header h2 {
  margin: 0;
  color: #000;
}

.modal-header button {
  border: none;
  background: transparent;
  font-size: 26px;
  cursor: pointer;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.modal-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #233b50;
  font-size: 13px;
  font-weight: 700;
}

.modal-form input,
.modal-form select {
  height: 39px;
  border: 1px solid #d9e1e8;
  border-radius: 7px;
  padding: 0 12px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.cancel-btn,
.save-btn {
  border: none;
  border-radius: 7px;
  padding: 9px 14px;
  font-weight: 800;
  cursor: pointer;
}

.cancel-btn {
  background: #e9edf1;
  color: #062f4f;
}

.save-btn {
  background: #062f4f;
  color: white;
}

@media (max-width: 1000px) {
  .filters-card {
    grid-template-columns: 1fr 1fr;
  }

  .table-card {
    overflow-x: auto;
  }
}

@media (max-width: 760px) {
  .admin-users-page {
    flex-direction: column;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .filters-card {
    grid-template-columns: 1fr;
  }

  .pagination-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
