const path = require('path');
const dotenv = require('dotenv');

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const envFilePath = path.resolve(__dirname, '/home/kathurima/Documents/Personal/Credentials', '.env');
dotenv.config({ path: envFilePath });

const jwtSecret = process.env.JWT_SECRET;

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is valid
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        res.redirect('/login');
      } else {
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };