const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// mongo db
require('./config/db');

// access port
const PORT = process.env.PORT || 3000;

// built-in middleware (express json)
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join('node_modules', 'bootstrap', 'dist')));

// setting ejs as view-engine
app.set('view-engine', 'ejs');

// cookie and body parser middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// routers
const indexRouter = require('./routes');
app.use('/', indexRouter);

// server running
httpServer.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
