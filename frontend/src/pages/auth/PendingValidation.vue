<template>
  <div class="pending-page">
    <div class="pending-card">
      <div class="pending-icon">⏳</div>
      <h2>Compte en attente de validation</h2>
      <p>
        Votre dossier a bien été reçu. Un administrateur va vérifier
        votre document justificatif et activer votre compte sous
        <strong>24 à 48h</strong>.
      </p>
      <p class="pending-sub">
        Vous recevrez un e-mail dès que votre compte sera validé.
      </p>
      <button class="btn-back-login" @click="router.push('/login')">
        Retour à la connexion
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.pending-page {
  min-height: 100vh;
  background: #f4f6fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pending-card {
  background: #fff;
  border-radius: 20px;
  padding: 48px 40px;
  max-width: 460px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
}

.pending-icon {
  font-size: 52px;
  margin-bottom: 20px;
}

h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1a1f36;
  margin-bottom: 14px;
}

p {
  font-size: 14px;
  color: #555;
  line-height: 1.7;
  margin-bottom: 10px;
}

.pending-sub { color: #aaa; }

.btn-back-login {
  margin-top: 24px;
  background: #f9a825;
  color: #1a1f36;
  border: none;
  border-radius: 10px;
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
</style>