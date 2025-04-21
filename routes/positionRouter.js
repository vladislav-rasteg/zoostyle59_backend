const Router = require('express')
const router = new Router()
const positionsController = require('../controllers/positionsController')
const checkRole = require('../middleware/checkRoleMiddleware')
const checkSubscribtion = require('../middleware/checkSubscribtionMiddleware');

router.post('/add', positionsController.add)
router.put('/edit', positionsController.update)
router.delete('/delete', positionsController.delete)
router.get('/list', positionsController.getAll)
router.get('/:id', positionsController.getOne)

module.exports = router