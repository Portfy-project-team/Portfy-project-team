<template>
  <div class="professor-layout">
    <Sidebar :user="user" :comment-count="3" />
    <div class="main-content">
      <Topbar title="Paramètres" />

      <div class="page-content">
        <div class="page-header">
          <h2 class="page-title">Paramètres</h2>
          <p class="page-subtitle">Gérez vos informations et préférences</p>
        </div>

        <div class="settings-grid">
          <!-- Profile Section -->
          <div class="settings-card">
            <div class="section-header">
              <User size="20" />
              <h3>Profil</h3>
            </div>
            <div class="form-group">
              <label>Nom complet</label>
              <input v-model="form.fullName" type="text" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="form.email" type="email" />
            </div>
            <div class="form-group">
              <label>Téléphone</label>
              <input v-model="form.phone" type="tel" />
            </div>
            <div class="form-group">
              <label>Établissement</label>
              <input v-model="form.institution" type="text" />
            </div>
            <button class="btn-save">
              <Save size="16" />
              Enregistrer
            </button>
          </div>

          <!-- Notifications Section -->
          <div class="settings-card">
            <div class="section-header">
              <Bell size="20" />
              <h3>Notifications</h3>
            </div>
            <div class="toggle-group">
              <div class="toggle-item">
                <label>Recommandations publiées</label>
                <input v-model="notifications.recommendations" type="checkbox" class="toggle-input" />
              </div>
              <div class="toggle-item">
                <label>Nouveaux commentaires</label>
                <input v-model="notifications.comments" type="checkbox" class="toggle-input" />
              </div>
              <div class="toggle-item">
                <label>Portfolios visités</label>
                <input v-model="notifications.portfolios" type="checkbox" class="toggle-input" />
              </div>
              <div class="toggle-item">
                <label>Résumé hebdomadaire</label>
                <input v-model="notifications.weekly" type="checkbox" class="toggle-input" />
              </div>
            </div>
          </div>

          <!-- Display Section -->
          <div class="settings-card">
            <div class="section-header">
              <Settings size="20" />
              <h3>Affichage</h3>
            </div>
            <div class="form-group">
              <label>Langue</label>
              <select v-model="form.language">
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            <div class="form-group">
              <label>Thème</label>
              <select v-model="form.theme">
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>

          <!-- Privacy Section -->
          <div class="settings-card">
            <div class="section-header">
              <Lock size="20" />
              <h3>Sécurité & Confidentialité</h3>
            </div>
            <div class="form-group">
              <label>Mot de passe actuel</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div class="form-group">
              <label>Nouveau mot de passe</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div class="form-group">
              <label>Confirmer le mot de passe</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <button class="btn-save">
              <Key size="16" />
              Changer le mot de passe
            </button>
          </div>

          <!-- Danger Zone -->
          <div class="settings-card danger">
            <div class="section-header">
              <AlertTriangle size="20" />
              <h3>Zone dangereuse</h3>
            </div>
            <p class="danger-text">Ces actions sont irréversibles.</p>
            <button class="btn-danger">
              <Trash2 size="16" />
              Supprimer le compte
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '../../components/professor/Sidebar.vue'
import Topbar from '../../components/professor/Topbar.vue'
import { User, Bell, Settings, Lock, Key, AlertTriangle, Trash2, Save } from 'lucide-vue-next'

const user = { name: 'M. Ghailani', role: 'Professeur · ENSAT', verified: true }

const form = ref({
  fullName: 'M. Ghailani',
  email: 'ghailani@ensat.ma',
  phone: '+212 6 12 34 56 78',
  institution: 'ENSAT',
  language: 'fr',
  theme: 'light',
})

const notifications = ref({
  recommendations: true,
  comments: true,
  portfolios: true,
  weekly: false,
})
</script>

<style scoped>
.professor-layout { display: flex; min-height: 100vh; background: #f8f9fb; font-family: 'Inter', sans-serif; }
.main-content { flex: 1; display: flex; flex-direction: column; }
.page-content { padding: 24px 32px; }

.page-header { margin-bottom: 32px; }
.page-title { font-size: 1.4rem; font-weight: 700; color: #0f172a; margin: 0; }
.page-subtitle { color: #64748b; font-size: 0.875rem; margin: 4px 0 0; }

.settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 24px; }
@media (max-width: 900px) { .settings-grid { grid-template-columns: 1fr; } }

.settings-card { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.settings-card.danger { border-left: 4px solid #ef4444; }

.section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
.section-header h3 { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0; }
.section-header :deep(svg) { stroke-width: 2; color: #f5a623; flex-shrink: 0; }

.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 6px; }
.form-group input, .form-group select { width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.875rem; color: #0f172a; outline: none; transition: border .2s; }
.form-group input:focus, .form-group select:focus { border-color: #f5a623; }

.toggle-group { display: flex; flex-direction: column; gap: 12px; }
.toggle-item { display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #f8f9fb; border-radius: 8px; }
.toggle-item label { margin: 0; cursor: pointer; }
.toggle-input { width: 44px; height: 24px; cursor: pointer; }

.btn-save {
  width: 100%;
  padding: 12px;
  background: #f5a623;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background .2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}

.btn-save:hover { background: #e09610; }

.danger-text { color: #64748b; font-size: 0.875rem; margin-bottom: 16px; }

.btn-danger {
  width: 100%;
  padding: 12px;
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-danger:hover { background: rgba(239, 68, 68, 0.1); }

:deep(svg) {
  flex-shrink: 0;
  stroke-width: 2;
  color: currentColor;
}
</style>