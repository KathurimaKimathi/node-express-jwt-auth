const path = require('path');
const dotenv = require('dotenv');

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

const app = express();

// Specify the path to your .env file
const envFilePath = path.resolve(__dirname, '/home/kathurima/Documents/Personal/Credentials', '.env');

// Load environmental variables from the .env file
dotenv.config({ path: envFilePath });

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const username = process.env.ATLAS_USERNAME;
const passphrase = process.env.ATLAS_PASSWORD;

const dbURI = "mongodb+srv://" + username + ":" + passphrase + "@ninjatuts.kvjscb4.mongodb.net/node-auth?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/hummingbirds', (req, res) => res.render('hummingbirds'));

app.use(authRoutes)

// set cookies
// app.get('/set-cookies', (req, res) =>{
//   res.cookie('name', 'kathurima', { maxAge: 900000, httpOnly: true });  // remember to use cookies on https requests only! add 'secure' parameter
//   res.send('you got kathurima\'s cookie');
// });

// get cookies
// app.get('/read-cookies', (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies.name);

//   res.json(cookies);
// });