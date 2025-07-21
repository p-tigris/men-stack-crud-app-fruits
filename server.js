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

// adding middleware for app
app.use(express.urlencoded({ extended: false }));


app.get('/', async (req, res) => {
    res.render("index.ejs");
});

app.get('/fruits', async (req, res) => {
    const allFruits = await Fruit.find({});

    res.render('fruits/index.ejs', { fruits: allFruits });
});

// GET /fruits/new
app.get('/fruits/new', (req, res) => {
    res.render("fruits/new.ejs");
})

// POST /fruits
app.post('/fruits', async (req, res) => {
    if (req.body.isReadyToEat === 'on') {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }

    await Fruit.create(req.body); // this line is the database transaction
    res.redirect('/fruits/');
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
