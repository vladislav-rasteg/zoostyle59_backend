const Router = require('express')
const router = new Router()
const appointmentController = require('../controllers/appointmentController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/', appointmentController.fetch)
router.post('/', checkRole('ADMINISTRATOR'), appointmentController.create)
router.put('/:id', appointmentController.update)
router.delete('/:id', checkRole('ADMINISTRATOR'), appointmentController.delete)

module.exports = router