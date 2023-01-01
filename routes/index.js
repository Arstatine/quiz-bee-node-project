const express = require('express');
const router = express();
const usersRouter = require('./users');
const homeRouter = require('./home');
const createRouter = require('./create');
const dashboardRouter = require('./dashoard');

router.use(usersRouter);
router.use(homeRouter);
router.use(createRouter);
router.use(dashboardRouter);

module.exports = router;
