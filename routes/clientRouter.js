const Router = require('express')
const router = new Router()
const clientsController = require('../controllers/clientsController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

// router.get('/', checkRole('ADMINISTRATOR'), clientsController.fetch)
router.get('/', clientsController.fetch)
router.get('/:id', checkRole('ADMINISTRATOR'), clientsController.fetchOne)
router.post('/', clientsController.create)
router.put('/:id', clientsController.update)
router.delete('/:id', clientsController.delete)

module.exports = router