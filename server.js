const dotenv = require('dotenv'); // bringing the functionality of dotenv
dotenv.config(); // using dotenv to bring the variables from the .env file

const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
})

// Import the fruit model
const Fruit = require('./models/fruit.js');

app.get('/', async (req, res) => {
    res.render("index.ejs");
});

// GET /fruits/new
app.get('/fruits/new', (req, res) => {
    res.render("fruits/new.ejs");
})

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
