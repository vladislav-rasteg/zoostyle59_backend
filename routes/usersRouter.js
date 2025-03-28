const Router = require('express')
const router = new Router()
const usersController = require('../controllers/usersController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/login', usersController.login)
router.get('/auth', authMiddleware, usersController.create)
router.post('/create', checkRole('ADMINISTRATOR'), usersController.re)
router.get('/', checkRole('ADMINISTRATOR'), usersController.fetch)

module.exports = router