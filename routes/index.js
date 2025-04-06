const Router = require('express');
const router = new Router();
const checkRole = require('../middleware/checkRoleMiddleware');

// const adminRouter = require('./admin/index');
// const publicRouter = require('./public/index');

const usersRouter = require('./usersRouter');
// const categoryRouter = require('./categoryRouter');
// const productRouter = require('./productRouter');
// const orderRouter = require('./orderRouter');
// const recipeRouter = require('./recipeRouter');

router.use('/user', usersRouter);
// router.use('/category', checkRole('ADMINISTRATOR'), categoryRouter);
// router.use('/product', checkRole('ADMINISTRATOR'), productRouter);
// router.use('/order', checkRole('ADMINISTRATOR'), orderRouter);
// router.use('/recipe', checkRole('ADMINISTRATOR'), recipeRouter);

module.exports = router;
