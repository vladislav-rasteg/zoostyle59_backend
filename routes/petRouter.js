const Router = require('express')
const router = new Router()
const petsController = require('../controllers/petsController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

// router.get('/', checkRole('ADMINISTRATOR'), clientsController.fetch)
router.get('/', petsController.fetch)
router.get('/:id', checkRole('ADMINISTRATOR'), petsController.fetchOne)
router.post('/', petsController.create)
router.put('/:id', petsController.update)
router.delete('/:id', petsController.delete)

module.exports = router