const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'A user must provide their fullname'],
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'A user must have an email'],
        validate: [validator.isEmail, 'Enter a valid email'],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'A user must provide a password'],
    },
    passwordConfirm: {
        type: String,
        required: [true, 'A user must confirm their password'],
        validate: {
            // validator only works on create or on save
            validator: function(el) {
                return el === this.password;
            },
            message: 'Password are not the same'
        }
    }
});

const saltRounds = 12;
userSchema.pre('save', async function(next) {
    if(this.isModified('password')) return next();

    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;

    // delete the confirmpassword field (undefined is best in objects)
    this.passwordConfirm = undefined;

    next();
})

const User = mongoose.model('User', userSchema);
module.exports = User;