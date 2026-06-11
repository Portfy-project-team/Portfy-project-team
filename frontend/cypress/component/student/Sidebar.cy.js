import Sidebar from '@/components/student/Sidebar.vue'
import { createRouter, createMemoryHistory } from 'vue-router'

describe('Sidebar.vue — Composant Student', () => {
  let router

  const makeRouter = () => {
    return createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/login', component: { template: '<div>Login</div>' } },
        { path: '/student/dashboard', component: { template: '<div>Dashboard</div>' } },
        { path: '/student/projects', component: { template: '<div>Projects</div>' } },
        { path: '/student/stages', component: { template: '<div>Stages</div>' } },
        { path: '/student/portfolio', component: { template: '<div>Portfolio</div>' } },
        { path: '/student/activites', component: { template: '<div>Activites</div>' } },
        { path: '/student/formations', component: { template: '<div>Formations</div>' } },
        { path: '/student/competences', component: { template: '<div>Competences</div>' } },
        { path: '/student/lettres', component: { template: '<div>Lettres</div>' } },
        { path: '/student/badges', component: { template: '<div>Badges</div>' } },
        { path: '/student/reseau', component: { template: '<div>Reseau</div>' } },
        { path: '/student/recommendations', component: { template: '<div>Recommendations</div>' } },
        { path: '/student/commentaires', component: { template: '<div>Commentaires</div>' } },
        { path: '/student/historique', component: { template: '<div>Historique</div>' } },
        { path: '/student/notifications', component: { template: '<div>Notifications</div>' } },
        { path: '/student/parametres', component: { template: '<div>Parametres</div>' } },
        { path: '/student/aide', component: { template: '<div>Aide</div>' } },
      ],
    })
  }

  const mountSidebar = () => {
    cy.mount(Sidebar, {
      global: {
        plugins: [router],
      },
    })
  }

  beforeEach(() => {
    router = makeRouter()
    cy.wrap(router.push('/student/dashboard'))
    cy.wrap(router.isReady())
  })

  it('se monte sans erreur', () => {
    mountSidebar()

    cy.get('.sidebar').should('exist')
  })

  it('affiche le logo Portfy', () => {
    mountSidebar()

    cy.get('.logo-text').should('contain', 'Portfy')
  })

  it('affiche le profil et le score', () => {
    mountSidebar()

    cy.get('.profile-name').should('contain', 'Ahmed Alami')
    cy.get('.avatar').should('contain', 'AA')
    cy.get('.score-badge').should('contain', '82/100')
  })

  it('affiche les liens principaux', () => {
    mountSidebar()

    cy.get('.nav-item').should('have.length.at.least', 10)

    cy.contains('.nav-item', 'Dashboard').should('exist')
    cy.contains('.nav-item', 'Projects').should('exist')
    cy.contains('.nav-item', 'Stages').should('exist')
    cy.contains('.nav-item', 'Portfolio').should('exist')
    cy.contains('.nav-item', 'Activités').should('exist')
    cy.contains('.nav-item', 'Formations').should('exist')
    cy.contains('.nav-item', 'Compétences').should('exist')
    cy.contains('.nav-item', 'Notifications').should('exist')
    cy.contains('.nav-item', 'Paramètres').should('exist')
    cy.contains('.nav-item', 'Aide & Support').should('exist')
  })

  it('applique la classe active sur Dashboard', () => {
    mountSidebar()

    cy.contains('.nav-item', 'Dashboard').should('have.class', 'active')
  })

  it('ferme et ouvre la sidebar avec le bouton toggle', () => {
    mountSidebar()

    cy.get('.sidebar').should('not.have.class', 'closed')
    cy.get('.toggle-btn').click()
    cy.get('.sidebar').should('have.class', 'closed')
    cy.get('.logo-text').should('not.exist')

    cy.get('.toggle-btn').click()
    cy.get('.sidebar').should('not.have.class', 'closed')
    cy.get('.logo-text').should('contain', 'Portfy')
  })

  it('redirige vers login au clic sur Deconnexion', () => {
    mountSidebar()

    cy.get('.logout-btn').click()

    cy.then(() => {
      expect(router.currentRoute.value.path).to.eq('/login')
    })
  })
})