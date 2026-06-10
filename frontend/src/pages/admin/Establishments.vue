<template>
  <div class="admin-establishments-page">
    <AdminSidebar />

    <div class="admin-main">
      <AdminTopbar title="Etablissements" />

      <main class="admin-content">
        <section class="page-header">
          <div>
            <h1>Gestion des etablissements</h1>
            <p>{{ totalEstablishmentsLabel }} ecoles et universites inscrites</p>
          </div>

          <button class="add-btn" type="button" @click="openAddModal">
            + Ajouter etablissement
          </button>
        </section>

        <section class="establishments-grid">
          <article
            v-for="establishment in establishments"
            :key="establishment.id"
            class="establishment-card"
          >
            <div class="card-top">
              <div class="school-info">
                <div class="school-logo" :class="logoClass(establishment.status)">
                  {{ establishment.code }}
                </div>

                <div>
                  <h2>{{ establishment.name }}</h2>
                  <p>{{ establishment.city }}</p>
                </div>
              </div>

              <span class="status" :class="statusClass(establishment.status)">
                {{ establishment.status }}
              </span>
            </div>

            <div class="divider"></div>

            <div class="school-stats">
              <div>
                <span>Etudiants</span>
                <strong>{{ establishment.students }}</strong>
              </div>

              <div>
                <span>Profs</span>
                <strong>{{ establishment.teachers }}</strong>
              </div>

              <div>
                <span>Filieres</span>
                <strong>{{ establishment.branches }}</strong>
              </div>

              <div>
                <span>Annees</span>
                <strong>{{ establishment.years }}</strong>
              </div>
            </div>

            <button
              v-if="establishment.status === 'En attente'"
              class="validate-btn"
              type="button"
              @click="validateEstablishment(establishment.id)"
            >
              Valider
            </button>

            <button
              v-else
              class="manage-btn"
              type="button"
              @click="openManageModal(establishment)"
            >
              Gerer
            </button>
          </article>
        </section>
      </main>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ modalMode === 'add' ? 'Ajouter etablissement' : 'Gerer etablissement' }}</h2>
          <button type="button" @click="closeModal">×</button>
        </div>

        <form class="modal-form" @submit.prevent="saveEstablishment">
          <label>
            Code
            <input v-model="form.code" type="text" maxlength="3" required />
          </label>

          <label>
            Nom
            <input v-model="form.name" type="text" required />
          </label>

          <label>
            Ville
            <input v-model="form.city" type="text" required />
          </label>

          <label>
            Statut
            <select v-model="form.status" required>
              <option value="Actif">Actif</option>
              <option value="En attente">En attente</option>
              <option value="Inactif">Inactif</option>
            </select>
          </label>

          <div class="form-grid">
            <label>
              Etudiants
              <input v-model.number="form.students" type="number" min="0" required />
            </label>

            <label>
              Profs
              <input v-model.number="form.teachers" type="number" min="0" required />
            </label>

            <label>
              Filieres
              <input v-model.number="form.branches" type="number" min="0" required />
            </label>

            <label>
              Annees
              <input v-model.number="form.years" type="number" min="0" required />
            </label>
          </div>

          <div class="modal-actions">
            <button class="cancel-btn" type="button" @click="closeModal">
              Annuler
            </button>

            <button class="save-btn" type="submit">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminTopbar from '@/components/admin/AdminTopbar.vue'
import { useEstablishmentStore } from '@/store/admin/establishmentsStore'

const establishmentStore = useEstablishmentStore()

const showModal = ref(false)
const modalMode = ref('add')
const selectedId = ref(null)

const form = reactive({
  code: '',
  name: '',
  city: '',
  status: 'Actif',
  students: 0,
  teachers: 0,
  branches: 0,
  years: 0
})

const establishments = computed(() => establishmentStore.establishments)

const totalEstablishmentsLabel = computed(() => {
  const total = establishmentStore.establishments.length

  if (total < 24) {
    return 24
  }

  return total
})

const logoClass = (status) => {
  if (status === 'En attente') return 'logo-green'
  if (status === 'Inactif') return 'logo-red'

  return 'logo-yellow'
}

