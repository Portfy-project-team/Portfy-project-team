<template>
  <div class="landing-page">
    <nav class="navbar">
      <div class="brand">
        <div class="brand-icon">
          <i class="ti ti-network"></i>
        </div>
        <span class="brand-name">Portfy</span>
      </div>
      <div class="nav-actions">
        <RouterLink to="/login" class="btn-login">
          Connexion
        </RouterLink>

        <RouterLink to="/register" class="btn-register">
          S'inscrire
        </RouterLink>
      </div>
    </nav>

    <section class="hero">
      <div class="badge">
        <i class="ti ti-sparkles"></i>
        <span>Plateforme académique certifiée</span>
      </div>

      <h1>
        Votre portfolio académique,
        <span>certifié</span>
        et valorisé
      </h1>

      <p>
        Construisez un portfolio professionnel validé par votre institution.
        Projets, stages et compétences vérifiés pour convaincre les recruteurs.
      </p>

      <div class="hero-actions">
        <RouterLink to="/register" class="btn-primary">
          Commencer gratuitement
          <i class="ti ti-arrow-right"></i>
        </RouterLink>

        <button class="btn-secondary">
          <i class="ti ti-player-play"></i>
          Voir la démo
        </button>
      </div>

      <div class="features">
        <div class="feature-item">
          <i class="ti ti-shield-check"></i>
          <span>Validé par votre école</span>
        </div>

        <div class="feature-item">
          <i class="ti ti-brand-github"></i>
          <span>Connecté à GitHub</span>
        </div>

        <div class="feature-item">
          <i class="ti ti-file-export"></i>
          <span>Export PDF</span>
        </div>
      </div>
    </section>

    <footer class="footer">
      <span>© 2026 Portfy — ENSA Tanger</span>

      <div class="footer-links">
        <a href="#">Confidentialité</a>
        <a href="#">Conditions</a>
        <a href="#">Aide</a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.landing-page {
  background: #0f1e3d;
  min-height: 100vh;
  width: 100%;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Navbar */
.navbar {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #f59e0b 0%, #0d9488 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-icon i {
  color: #ffffff;
  font-size: 20px;
}

.brand-name {
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-links a {
  color: #ffffff;
  font-size: 14px;
  text-decoration: none;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-login {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 14px;
  padding: 8px 16px;
  cursor: pointer;
  text-decoration: none;
}

.btn-register {
  background: #f59e0b;
  border: none;
  color: #ffffff;
  font-size: 14px;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
}

/* Hero */
.hero {
  flex: 1;
  padding: 60px 40px 60px;
  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(13, 148, 136, 0.15);
  border: 1px solid rgba(13, 148, 136, 0.3);
  padding: 6px 14px;
  border-radius: 20px;
  margin-bottom: 32px;
}

.badge i {
  color: #0d9488;
  font-size: 14px;
}

.badge span {
  color: #5eead4;
  font-size: 13px;
}

.hero h1 {
  color: #ffffff;
  font-size: 52px;
  font-weight: 600;
  line-height: 1.15;
  margin: 0 auto 24px;
  max-width: 760px;
}

.hero h1 span {
  color: #f59e0b;
}

.hero p {
  color: #94a3b8;
  font-size: 17px;
  line-height: 1.6;
  max-width: 580px;
  margin: 0 auto 40px;
}

.hero-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
}

.btn-primary {
  background: #f59e0b;
  color: #ffffff;
  border: none;
}

.btn-secondary {
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-primary i,
.btn-secondary i {
  font-size: 18px;
}

/* Features */
.features {
  display: flex;
  gap: 32px;
  justify-content: center;
  align-items: center;
  margin-top: 64px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.feature-item i {
  color: #0d9488;
  font-size: 18px;
}

.feature-item span {
  color: #ffffff;
  font-size: 13px;
}

/* Footer */
.footer {
  height: 72px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.footer span {
  color: #64748b;
  font-size: 13px;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.footer-links a {
  color: #64748b;
  font-size: 13px;
  text-decoration: none;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    height: auto;
    padding: 18px 24px;
    flex-direction: column;
    gap: 18px;
  }

  .nav-links {
    gap: 18px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-actions {
    flex-wrap: wrap;
    justify-content: center;
  }

  .hero {
    padding: 60px 24px;
  }

  .hero h1 {
    font-size: 36px;
  }

  .hero p {
    font-size: 15px;
  }

  .features {
    gap: 18px;
    margin-top: 44px;
  }

  .footer {
    height: auto;
    padding: 24px;
    flex-direction: column;
    gap: 14px;
    text-align: center;
  }

  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>