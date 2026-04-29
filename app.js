require('dotenv').config();
const { connectDB } = require('./config/db');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// setup template engine
app.set('view engine', 'ejs');
app.set('views', './view');

// serving file statis dari folder public
app.use(express.static('public'));

// parsing request body dari form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
const indexRouter = require('./src/route/index');
app.use('/', indexRouter);

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});