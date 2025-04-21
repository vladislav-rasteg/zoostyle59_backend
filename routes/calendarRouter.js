const Router = require('express');
const router = new Router();
const calendarController = require('../controllers/calendarController');
const checkSubscribtion = require('../middleware/checkSubscribtionMiddleware');

router.get('/', calendarController.list);

module.exports = router;
