const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors
const handleError = (err) => {
    console.log(err.message, err.code);

    let errors = { email: "", password: ""};

    // Duplicate email
    if (err.code === 11000) {
        errors.email = "This email is already in use";
        return errors;
    }

    // Validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;
};

const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
    return token;
};

module.exports.signup_get = (req, res) => {
    res.render('signup');
};

module.exports.login_get = (req, res) => {
    res.render('login');
};

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, { maxAge: maxAge * 1000, httpOnly: true });
        res.status(201).json(user);
    }catch (err) {
        const errors = handleError(err);
        res.status(400).json({ errors });
    }
};

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    res.send('user login');
};
