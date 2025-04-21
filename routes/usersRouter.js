const Router = require('express')
const router = new Router()
const usersController = require('../controllers/usersController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/login', usersController.login)
router.get('/auth', authMiddleware, usersController.check)
router.post('/', checkRole('ADMINISTRATOR'), usersController.create)
router.delete('/:id', checkRole('ADMINISTRATOR'), usersController.delete)
router.put('/:id', checkRole('ADMINISTRATOR'), usersController.update)
router.get('/', checkRole('ADMINISTRATOR'), usersController.fetch)

module.exports = router