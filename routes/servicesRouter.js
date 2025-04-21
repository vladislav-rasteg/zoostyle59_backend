const Router = require('express')
const router = new Router()
const servicesConteoller = require('../controllers/servicesController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/add', checkRole('ADMINISTRATOR'), servicesConteoller.create)
router.get('/', servicesConteoller.fetch)
router.get('/grouped', servicesConteoller.groupedServices)
router.put('/update', checkRole('ADMINISTRATOR'), servicesConteoller.update)
router.delete('/delete', checkRole('ADMINISTRATOR'), servicesConteoller.delete)

router.post('/group/create', checkRole('ADMINISTRATOR'), servicesConteoller.createGroup)
router.put('/group/update', checkRole('ADMINISTRATOR'), servicesConteoller.updateGroup)
router.delete('/group/delete', checkRole('ADMINISTRATOR'), servicesConteoller.deleteGroup)
router.put('/move', checkRole('ADMINISTRATOR'),  servicesConteoller.move)

module.exports = router