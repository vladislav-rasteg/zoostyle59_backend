const Router = require('express');
const router = new Router();
const checkRole = require('../middleware/checkRoleMiddleware');

// const adminRouter = require('./admin/index');
// const publicRouter = require('./public/index');

const usersRouter = require('./usersRouter');
const clientRouter = require('./clientRouter');
const serviceRouter = require('./servicesRouter');
const calendarRouter = require('./calendarRouter');
const petRouter = require('./petRouter');
const positionsRouter = require('./positionRouter');
const appointmentRouter = require('./appointmentRouter');
// const categoryRouter = require('./categoryRouter');
// const productRouter = require('./productRouter');
// const orderRouter = require('./orderRouter');
// const recipeRouter = require('./recipeRouter');

router.use('/user', usersRouter);
router.use('/client', clientRouter);
router.use('/pet', petRouter);
router.use('/calendar', checkRole('USER', 'ADMINISTRATOR'), calendarRouter);
router.use('/service', serviceRouter);
router.use('/positions', positionsRouter);
router.use('/appointment', appointmentRouter);
// router.use('/category', checkRole('ADMINISTRATOR'), categoryRouter);
// router.use('/product', checkRole('ADMINISTRATOR'), productRouter);
// router.use('/order', checkRole('ADMINISTRATOR'), orderRouter);
// router.use('/recipe', checkRole('ADMINISTRATOR'), recipeRouter);

module.exports = router;
