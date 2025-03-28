const Router = require('express')
const router = new Router()
const usersController = require('../../controllers/usersController')
const authMiddleware = require('../../middleware/authMiddleware')

router.post('/login', usersController.login)
router.get('/find_email', usersController.find_mail)
router.post('/recovery_password', usersController.recovery_password)
router.post('/check_code', usersController.check_code)
router.get('/auth', authMiddleware, usersController.check)
router.get('/list', usersController.list)
router.put('/edit', usersController.update)
router.delete('/delete', usersController.delete)

module.exports = router