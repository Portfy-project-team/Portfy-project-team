<template>
  <div class="admin-user-detail-page">
    <AdminSidebar />
    <div class="admin-main">
      <AdminTopbar title="Détails de l'utilisateur" />
      <main class="admin-content">
        <section class="page-header">
          <h1>Détails de l'utilisateur</h1>
          <button class="back-btn" @click="$router.back()">Retour</button>
        </section>
        <div class="user-detail-card" v-if="user">
          <div class="detail-row">
            <strong>Nom:</strong> <span>{{ user.name }}</span>
          </div>
          <div class="detail-row">
            <strong>Email:</strong> <span>{{ user.email }}</span>
          </div>
          <div class="detail-row">
            <strong>Rôle:</strong> <span>{{ user.role }}</span>
          </div>
          <div class="detail-row">
            <strong>Établissement:</strong> <span>{{ user.establishment }}</span>
          </div>
          <div class="detail-row">
            <strong>Statut:</strong> <span>{{ user.status }}</span>
          </div>
        </div>
        <div v-else>
          <p>Utilisateur non trouvé.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useAdminStore } from '@/store/admin/adminStore'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminTopbar from '@/components/admin/AdminTopbar.vue'

const route = useRoute()
const adminStore = useAdminStore()

const user = computed(() => adminStore.getUserById(route.params.id))
</script>

<style scoped>
.admin-user-detail-page {
  display: flex;
  min-height: 100vh;
  background-color: #f4f7fa;
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.admin-content {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.user-detail-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.detail-row {
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
}

.back-btn {
  padding: 8px 16px;
  background: #062f4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
