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
