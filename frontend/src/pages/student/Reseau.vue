<script setup>
import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'

import { networkStudents } from '../../data/mockData.js'
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Reseau etudiants" user-initials="AA" />

      <main class="network-page">
        <section class="page-header">
          <h2>Reseau etudiants</h2>
          <p>Decouvrez les portfolios des autres etudiants de votre reseau</p>
        </section>

        <section class="filters-card">
          <input
            type="text"
            placeholder="Rechercher par nom, badge ou projet..."
          />

          <select>
            <option>Toutes les filieres</option>
          </select>

          <select>
            <option>Tous les badges</option>
          </select>

          <select>
            <option>Tous les scores</option>
          </select>
        </section>

        <section class="table-card">
          <table class="network-table">
            <thead>
              <tr>
                <th>ETUDIANT</th>
                <th>FILIERE</th>
                <th>ETABLISSEMENT</th>
                <th>SCORE</th>
                <th>BADGES</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="student in networkStudents"
                :key="student.id"
              >
                <td>
                  <div class="student-cell">
                    <div :class="['avatar', student.avatarColor]">
                      {{ student.initials }}
                    </div>

                    <div>
                      <h3>{{ student.name }}</h3>
                      <p>{{ student.year }}</p>
                    </div>
                  </div>
                </td>

                <td>{{ student.field }}</td>
                <td>{{ student.school }}</td>

                <td>
                  <div class="score-cell">
                    <strong>{{ student.score }}</strong>
                    <span :class="['level-badge', student.levelClass]">
                      {{ student.level }}
                    </span>
                  </div>
                </td>

                <td>
                  <div class="badges-list">
                    <span
                      v-for="badge in student.badges"
                      :key="badge"
                      class="mini-badge"
                    >
                      {{ badge }}
                    </span>
                  </div>
                </td>

                <td>
                  <button class="portfolio-btn">
                    Voir portfolio
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  </div>
</template>

