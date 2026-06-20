<template>
  <div class="admin-establishments-page">
    <AdminSidebar />

    <div class="admin-main">
      <AdminTopbar title="Etablissements" />

      <main class="admin-content">
        <section class="page-header">
          <div>
            <h1>Gestion des etablissements</h1>
            <p>{{ establishments.length }} ecoles et universites inscrites</p>
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
import { computed, reactive, ref, onMounted } from 'vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminTopbar from '@/components/admin/AdminTopbar.vue'
import { useEstablishmentStore } from '@/store/admin/establishmentsStore'

const establishmentStore = useEstablishmentStore()

onMounted(async () => {
  await establishmentStore.fetchEstablishments()
})

const establishments = computed(() => establishmentStore.establishments)

const showModal = ref(false)
const modalMode = ref('add')
const selectedId = ref(null)

const form = reactive({
  code: '',
  name: '',
  city: '',
  status: 'Actif'
})

const openAddModal = () => {
  modalMode.value = 'add'
  selectedId.value = null
  form.code = ''
  form.name = ''
  form.city = ''
  form.status = 'Actif'
  showModal.value = true
}

const openManageModal = (est) => {
  modalMode.value = 'edit'
  selectedId.value = est.id
  form.code = est.code
  form.name = est.name
  form.city = est.city
  form.status = est.status
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveEstablishment = async () => {
  try {
    if (modalMode.value === 'add') {
      await establishmentStore.createEstablishment({
        name: form.name,
        code: form.code,
        city: form.city
      })
      alert('Etablissement ajoute avec succes.')
    } else {
      await establishmentStore.updateEstablishment(selectedId.value, { 
        name: form.name, 
        code: form.code,
        city: form.city 
      })
      alert('Modifications enregistrees.')
    }
    closeModal()
  } catch (err) {
    alert('Erreur lors de la sauvegarde : ' + (err.response?.data?.message || err.message))
  }
}

const validateEstablishment = async (id) => {
  try {
    await establishmentStore.updateEstablishment(id, { status: 'Actif' })
    alert('Etablissement valide.')
  } catch (err) {
    alert('Erreur lors de la validation.')
  }
}

const statusClass = (status) => {
  if (status === 'Actif') return 'active'
  if (status === 'En attente') return 'pending'
  return 'inactive'
}

const logoClass = (status) => {
  if (status === 'Actif') return 'blue-logo'
  return 'gray-logo'
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 900;
}

.add-btn {
  background: #062f4f;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 7px;
  font-weight: 900;
  cursor: pointer;
}

.establishments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
}

.establishment-card {
  background: #fff;
  border: 1px solid #dce4ea;
  border-radius: 12px;
  padding: 18px;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.school-info {
  display: flex;
  gap: 12px;
}

.school-logo {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: #fff;
}

.blue-logo { background: #1478f2; }
.gray-logo { background: #94a3b8; }

.school-info h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 900;
}

.school-info p {
  margin: 3px 0 0;
  font-size: 12px;
  color: #647585;
}

.status {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 5px;
  font-weight: 900;
}

.status.active { background: #cef7df; color: #00a862; }
.status.pending { background: #fff0cd; color: #f5a400; }

.divider {
  height: 1px;
  background: #edf1f4;
  margin: 15px 0;
}

.school-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.school-stats span {
  display: block;
  font-size: 10px;
  color: #647585;
}

.school-stats strong {
  display: block;
  font-size: 14px;
  color: #000;
}

.manage-btn, .validate-btn {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  font-weight: 900;
  cursor: pointer;
}

.manage-btn {
  border: 1px solid #dce4ea;
  background: #fff;
}

.validate-btn {
  border: none;
  background: #00a862;
  color: #fff;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 400px;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #062f4f;
  font-weight: 900;
}

.modal-header button {
  border: none;
  background: #f1f5f9;
  font-size: 22px;
  color: #647585;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-header button:hover {
  background: #ffeded;
  color: #e52525;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.modal-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 800;
  color: #314b62;
}

.modal-form input, .modal-form select {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #dce4ea;
  font-size: 14px;
  color: #062f4f;
  outline: none;
  transition: border-color 0.2s;
}

.modal-form input:focus {
  border-color: #062f4f;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn {
  background: #fff;
  border: 1px solid #dce4ea;
  color: #51697e;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f8fafc;
  color: #062f4f;
  border-color: #cbd5e1;
}

.save-btn {
  background: #062f4f;
  border: none;
  color: #fff;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 900;
  cursor: pointer;
  transition: background 0.2s;
}

.save-btn:hover {
  background: #041f34;
}
</style>
