const Router = require('express')
const router = new Router()
const sellController = require('../controllers/sellController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

// router.get('/', checkRole('ADMINISTRATOR'), clientsController.fetch)
router.get('/', sellController.fetch)
router.post('/', sellController.create)
router.put('/:id', sellController.update)
router.delete('/:id', sellController.delete)

module.exports = router