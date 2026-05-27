<script setup>
import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'

import { stages } from '../../data/mockData.js'
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Stages" user-initials="AA" />

      <main class="stages-page">
        <section class="page-header">
          <div>
            <h2>Mes stages</h2>
            <p>Gerez vos experiences professionnelles</p>
          </div>

          <button class="primary-btn">
            Nouveau stage
          </button>
        </section>

        <section class="stages-list">
          <article
            v-for="stage in stages"
            :key="stage.id"
            class="stage-card"
          >
            <div class="stage-header">
              <div class="stage-left">
                <div :class="['stage-icon', stage.iconColor]"></div>

                <div>
                  <h3>{{ stage.company }}</h3>
                  <h4>{{ stage.position }}</h4>
                  <p>
                    {{ stage.location }} - {{ stage.period }}
                    <span>({{ stage.duration }})</span>
                  </p>
                </div>
              </div>

              <StatusBadge :status="stage.status" />
            </div>

            <div class="stage-body">
              <div class="missions">
                <h5>MISSIONS REALISEES</h5>

                <ul>
                  <li
                    v-for="mission in stage.missions"
                    :key="mission"
                  >
                    {{ mission }}
                  </li>
                </ul>
              </div>

              <div class="technologies">
                <h5>TECHNOLOGIES</h5>

                <div class="tags">
                  <span
                    v-for="tech in stage.technologies"
                    :key="tech"
                    class="tag"
                  >
                    {{ tech }}
                  </span>
                </div>

                <div class="supervisors">
                  <p>
                    <strong>Encadrant entreprise:</strong>
                    {{ stage.companySupervisor }}
                  </p>
                  <p>
                    <strong>Encadrant academique:</strong>
                    {{ stage.academicSupervisor }}
                  </p>
                </div>
              </div>
            </div>

            <div class="stage-footer">
              <span
                v-if="stage.validationMessage"
                class="validation-pill"
              >
                {{ stage.validationMessage }}
              </span>

              <button class="edit-btn">
                Modifier
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  </div>
</template>

