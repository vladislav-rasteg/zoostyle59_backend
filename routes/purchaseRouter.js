const Router = require('express')
const router = new Router()
const purchaseController = require('../controllers/purchaseController')

router.get('/', purchaseController.fetch)
router.post('/', purchaseController.create)
router.put('/:id', purchaseController.update)
router.delete('/:id', purchaseController.delete)

module.exports = router