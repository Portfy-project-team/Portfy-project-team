import { defineStore } from 'pinia';
import { authService } from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token:       localStorage.getItem('token') || null,
    utilisateur: JSON.parse(localStorage.getItem('utilisateur') || 'null'),
    chargement:  false,
    erreur:      null
  }),

  getters: {
    estConnecte:   (state) => !!state.token,
    estEtudiant:   (state) => state.utilisateur?.role === 'etudiant',
    estProfesseur: (state) => state.utilisateur?.role === 'professeur',
    estAdmin:      (state) => state.utilisateur?.role === 'admin'
  },

  actions: {
    async connexion(email, motDePasse) {
      this.chargement = true;
      this.erreur     = null;
      try {
        const response = await authService.connexion({
          email,
          mot_de_passe: motDePasse
        });
        const { token, utilisateur } = response.data;
        this.token       = token;
        this.utilisateur = utilisateur;
        localStorage.setItem('token',       token);
        localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
        return true;
      } catch (err) {
        this.erreur = err.response?.data?.message || 'Erreur de connexion';
        return false;
      } finally {
        this.chargement = false;
      }
    },

    async inscription(data) {
      this.chargement = true;
      this.erreur     = null;
      try {
        await authService.inscription(data);
        return true;
      } catch (err) {
        this.erreur = err.response?.data?.message || 'Erreur inscription';
        return false;
      } finally {
        this.chargement = false;
      }
    },

    deconnexion() {
      this.token       = null;
      this.utilisateur = null;
      localStorage.removeItem('token');
      localStorage.removeItem('utilisateur');
    }
  }
});