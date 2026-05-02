import { Router } from 'express'
import ProjectController from '../controllers/project.controller.js'
import { verifierToken, verifierRole } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/',                  verifierToken, verifierRole('etudiant'),   ProjectController.creer)
router.get('/mes-projets',        verifierToken,                             ProjectController.getMesProjets)
router.get('/en-attente',         verifierToken, verifierRole('professeur'), ProjectController.getProjetsEnAttente)
router.put('/:id/valider',        verifierToken, verifierRole('professeur'), ProjectController.valider)
router.get('/portfolio/:etudiant_id',                                        ProjectController.getPortfolioPublic)

export default router