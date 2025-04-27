const Router = require('express');
const router = new Router();
const checkRole = require('../middleware/checkRoleMiddleware');

const usersRouter = require('./usersRouter');
const clientRouter = require('./clientRouter');
const serviceRouter = require('./servicesRouter');
const calendarRouter = require('./calendarRouter');
const petRouter = require('./petRouter');
const positionsRouter = require('./positionRouter');
const appointmentRouter = require('./appointmentRouter');
const productRouter = require('./productRouter');
const sellRouter = require('./sellRouter');
const purchaseRouter = require('./purchaseRouter');

router.use('/user', usersRouter);
router.use('/client', clientRouter);
router.use('/pet', petRouter);
router.use('/calendar', checkRole('USER', 'ADMINISTRATOR'), calendarRouter);
router.use('/service', serviceRouter);
router.use('/product', checkRole('ADMINISTRATOR'), productRouter);
router.use('/sell', checkRole('ADMINISTRATOR'), sellRouter);
router.use('/purchase', checkRole('ADMINISTRATOR'), purchaseRouter);
router.use('/positions', positionsRouter);
router.use('/appointment', appointmentRouter);

module.exports = router;
