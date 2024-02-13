const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter a valid email address'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter a valid password'],
        minlength: [6, 'Minimum length of the password should be 6 characters'],
    }
});

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// Static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        throw Error("incorrect email");
    }

    const authSuccess = await bcrypt.compare(password, user.password);
    if (!authSuccess) {
        throw Error("incorrect password");
    }

    return user;
};

const User = mongoose.model('user', userSchema);

module.exports = User;