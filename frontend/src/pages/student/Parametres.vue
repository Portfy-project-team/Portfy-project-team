<script setup>
import { reactive } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'

import { userSettings } from '../../data/mockData.js'

const form = reactive({
  personal: { ...userSettings.personal },
  academic: { ...userSettings.academic },
  appearance: { ...userSettings.appearance },
  notificationPreferences: userSettings.notificationPreferences.map((item) => ({ ...item }))
})
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Parametres" user-initials="AA" />

      <main class="settings-page">
        <section class="page-header">
          <h2>Parametres du compte</h2>
          <p>Gerez votre profil et vos preferences</p>
        </section>

        <section class="settings-grid">
          <div class="left-column">
            <article class="settings-card">
              <h3>Informations personnelles</h3>
              <p class="card-subtitle">Mettez a jour votre profil etudiant</p>

              <div class="photo-row">
                <div class="avatar">
                  {{ form.personal.initials }}
                </div>

                <div>
                  <button class="dark-btn">Changer la photo</button>
                  <p class="hint">JPG, PNG. Max 2MB</p>
                </div>
              </div>

              <div class="form-grid">
                <label>
                  Prenom
                  <input v-model="form.personal.firstName" type="text" />
                </label>

                <label>
                  Nom
                  <input v-model="form.personal.lastName" type="text" />
                </label>

                <label>
                  Email
                  <input v-model="form.personal.email" type="email" />
                </label>

                <label>
                  Telephone
                  <input v-model="form.personal.phone" type="text" />
                </label>

                <label class="full">
                  Bio / Presentation
                  <textarea v-model="form.personal.bio"></textarea>
                </label>

                <label>
                  Ville
                  <input v-model="form.personal.city" type="text" />
                </label>

                <label>
                  Pays
                  <select v-model="form.personal.country">
                    <option>Maroc</option>
                    <option>France</option>
                    <option>Canada</option>
                  </select>
                </label>
              </div>

              <button class="save-btn">
                Enregistrer les modifications
              </button>
            </article>

            <article class="settings-card">
              <h3>Informations academiques</h3>
              <p class="card-subtitle">Votre parcours et institution</p>

              <div class="form-grid">
                <label>
                  Etablissement
                  <select v-model="form.academic.school">
                    <option>ENSA Tanger</option>
                    <option>ENSA Fes</option>
                    <option>ENSA Marrakech</option>
                  </select>
                </label>

                <label>
                  Filiere
                  <select v-model="form.academic.field">
                    <option>Genie Informatique</option>
                    <option>Genie Industriel</option>
                    <option>Genie Electrique</option>
                  </select>
                </label>

                <label>
                  Annee d'etudes
                  <select v-model="form.academic.year">
                    <option>1ere annee</option>
                    <option>2eme annee</option>
                    <option>3eme annee</option>
                  </select>
                </label>

                <label>
                  Annee promotion
                  <input v-model="form.academic.graduationYear" type="text" />
                </label>
              </div>

              <button class="save-small-btn">
                Enregistrer
              </button>
            </article>
          </div>

          <aside class="right-column">
            <article class="settings-card small-card">
              <h3>Notifications</h3>
              <p class="card-subtitle">Gerez vos alertes</p>

              <div class="toggle-list">
                <div
                  v-for="item in form.notificationPreferences"
                  :key="item.id"
                  class="toggle-row"
                >
                  <span>{{ item.label }}</span>

                  <button
                    :class="['toggle', { active: item.enabled }]"
                    @click="item.enabled = !item.enabled"
                  >
                    <span></span>
                  </button>
                </div>
              </div>
            </article>

            <article class="settings-card small-card">
              <h3>Securite</h3>
              <p class="card-subtitle">Protegez votre compte</p>

              <button class="outline-btn">
                Changer le mot de passe
              </button>

              <button class="outline-btn">
                Activer 2FA
              </button>
            </article>

            <article class="settings-card small-card">
              <h3>Apparence</h3>
              <p class="card-subtitle">Personnalisez l'interface</p>

              <label class="select-label">
                Theme
                <select v-model="form.appearance.theme">
                  <option>Clair</option>
                  <option>Sombre</option>
                </select>
              </label>

              <label class="select-label">
                Langue
                <select v-model="form.appearance.language">
                  <option>Francais</option>
                  <option>Anglais</option>
                  <option>Arabe</option>
                </select>
              </label>
            </article>

            <article class="danger-card">
              <h3>Zone de danger</h3>
              <p>Actions irreversibles</p>

              <button class="danger-outline">
                Desactiver le portfolio
              </button>

              <button class="danger-btn">
                Supprimer le compte
              </button>
            </article>
          </aside>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.student-layout {
  display: flex;
  min-height: 100vh;
  background: #f4f1ec;
}

.student-main {
  flex: 1;
  min-width: 0;
  background: #f4f1ec;
}

.settings-page {
  padding: 32px 38px 60px;
}

.page-header {
  margin-bottom: 22px;
}

.page-header h2 {
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 800;
  color: #050505;
}

.page-header p {
  margin: 0;
  color: #64748b;
  font-size: 17px;
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 22px;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.settings-card,
.danger-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
}

.settings-card h3,
.danger-card h3 {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 800;
  color: #050505;
}

.card-subtitle,
.danger-card p {
  margin: 0 0 18px;
  color: #64748b;
  font-size: 15px;
}

.photo-row {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 22px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #082a47;
  color: #f0a91f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 900;
}

.dark-btn,
.save-btn,
.save-small-btn {
  background: #082a47;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
}

.dark-btn {
  padding: 11px 22px;
}

.save-btn {
  padding: 15px 28px;
  margin-top: 18px;
}

.save-small-btn {
  padding: 14px 28px;
  margin-top: 18px;
}

.hint {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 13px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

label {
  color: #334155;
  font-size: 14px;
  font-weight: 600;
}

label.full {
  grid-column: 1 / -1;
}

input,
select,
textarea {
  width: 100%;
  box-sizing: border-box;
  margin-top: 8px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 8px;
  padding: 12px 14px;
  color: #050505;
  font-size: 15px;
}

textarea {
  min-height: 58px;
  resize: vertical;
}

.small-card {
  padding: 22px;
}

.toggle-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #334155;
  font-size: 15px;
}

.toggle {
  width: 36px;
  height: 20px;
  border: none;
  border-radius: 999px;
  background: #cbd5e1;
  padding: 2px;
  cursor: pointer;
}

.toggle span {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffffff;
  transition: transform 0.2s ease;
}

.toggle.active {
  background: #10b981;
}

.toggle.active span {
  transform: translateX(16px);
}

.outline-btn {
  width: 100%;
  height: 42px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #082a47;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  margin-bottom: 10px;
}

.select-label {
  display: block;
  margin-bottom: 14px;
}

.danger-card {
  background: #fff1f1;
  border-color: #ff8b8b;
}

.danger-card h3 {
  color: #dc2626;
}

.danger-outline,
.danger-btn {
  width: 100%;
  height: 42px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 10px;
}

.danger-outline {
  background: #ffffff;
  color: #dc2626;
  border: 1px solid #ff8b8b;
}

.danger-btn {
  background: #c92f2f;
  color: #ffffff;
  border: 1px solid #c92f2f;
}

@media (max-width: 1100px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .settings-page {
    padding: 22px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .photo-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>