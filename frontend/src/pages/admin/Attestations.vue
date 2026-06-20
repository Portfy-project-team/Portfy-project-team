<template>
  <div class="admin-attestations-page">
    <AdminSidebar />

    <div class="admin-main">
      <AdminTopbar title="Validation des attestations" />

      <main class="admin-content">
        <section class="page-header">
          <h1>Documents en attente</h1>
          <p>{{ pendingDocuments.length }} attestations a verifier et valider</p>
        </section>

        <section class="tabs">
          <button
            type="button"
            :class="{ active: selectedType === 'TOUS' }"
            @click="selectedType = 'TOUS'"
          >
            Tous ({{ pendingDocuments.length }})
          </button>

          <button
            type="button"
            :class="{ active: selectedType === 'DIPLOMES' }"
            @click="selectedType = 'DIPLOMES'"
          >
            Diplomes ({{ countByType('DIPLOMES') }})
          </button>

          <button
            type="button"
            :class="{ active: selectedType === 'STAGES' }"
            @click="selectedType = 'STAGES'"
          >
            Stages ({{ countByType('STAGES') }})
          </button>

          <button
            type="button"
            :class="{ active: selectedType === 'CERTIFICATIONS' }"
            @click="selectedType = 'CERTIFICATIONS'"
          >
            Certifications ({{ countByType('CERTIFICATIONS') }})
          </button>
        </section>

        <section class="documents-list">
          <article
            v-for="attestation in filteredDocuments"
            :key="attestation.id"
            class="document-card"
            :class="typeBorderClass(attestation.type)"
          >
            <div class="document-left">
              <div class="document-icon" :class="typeIconClass(attestation.type)">
                <span></span>
              </div>

              <div class="document-info">
                <div class="title-row">
                  <h2>{{ attestation.title }}</h2>
                  <span class="type-badge" :class="typeBadgeClass(attestation.type)">
                    {{ attestation.type }}
                  </span>
                </div>

                <p>
                  Soumis par <strong>{{ attestation.student }}</strong>
                  - {{ attestation.establishment }}
                </p>

                <div class="meta">
                  <span>📄 {{ attestation.filePath }}</span>
                  <span>🗓️ Soumis le {{ formatDate(attestation.submittedDate) }}</span>
                </div>
              </div>
            </div>

            <div class="document-actions">
              <button
                class="validate-btn"
                type="button"
                @click="validateDocument(attestation.id)"
              >
                Valider
              </button>

              <button
                class="reject-btn"
                type="button"
                @click="rejectDocument(attestation.id)"
              >
                Refuser
              </button>

              <button
                class="details-btn"
                type="button"
                @click="openDetails(attestation)"
              >
                Voir details
              </button>
            </div>
          </article>

          <div v-if="filteredDocuments.length === 0" class="empty-state">
            <h3>Aucun document trouve</h3>
            <p>Aucune attestation ne correspond au filtre selectionne.</p>
          </div>
        </section>
      </main>
    </div>

    <div v-if="selectedDocument" class="modal-overlay" @click.self="closeDetails">
      <div class="modal">
        <div class="modal-header">
          <h2>Details de l'attestation</h2>
          <button type="button" @click="closeDetails">×</button>
        </div>

        <div class="modal-body">
          <p><strong>Titre:</strong> {{ selectedDocument.title }}</p>
          <p><strong>Etudiant:</strong> {{ selectedDocument.student }}</p>
          <p><strong>Etablissement:</strong> {{ selectedDocument.establishment }}</p>
          <p><strong>Type:</strong> {{ selectedDocument.type }}</p>
          <p><strong>Fichier:</strong> {{ selectedDocument.filePath }}</p>
          <p><strong>Date:</strong> {{ formatDate(selectedDocument.submittedDate) }}</p>
        </div>

        <div class="modal-actions">
          <button class="reject-btn" type="button" @click="rejectFromModal">
            Refuser
          </button>

          <button class="validate-btn" type="button" @click="validateFromModal">
            Valider
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminTopbar from '@/components/admin/AdminTopbar.vue'
import { useAdminStore } from '@/store/admin/adminStore'
import { useAttestationStore } from '@/store/admin/attestationsStore'

const adminStore = useAdminStore()
const attestationStore = useAttestationStore()

onMounted(async () => {
  await attestationStore.fetchAttestations()
})

const selectedType = ref('TOUS')
const pendingDocuments = computed(() => attestationStore.attestations)

