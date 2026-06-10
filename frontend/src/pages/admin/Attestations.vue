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
                  - {{ studentBranch(attestation.type) }}
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
import { computed, ref } from 'vue'

import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminTopbar from '@/components/admin/AdminTopbar.vue'
import { useAttestationStore } from '@/store/admin/attestationsStore'

const attestationStore = useAttestationStore()

const selectedType = ref('TOUS')
const selectedDocument = ref(null)

const pendingDocuments = computed(() => {
  return attestationStore.attestations.filter((attestation) => {
    return attestation.status === 'A_VALIDER'
  })
})

const filteredDocuments = computed(() => {
  if (selectedType.value === 'TOUS') {
    return pendingDocuments.value
  }

  return pendingDocuments.value.filter((attestation) => {
    return attestation.type === selectedType.value
  })
})

const countByType = (type) => {
  return pendingDocuments.value.filter((attestation) => attestation.type === type).length
}

const validateDocument = (id) => {
  attestationStore.validateAttestation(id)
}

const rejectDocument = (id) => {
  attestationStore.rejectAttestation(id)
}

const openDetails = (attestation) => {
  selectedDocument.value = attestation
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

const formatDate = (dateValue) => {
  const date = new Date(dateValue)

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const studentBranch = (type) => {
  if (type === 'STAGES') return 'Genie Informatique'
  if (type === 'CERTIFICATIONS') return 'Genie Informatique'
  return 'Genie Industriel'
}

const typeBorderClass = (type) => {
  return {
    DIPLOMES: 'border-yellow',
    STAGES: 'border-purple',
    CERTIFICATIONS: 'border-blue'
  }[type]
}

const typeIconClass = (type) => {
  return {
    DIPLOMES: 'icon-yellow',
    STAGES: 'icon-purple',
    CERTIFICATIONS: 'icon-blue'
  }[type]
}

const typeBadgeClass = (type) => {
  return {
    DIPLOMES: 'badge-yellow',
    STAGES: 'badge-purple',
    CERTIFICATIONS: 'badge-blue'
  }[type]
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

.page-header {
  margin-bottom: 12px;
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

.tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
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
  gap: 13px;
}

.document-card {
  min-height: 122px;
  background: #fff;
  border: 1px solid #dce4ea;
  border-left: 4px solid #f9b31b;
  border-radius: 9px;
  padding: 15px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.border-yellow {
  border-left-color: #f9b31b;
}

.border-blue {
  border-left-color: #1e8ee6;
}

.border-purple {
  border-left-color: #7257ff;
}

.document-left {
  display: flex;
  align-items: center;
  gap: 13px;
}

.document-icon {
  width: 62px;
  height: 75px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.document-icon span {
  width: 30px;
  height: 39px;
  border-radius: 4px;
  background: #fff;
}

.icon-yellow {
  background: #fff0cd;
}

.icon-yellow span {
  border: 1.5px solid #f9b31b;
}

.icon-blue {
  background: #d9efff;
}

.icon-blue span {
  border: 1.5px solid #1e72c9;
}

.icon-purple {
  background: #eee8ff;
}

.icon-purple span {
  border: 1.5px solid #7257ff;
}

.document-info {
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-wrap: wrap;
}

.title-row h2 {
  margin: 0;
  color: #000;
  font-size: 17px;
  font-weight: 900;
}

.type-badge {
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 900;
}

.badge-yellow {
  background: #fff0cd;
  color: #cc8200;
}

.badge-blue {
  background: #d9efff;
  color: #0869bd;
}

.badge-purple {
  background: #eee8ff;
  color: #5d43d8;
}

.document-info p {
  margin: 5px 0;
  color: #51697e;
  font-size: 13px;
}

.document-info strong {
  color: #000;
}

.meta {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #51697e;
  font-size: 12px;
  flex-wrap: wrap;
}

.document-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 7px;
}

.validate-btn,
.reject-btn,
.details-btn {
  border-radius: 7px;
  font-weight: 900;
  cursor: pointer;
}

.validate-btn {
  min-width: 82px;
  border: none;
  background: #07823f;
  color: #fff;
  padding: 8px 15px;
}

.validate-btn:hover {
  background: #056d35;
}

.reject-btn {
  min-width: 82px;
  border: 1px solid #ffc4c4;
  background: #fff;
  color: #e52525;
  padding: 7px 15px;
}

.reject-btn:hover {
  background: #fff1f1;
}

.details-btn {
  border: none;
  background: transparent;
  color: #f5a400;
  padding: 3px 0;
}

.details-btn:hover {
  text-decoration: underline;
}

.empty-state {
  background: #fff;
  border: 1px solid #dce4ea;
  border-radius: 9px;
  padding: 40px;
  text-align: center;
}

.empty-state h3 {
  margin: 0;
  color: #000;
}

.empty-state p {
  color: #51697e;
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
  width: 460px;
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

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 9px;
  color: #334d63;
}

.modal-body p {
  margin: 0;
}

.modal-body strong {
  color: #000;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

@media (max-width: 850px) {
  .document-card {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
  }

  .document-actions {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
}

@media (max-width: 760px) {
  .admin-attestations-page {
    flex-direction: column;
  }

  .tabs {
    flex-wrap: wrap;
  }

  .document-left {
    align-items: flex-start;
  }
}
</style>