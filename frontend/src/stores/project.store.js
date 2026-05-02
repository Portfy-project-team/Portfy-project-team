import { defineStore } from 'pinia';
import { projetService } from '../services/api';

export const useProjectStore = defineStore('project', {
  state: () => ({
    projets:          [],
    projetsEnAttente: [],
    chargement:       false,
    erreur:           null
  }),

  actions: {
    async fetchMesProjets() {
      this.chargement = true;
      try {
        const response = await projetService.getMesProjets();
        this.projets   = response.data.projets;
      } catch (err) {
        this.erreur = err.response?.data?.message || 'Erreur';
      } finally {
        this.chargement = false;
      }
    },

    async creerProjet(data) {
      try {
        const response = await projetService.creer(data);
        this.projets.unshift(response.data.projet);
        return true;
      } catch (err) {
        this.erreur = err.response?.data?.message || 'Erreur création';
        return false;
      }
    },

    async fetchProjetsEnAttente() {
      this.chargement = true;
      try {
        const response        = await projetService.getEnAttente();
        this.projetsEnAttente = response.data.projets;
      } catch (err) {
        this.erreur = err.response?.data?.message || 'Erreur';
      } finally {
        this.chargement = false;
      }
    }
  }
});