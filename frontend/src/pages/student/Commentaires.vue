<script setup>
import { computed } from 'vue'

import Sidebar from '../../components/student/Sidebar.vue'
import Topbar from '../../components/student/Topbar.vue'
import StatusBadge from '../../components/student/StatusBadge.vue'

import { comments } from '../../data/mockData.js'

const pendingComments = computed(() => {
  return comments.filter((comment) => comment.status === 'En attente')
})

const publishedComments = computed(() => {
  return comments.filter((comment) => comment.status !== 'En attente')
})
</script>

<template>
  <div class="student-layout">
    <Sidebar />

    <div class="student-main">
      <Topbar title="Commentaires" user-initials="AA" />

      <main class="comments-page">
        <section class="page-header">
          <h2>Commentaires recus</h2>
          <p>Moderez les commentaires avant leur publication</p>
        </section>

        <section class="section-banner pending">
          En attente de validation ({{ pendingComments.length }})
        </section>

        <section class="comments-list">
          <article
            v-for="comment in pendingComments"
            :key="comment.id"
            class="comment-card"
          >
            <div class="comment-top">
              <div :class="['avatar', comment.avatarColor]">
                {{ comment.initials }}
              </div>

              <div class="comment-info">
                <div class="name-line">
                  <h3>{{ comment.name }}</h3>
                  <span :class="['role-badge', comment.roleClass]">
                    {{ comment.role }}
                  </span>
                </div>

                <p>{{ comment.meta }}</p>
              </div>

              <StatusBadge :status="comment.status" />
            </div>

            <p class="comment-text">
              {{ comment.text }}
            </p>

            <div class="comment-actions">
              <button class="reject-btn">Refuser</button>
              <button class="accept-btn">Accepter</button>
            </div>
          </article>
        </section>

        <section class="section-banner published">
          Commentaires publies ({{ publishedComments.length }})
        </section>

        <section class="comments-list">
          <article
            v-for="comment in publishedComments"
            :key="comment.id"
            class="comment-card"
          >
            <div class="comment-top">
              <div :class="['avatar', comment.avatarColor]">
                {{ comment.initials }}
              </div>

              <div class="comment-info">
                <div class="name-line">
                  <h3>{{ comment.name }}</h3>
                  <span :class="['role-badge', comment.roleClass]">
                    {{ comment.role }}
                  </span>
                </div>

                <p>{{ comment.meta }}</p>
              </div>

              <StatusBadge :status="comment.status" />
            </div>

            <p class="comment-text">
              {{ comment.text }}
            </p>
          </article>
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

.comments-page {
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

.section-banner {
  padding: 15px 30px;
  border-radius: 10px;
  font-weight: 800;
  margin-bottom: 18px;
}

.section-banner.pending {
  background: #fff2d8;
  border: 1px solid #f0a91f;
  color: #082a47;
}

.section-banner.published {
  background: #d6f7e4;
  border: 1px solid #10b981;
  color: #082a47;
  margin-top: 22px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 22px;
}

.comment-top {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  flex-shrink: 0;
}

.avatar-yellow {
  background: #fff2d8;
  color: #f59e0b;
}

.avatar-blue {
  background: #dff2ff;
  color: #1d70b8;
}

.avatar-pink {
  background: #fde2e2;
  color: #dc2626;
}

.avatar-purple {
  background: #ebe7ff;
  color: #5b4cc4;
}

.comment-info {
  flex: 1;
}

.name-line {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.name-line h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #050505;
}

.comment-info p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 14px;
}

.role-badge {
  padding: 5px 10px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 800;
}

.role-prof {
  background: #fff2d8;
  color: #c77a00;
}

.role-pro {
  background: #dff2ff;
  color: #1d70b8;
}

.role-student {
  background: #fde2e2;
  color: #dc2626;
}

.comment-text {
  margin: 20px 0 18px;
  color: #082a47;
  font-size: 16px;
  line-height: 1.6;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.reject-btn,
.accept-btn {
  border-radius: 8px;
  padding: 11px 24px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.reject-btn {
  background: #ffffff;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.accept-btn {
  background: #082a47;
  border: 1px solid #082a47;
  color: #ffffff;
}

@media (max-width: 700px) {
  .comments-page {
    padding: 22px;
  }

  .comment-top {
    flex-direction: column;
  }

  .comment-actions {
    flex-direction: column;
  }

  .reject-btn,
  .accept-btn {
    width: 100%;
  }
}
</style>
