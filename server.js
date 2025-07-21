const dotenv = require('dotenv'); // bringing the functionality of dotenv
dotenv.config(); // using dotenv to bring the variables from the .env file

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');

const app = express();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
})

// Import the fruit model
const Fruit = require('./models/fruit.js');

// adding middleware for app
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));


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

app.get('/fruits/:fruitId', async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);

    res.render('fruits/show.ejs', { fruit: foundFruit });
});

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

// DELETE route
app.delete('/fruits/:fruitId', async (req, res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId);
    res.redirect('/fruits');
});

app.get('/fruits/:fruitId/edit', async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    console.log(foundFruit);
    res.render('fruits/edit.ejs', { fruit: foundFruit });
})

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
