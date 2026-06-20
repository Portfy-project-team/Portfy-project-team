<template>
  <div class="talent-page">

    <div class="page-header">
      <h1>Recherche des talents</h1>
      <p>
        Recherchez des étudiants selon leurs compétences,
        leur filière ou leur établissement.
      </p>
    </div>

    <!-- Barre recherche -->
    <div class="search-box">

      <input
        v-model="search"
        @keyup.enter="loadTalents"
        placeholder="Nom, compétence, établissement..."
      />

      <input
        v-model="filiere"
        @keyup.enter="loadTalents"
        placeholder="Filière"
      />

      <button @click="loadTalents">
        Rechercher
      </button>

    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      Chargement...
    </div>

    <!-- Résultats -->
    <div v-else class="talents-grid">

      <div
        v-for="talent in talents"
        :key="talent.studentId"
        class="talent-card"
      >
        <div
          class="avatar"
          :style="{ backgroundColor: talent.color }"
        >
          {{ talent.initials }}
        </div>

        <h3>
          {{ talent.studentName }}
        </h3>

        <p class="school">
          {{ talent.school }}
        </p>

        <p class="filiere">
          {{ talent.filiere }}
        </p>

        <div class="score">
          Score : {{ talent.scoreCredibilite }}
        </div>

        <div class="skills">
          <span
            v-for="tag in talent.tags"
            :key="tag"
          >
            {{ tag }}
          </span>
        </div>

        <button
          class="portfolio-btn"
          @click="openPortfolio(talent.studentId)"
        >
          Voir Portfolio
        </button>

      </div>

    </div>

    <div
      v-if="!loading && talents.length === 0"
      class="empty"
    >
      Aucun talent trouvé.
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { searchTalents } from '@/services/searchApi'

const talents = ref([])
const loading = ref(false)

const search = ref('')
const filiere = ref('')

async function loadTalents() {

  try {

    loading.value = true

    talents.value = await searchTalents({
      q: search.value,
      filiere: filiere.value
    })

  } catch (error) {

    console.error(error)

  } finally {

    loading.value = false
  }
}

import { useRouter } from 'vue-router'

const router = useRouter()

function openPortfolio(studentId) {

  router.push(
    `/portfolio/${studentId}`
  )

}

onMounted(() => {
  loadTalents()
})
</script>

<style scoped>

.talent-page {
  padding: 30px;
}

.page-header h1 {
  margin-bottom: 10px;
  color: #0f3d56;
}

.page-header p {
  color: #666;
  margin-bottom: 25px;
}

.search-box {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.search-box input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.search-box button {
  background: #eab308;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.loading {
  text-align: center;
  padding: 40px;
}

.talents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(280px,1fr));
  gap: 20px;
}

.talent-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,.08);
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 15px;
}

.talent-card h3 {
  margin-bottom: 10px;
}

.school,
.filiere {
  color: #666;
  margin-bottom: 5px;
}

.score {
  color: #0f3d56;
  font-weight: 600;
  margin: 15px 0;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.skills span {
  background: #eef3f6;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 13px;
}

.portfolio-btn {
  width: 100%;
  border: none;
  background: #0f3d56;
  color: white;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
}

.empty {
  text-align: center;
  padding: 50px;
  color: #888;
}

</style>