const filteredDocuments = computed(() => {
  if (selectedType.value === 'TOUS') return pendingDocuments.value
  return pendingDocuments.value.filter((doc) => doc.type === selectedType.value)
})

const countByType = (type) => {
  return pendingDocuments.value.filter((doc) => doc.type === type).length
}

const validateDocument = async (id) => {
  try {
    await attestationStore.validateAttestation(id)
    alert('Attestation validee.')
  } catch (err) {
    alert('Erreur lors de la validation.')
  }
}

const rejectDocument = async (id) => {
  try {
    await attestationStore.rejectAttestation(id)
    alert('Attestation refusee.')
  } catch (err) {
    alert('Erreur lors du refus.')
  }
}

const selectedDocument = ref(null)

const openDetails = (doc) => {
  selectedDocument.value = doc
}

const closeDetails = () => {
  selectedDocument.value = null
}

const validateFromModal = () => {
  if (selectedDocument.value) {
    validateDocument(selectedDocument.value.id)
    closeDetails()
  }
}

const rejectFromModal = () => {
  if (selectedDocument.value) {
    rejectDocument(selectedDocument.value.id)
    closeDetails()
  }
}

const formatDate = (dateStr) => {
  if (!dateStr || dateStr === 'N/A') return 'Non precisee'
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

const typeBorderClass = (type) => {
  if (type === 'DIPLOMES') return 'blue-border'
  if (type === 'STAGES') return 'green-border'
  if (type === 'CERTIFICATIONS') return 'orange-border'
  return ''
}

const typeIconClass = (type) => {
  if (type === 'DIPLOMES') return 'blue-icon'
  if (type === 'STAGES') return 'green-icon'
  if (type === 'CERTIFICATIONS') return 'orange-icon'
  return ''
}

const typeBadgeClass = (type) => {
  if (type === 'DIPLOMES') return 'blue-badge'
  if (type === 'STAGES') return 'green-badge'
  if (type === 'CERTIFICATIONS') return 'orange-badge'
  return ''
}

const studentBranch = (type) => {
  return 'Genie Logiciel' // Simplified
}
</script>

<style scoped>
.admin-attestations-page {
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

.page-header h1 {
  margin: 0;
  color: #000;
  font-size: 22px;
  font-weight: 900;
}

.page-header p {
  margin: 4px 0 0;
  color: #526b82;
  font-size: 13px;
}

.tabs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 0;
}

.tabs button {
  border: 1px solid #dce4ea;
  background: #fff;
  color: #062f4f;
  border-radius: 999px;
  padding: 7px 18px;
  font-weight: 700;
  cursor: pointer;
}

.tabs button.active {
  background: #062f4f;
  color: #fff;
  border-color: #062f4f;
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.document-card {
  background: #fff;
  border: 1px solid #dce4ea;
  border-left: 4px solid #062f4f;
  border-radius: 9px;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.blue-border { border-left-color: #1478f2; }
.green-border { border-left-color: #00a862; }
.orange-border { border-left-color: #f5a400; }

.document-left {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  flex: 1;
}

.document-icon {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: #eee;
  flex-shrink: 0;
}

.blue-icon { background: #d9efff; }
.green-icon { background: #cef7df; }
.orange-icon { background: #fff0cd; }

.document-info {
  flex: 1;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.title-row h2 {
  margin: 0;
  color: #000;
  font-size: 17px;
  font-weight: 900;
}

.type-badge {
  font-size: 11px;
  font-weight: 900;
  padding: 3px 8px;
  border-radius: 4px;
}

.blue-badge { background: #d9efff; color: #1478f2; }
.green-badge { background: #cef7df; color: #00a862; }
.orange-badge { background: #fff0cd; color: #f5a400; }

.document-info p {
  margin: 0 0 8px;
  color: #526b82;
  font-size: 13px;
}

.meta {
  display: flex;
  gap: 15px;
  color: #647585;
  font-size: 12px;
}

.document-actions {
  display: flex;
  gap: 8px;
}

.validate-btn, .reject-btn, .details-btn {
  border-radius: 7px;
  font-weight: 900;
  padding: 8px 14px;
  cursor: pointer;
}

.validate-btn { border: none; background: #00a862; color: #fff; }
.reject-btn { border: 1px solid #ff2d2d; background: #fff; color: #e52525; }
.details-btn { border: 1px solid #dce4ea; background: #fff; color: #062f4f; }

.empty-state {
  background: #fff;
  border: 1px solid #dce4ea;
  border-radius: 9px;
  padding: 40px;
  text-align: center;
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
  width: 450px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