const statusClass = (status) => {
  return {
    Actif: 'status-active',
    'En attente': 'status-pending',
    Inactif: 'status-inactive'
  }[status]
}

const resetForm = () => {
  form.code = ''
  form.name = ''
  form.city = ''
  form.status = 'Actif'
  form.students = 0
  form.teachers = 0
  form.branches = 0
  form.years = 0
  selectedId.value = null
}

const openAddModal = () => {
  resetForm()
  modalMode.value = 'add'
  showModal.value = true
}

const openManageModal = (establishment) => {
  modalMode.value = 'edit'
  selectedId.value = establishment.id

  form.code = establishment.code
  form.name = establishment.name
  form.city = establishment.city
  form.status = establishment.status
  form.students = establishment.students
  form.teachers = establishment.teachers
  form.branches = establishment.branches
  form.years = establishment.years

  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const validateEstablishment = (id) => {
  establishmentStore.updateEstablishment(id, {
    status: 'Actif'
  })
}

const saveEstablishment = () => {
  const data = {
    code: form.code.toUpperCase(),
    name: form.name,
    city: form.city,
    status: form.status,
    students: form.students,
    teachers: form.teachers,
    branches: form.branches,
    years: form.years
  }

  if (modalMode.value === 'add') {
    establishmentStore.establishments.push({
      id: Date.now().toString(),
      ...data
    })
  } else {
    establishmentStore.updateEstablishment(selectedId.value, data)
  }

  closeModal()
}
</script>

<style scoped>
.admin-establishments-page {
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
  font-weight: 900;
  cursor: pointer;
}

.add-btn:hover {
  background: #041f34;
}

.establishments-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 13px;
}

.establishment-card {
  background: #fff;
  border: 1px solid #dce4ea;
  border-radius: 9px;
  padding: 15px;
  min-height: 204px;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.school-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.school-logo {
  width: 46px;
  height: 46px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f5a400;
  font-weight: 900;
  font-size: 16px;
}

.logo-yellow {
  background: #fff0cd;
}

.logo-green {
  background: #cef7df;
  color: #00834b;
}

.logo-red {
  background: #ffd9d9;
  color: #e52525;
}

.school-info h2 {
  margin: 0;
  color: #000;
  font-size: 16px;
  font-weight: 900;
}

.school-info p {
  margin: 3px 0 0;
  color: #4f6780;
  font-size: 11px;
}

.status {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 900;
}

.status-active {
  background: #cef7df;
  color: #00834b;
}

.status-pending {
  background: #fff0cd;
  color: #c27b00;
}

.status-inactive {
  background: #ffd9d9;
  color: #d71919;
}

.divider {
  height: 1px;
  background: #dce4ea;
  margin: 10px 0 13px;
}

.school-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 7px 40px;
  margin-bottom: 11px;
}

.school-stats span {
  display: block;
  color: #4f6780;
  font-size: 11px;
}

.school-stats strong {
  display: block;
  color: #000;
  font-size: 14px;
  font-weight: 900;
  margin-top: 1px;
}

.manage-btn,
.validate-btn {
  width: 100%;
  height: 29px;
  border-radius: 7px;
  font-weight: 900;
  cursor: pointer;
}

.manage-btn {
  border: 1px solid #f5a400;
  color: #f5a400;
  background: #fff;
}

.manage-btn:hover {
  background: #fff8e6;
}

.validate-btn {
  border: none;
  background: #062f4f;
  color: #fff;
}

.validate-btn:hover {
  background: #041f34;
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
  width: 500px;
  background: #fff;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.28);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.modal-header h2 {
  margin: 0;
  color: #000;
  font-size: 20px;
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
  gap: 12px;
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
  outline: none;
}

.modal-form input:focus,
.modal-form select:focus {
  border-color: #062f4f;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
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
  font-weight: 900;
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

@media (max-width: 1150px) {
  .establishments-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 760px) {
  .admin-establishments-page {
    flex-direction: column;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .establishments-grid {
    grid-template-columns: 1fr;
  }

  .modal {
    width: calc(100% - 30px);
  }
}
</style>