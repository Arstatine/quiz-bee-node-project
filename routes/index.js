const express = require('express');
const router = express();
const usersRouter = require('./users');
const homeRouter = require('./home');
const createRouter = require('./create');
const dashboardRouter = require('./dashoard');
const reportsRouter = require('./reports');
const gameRouter = require('./game');

router.use(usersRouter);
router.use(homeRouter);
router.use(createRouter);
router.use(dashboardRouter);
router.use(reportsRouter);
router.use(gameRouter);

module.exports = router;
